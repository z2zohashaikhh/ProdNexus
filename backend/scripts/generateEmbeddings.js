// generates vectors for all products
require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("../models/Product");

const {
    generateProductEmbedding
} = require("../services/embeddingService");

const MONGODB_URI = process.env.MONGODB_URI;

// Small delay between API requests
const DELAY_BETWEEN_REQUESTS = 300;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateEmbeddings() {
    let processed = 0;
    let successful = 0;
    let failed = 0;

    try {
        console.log("");
        console.log("🧠 ProdNexus Embedding Generation");

        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env file");
        }

        console.log("🔌 Connecting to MongoDB Atlas...");

        await mongoose.connect(MONGODB_URI);

        console.log("✅ MongoDB Atlas Connected Successfully");

        console.log("");

        // Total products
        const totalProducts = await Product.countDocuments();

        // Products that still need embeddings
        const productsNeedingEmbeddings =
            await Product.countDocuments({
                embedding: { $exists: false }
            });

        // Products that already have embeddings
        const alreadyEmbedded = totalProducts - productsNeedingEmbeddings;

        console.log(`📦 Total products: ${totalProducts}`);

        console.log(`🧠 Products needing embeddings: ${productsNeedingEmbeddings}`);

        console.log(`✅ Already embedded: ${alreadyEmbedded}`);

        console.log("");

        // Nothing to process
        if (productsNeedingEmbeddings === 0) {
            console.log("🎉 All products already have embeddings!");

            return;
        }

        console.log("🚀 Starting embedding generation...");

        console.log("");

        // Cursor prevents loading all products into memory
        const cursor = Product.find({
            embedding: { $exists: false }
        }).cursor();

        for await (const product of cursor) {
            processed++;

            console.log(`[${processed}/${productsNeedingEmbeddings}] ` + `🧠 Processing: ${product.mpn}`);

            try {
                // Generate embedding
                const {
                    embeddingText,
                    embedding
                } = await generateProductEmbedding(product);

                // Save embedding to MongoDB
                await Product.updateOne(
                    { _id: product._id },
                    {
                        $set: {
                            embeddingText,
                            embedding
                        }
                    }
                );

                successful++;

                console.log(`   ✅ Saved ${embedding.length}-dimensional vector`);
            } catch (error) {
                failed++;
                console.error(`   ❌ Failed: ${error.message}`);
                console.error(`   ⚠️ Continuing with next product...`);
            }

            // Small delay between API calls
            if (processed < productsNeedingEmbeddings) {
                await sleep(DELAY_BETWEEN_REQUESTS);
            }
        }

        console.log("");

        console.log("🎉 EMBEDDING GENERATION COMPLETE");

        console.log(`📦 Total products: ${totalProducts}`);

        console.log(`⏭️ Already embedded: ${alreadyEmbedded}`);

        console.log(`🧠 Processed this run: ${processed}`);

        console.log(`✅ Successfully embedded: ${successful}`);

        console.log(`❌ Failed: ${failed}`);
        console.log("");

    } catch (error) {
        console.error("");
        console.error("💥 Embedding generation stopped:");
        console.error(error);

    } finally {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed.");
    }
}

generateEmbeddings();