const {
    retrieveRelevantProducts
} = require("../services/retrievalService");

const {
    generateProductIntelligence
} = require("../services/llmService");

const calculateDecisionMetrics = (intelligence, retrievedProducts) => {
    const keyFeatures = intelligence?.keyFeatures || [];
    const strengths = intelligence?.strengths || [];
    const weaknesses = intelligence?.weaknesses || [];
    const count = (retrievedProducts || []).length;

    let baseScore = 78;
    baseScore += Math.min(keyFeatures.length * 3, 9);
    baseScore += Math.min(strengths.length * 2, 6);
    baseScore -= Math.min(weaknesses.length * 2, 6);
    if (count >= 3) baseScore += 4;

    const overallScore = Math.min(96, Math.max(62, baseScore));

    let verdict = "STRONG CANDIDATE";
    let verdictColor = "#b8ff4a";

    if (overallScore < 72) {
        verdict = "NEEDS REVIEW";
        verdictColor = "#f59e0b";
    } else if (overallScore < 84) {
        verdict = "COMPETITIVE MATCH";
        verdictColor = "#38bdf8";
    }

    return {
        overallScore,
        verdict,
        verdictColor,
        marketFit: Math.min(98, overallScore + 2),
        specAdvantage: Math.min(95, overallScore - 3),
        procurementRisk: overallScore >= 84 ? "LOW" : "MODERATE",
        decisionRationale: intelligence?.overallInsight || `High structural match across ${count} catalog equivalents.`
    };
};

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
        console.log("PRODNEXUS ANALYSIS STARTED");
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

        const decisionScore = calculateDecisionMetrics(productIntelligence, retrievedProducts);
        productIntelligence.decisionScore = decisionScore;

        console.log(`✅ Product intelligence generated (Decision Score: ${decisionScore.overallScore}/100)`);

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