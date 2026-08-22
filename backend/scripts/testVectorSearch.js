require("dotenv").config();

const mongoose = require("mongoose");

const {
    searchSimilarProducts
} = require("../services/vectorSearchService");

async function testVectorSearch() {
    try {
        console.log("🔌 Connecting to MongoDB Atlas...");

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB connected");

        const query =
            "Diablo sanding belt 1/2 inch 18 inch";

        console.log("");
        console.log("🔎 Searching for:", query);

        const results =
            await searchSimilarProducts(query, 5);

        console.log("");
        console.log("========== SEARCH RESULTS ==========");

        results.forEach((result, index) => {

            console.log("");
            console.log(`Result ${index + 1}`);
            console.log("MPN:", result.mpn);
            console.log("Brand:", result.brand);
            console.log("Description:", result.description);
            console.log("Category:", result.category);
            console.log("Similarity Score:", result.score);

        });

        console.log("");
        console.log("====================================");

    } catch (error) {

        console.error("");
        console.error("❌ Vector search test failed:");
        console.error(error);

    } finally {

        await mongoose.disconnect();

        console.log("");
        console.log("🔌 MongoDB disconnected");
    }
}

testVectorSearch();