require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from .env file");
}

const ai = new GoogleGenAI({
    apiKey: apiKey
});

/**
 * Generate product intelligence using Gemini
 *
 * @param {Object} productData - Product information and retrieved products
 * @returns {Object} Parsed product intelligence
 */
async function generateProductIntelligence(productData) {
    try {
        const prompt = `
You are ProductIQ, an AI-powered product intelligence engine.

Analyze the provided product information and retrieved comparable products.

PRODUCT DATA:
${JSON.stringify(productData, null, 2)}

Your job is to generate useful, structured product intelligence.

Return ONLY valid JSON.
Do not use markdown.
Do not wrap the JSON in \`\`\`json.

Use exactly this structure:

{
  "productSummary": "",
  "marketPosition": "",
  "pricingAnalysis": {
    "currentPrice": "",
    "priceRange": "",
    "pricePosition": "",
    "priceInsight": ""
  },
  "competitorAnalysis": [
    {
      "brand": "",
      "product": "",
      "price": "",
      "comparison": ""
    }
  ],
  "keyFeatures": [],
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "overallInsight": ""
}

Rules:
1. Base the analysis only on the provided information.
2. Do not invent specifications, prices, ratings, or features.
3. If information is unavailable, use "Not available".
4. Keep the analysis concise but useful.
5. Identify meaningful differences between the target product and comparable products.
6. For pricingAnalysis, do not calculate a price if the actual price is unavailable.
7. competitorAnalysis should contain the most relevant retrieved products.
8. keyFeatures should contain important confirmed product characteristics.
9. strengths and weaknesses should be based only on available evidence.
10. recommendations should be practical product/business recommendations.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const text = response.text;

        if (!text) {
            throw new Error("Gemini returned an empty response");
        }

        // Remove accidental markdown code fences
        const cleanedText = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        let parsedResponse;

        try {
            parsedResponse = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("❌ Failed to parse Gemini JSON response:");
            console.error(cleanedText);

            throw new Error(
                "Gemini returned invalid JSON"
            );
        }

        return parsedResponse;

    } catch (error) {
        console.error("❌ Product intelligence generation failed:");
        console.error(error);

        throw error;
    }
}

module.exports = {
    generateProductIntelligence
};