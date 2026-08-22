const ai = require("./geminiService");

const {
    createProductIntelligencePrompt
} = require("../prompts/productIntelligencePrompt");

/*
 * Generate product intelligence using Gemini.
 *
 * @param {Object} productData
 * @returns {Object} Parsed product intelligence
 */
async function generateProductIntelligence(productData) {
    try {
        const prompt = createProductIntelligencePrompt(productData);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const text = response.text;

        if (!text) {
            throw new Error("Gemini returned an empty response");
        }

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

            throw new Error("Gemini returned invalid JSON");
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