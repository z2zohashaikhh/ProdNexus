const {
    retrieveRelevantProducts
} = require("../services/retrievalService");

const {
    generateProductIntelligence
} = require("../services/llmService");

const analyzeProduct = async (req, res) => {
    try {
        const {
            mpn,
            brand,
            description
        } = req.body;

        if (!mpn || !description) {
            return res.status(400).json({
                success: false,
                message: "Manufacturer Part Number and description are required."
            });
        }

        console.log("");
        console.log("==========================================");
        console.log("PRODUCTIQ ANALYSIS STARTED");
        console.log("==========================================");
        console.log("MPN:", mpn);
        console.log("Brand:", brand || "Not provided");
        console.log("Description:", description);

        console.log("");
        console.log("🔎 Step 1: Retrieving relevant products...");

        const retrievedProducts = await retrieveRelevantProducts({
            mpn,
            brand,
            description
        });

        console.log(`✅ Retrieved ${retrievedProducts.length} products`);

        console.log("");
        console.log("🤖 Step 2: Generating product intelligence...");

        const productIntelligence = await generateProductIntelligence({
            mpn,
            brand,
            description,
            retrievedProducts
        });

        console.log("✅ Product intelligence generated");

        return res.status(200).json({
            success: true,
            message: "Product intelligence generated successfully.",
            input: {
                mpn,
                brand: brand || "",
                description
            },
            retrieval: {
                count: retrievedProducts.length,
                results: retrievedProducts
            },
            intelligence: productIntelligence
        });
    } catch (error) {
        console.error("");
        console.error("❌ Product analysis failed:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Product analysis failed.",
            error: error.message
        });
    }
};

module.exports = {
    analyzeProduct
};