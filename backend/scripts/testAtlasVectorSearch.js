require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

const MONGODB_URI = process.env.MONGODB_URI;
const VECTOR_INDEX_NAME = "product_vector_index";
const VECTOR_PATH = "embedding";

async function testAtlasVectorSearch() {
    try {
        console.log("🔌 Connecting to MongoDB Atlas...");

        await mongoose.connect(MONGODB_URI);

        console.log("✅ MongoDB connected");

        // Get one product that already has an embedding
        const sourceProduct = await Product.findOne({
            embedding: { $exists: true }
        }).lean();

        if (!sourceProduct) {
            throw new Error("No product with an embedding found");
        }

        console.log("");
        console.log("📦 Using existing product:");
        console.log("MPN:", sourceProduct.mpn);
        console.log("Embedding dimensions:", sourceProduct.embedding.length);

        // Search using an existing embedding.
        // This avoids calling Gemini completely.
        const results = await Product.aggregate([
            {
                $vectorSearch: {
                    index: VECTOR_INDEX_NAME,
                    path: VECTOR_PATH,
                    queryVector: sourceProduct.embedding,
                    numCandidates: 50,
                    limit: 5
                }
            },
            {
                $project: {
                    _id: 1,
                    mpn: 1,
                    description: 1,
                    brand: 1,
                    manufacturer: 1,
                    category: 1,
                    productType: 1,
                    score: {
                        $meta: "vectorSearchScore"
                    }
                }
            }
        ]);

        console.log("");
        console.log(`✅ Atlas Vector Search returned ${results.length} products`);

        results.forEach((product, index) => {
            console.log("");
            console.log(`${index + 1}. ${product.mpn}`);
            console.log("   Brand:", product.brand);
            console.log("   Score:", product.score);
        });

    } catch (error) {
        console.error("");
        console.error("❌ Atlas Vector Search test failed:");
        console.error(error);
    } finally {
        await mongoose.disconnect();
        console.log("");
        console.log("🔌 MongoDB disconnected");
    }
}

testAtlasVectorSearch();