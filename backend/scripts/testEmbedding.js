require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("../models/Product");

const {
    generateProductEmbedding
} = require("../services/embeddingService");

const MONGODB_URI = process.env.MONGODB_URI;

async function testEmbedding() {
    try {
        console.log("");
        console.log("🧠 ProdNexus Embedding Test");

        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env file");
        }

        console.log("🔌 Connecting to MongoDB Atlas...");

        await mongoose.connect(MONGODB_URI);

        console.log("✅ MongoDB Atlas Connected Successfully");

        console.log("");

        // Fetch ONE product only
        const product = await Product.findOne();

        if (!product) {
            throw new Error("No products found in MongoDB");
        }

        console.log("📦 Product found:");
        console.log(`   MPN: ${product.mpn}`);
        console.log(`   Brand: ${product.brand || "N/A"}`);
        console.log(`   Manufacturer: ${product.manufacturer || "N/A"}`);
        console.log(`   Category: ${product.category || "N/A"}`);

        console.log("");
        console.log("📝 Creating embedding text...");

        const {
            embeddingText,
            embedding
        } = await generateProductEmbedding(product);

        console.log("✅ Embedding generated!");
        console.log("");

        console.log("📄 Embedding text:");
        console.log(embeddingText);

        console.log("");

        console.log("📐 Embedding information:");
        console.log(`   Dimensions: ${embedding.length}`);

        console.log(`   Data type: ${typeof embedding[0]}`);

        console.log("");

        console.log("🔢 First 10 vector values:");

        console.log(
            embedding.slice(0, 10)
        );

        console.log("");

        // Validate embedding
        if (embedding.length !== 768) {
            throw new Error(`Expected 768 dimensions but received ${embedding.length}`);
        }

        if (
            !embedding.every(value => typeof value === "number")
        ) {
            throw new Error("Embedding contains non-numeric values");
        }

        console.log("✅ Vector validation passed!");

        console.log("");

        console.log("🎉 EMBEDDING TEST SUCCESSFUL");

        console.log("");
        console.log("The product was successfully converted");

        console.log("into a 768-dimensional vector.");

        console.log("");

        console.log("🚀 We are ready for the 1,000-product batch.");
        console.log("");

    } catch (error) {
        console.error("");
        console.error("❌ EMBEDDING TEST FAILED");
        console.error("");
        console.error(error);

    } finally {
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed.");
    }
}

testEmbedding();