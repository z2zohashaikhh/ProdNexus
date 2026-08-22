const ai = require("./geminiService");

const {
    createProductIntelligencePrompt
} = require("../prompts/productIntelligencePrompt");

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
            console.error("Gemini response was not valid JSON:");
            console.error(cleanedText);
            throw new Error("Gemini returned invalid JSON");
        }

        return parsedResponse;
    } catch (error) {
        console.error("LLM service error:", error.message);
        throw error;
    }
}

module.exports = {
    generateProductIntelligence
};