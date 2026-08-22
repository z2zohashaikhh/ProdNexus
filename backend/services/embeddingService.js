const ai = require("./geminiService");

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSION = 768;

/*
 * Create a consistent text representation of a product.
 *
 * This text is sent directly to Gemini's Embedding API.
 *
 * @param {Object} product
 * @returns {string}
 */
function createProductEmbeddingText(product) {
    const specifications = product.specifications || {};
    const sourceData = product.sourceData || {};

    return `
    MPN: ${product.mpn || "Not available"}

    Brand: ${product.brand || "Not available"}

    Manufacturer: ${product.manufacturer || "Not available"}

    Category: ${product.category || "Not available"}

    Product Type: ${product.productType || "Not available"}

    Description: ${product.description || "Not available"}

    Specifications:
    Width: ${specifications.width || "Not available"}
    Length: ${specifications.length || "Not available"}
    Diameter: ${specifications.diameter || "Not available"}
    Thickness: ${specifications.thickness || "Not available"}
    Grit: ${specifications.grit || "Not available"}
    Material: ${specifications.material || "Not available"}
    Pack Size: ${
            specifications.packSize !== null &&
            specifications.packSize !== undefined
                ? specifications.packSize
                : "Not available"
    }

    Source Brand Information:
    e1 Brand: ${sourceData.e1Brand || "Not available"}
    Unilog Brand: ${sourceData.unilogBrand || "Not available"}
    DIB Brand: ${sourceData.dibBrand || "Not available"}
    Manufacturer Raw: ${sourceData.manufacturerRaw || "Not available"}
    `.trim();
}

/*
 * Generate a vector embedding for a product using
 * Gemini's Embedding API.
 *
 * @param {Object} product
 * @returns {Object} embeddingText and embedding vector
 */
async function generateProductEmbedding(product) {
    try {
        if (!product) {
            throw new Error("Product is required");
        }

        const embeddingText = createProductEmbeddingText(product);

        if (!embeddingText.trim()) {
            throw new Error(`Embedding text is empty for product ${product.mpn || product._id}`);
        }

        console.log(`🧠 Generating embedding for: ${product.mpn || product._id}`);

        const response = await ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: embeddingText,
            config: {
                outputDimensionality: EMBEDDING_DIMENSION,
                taskType: "RETRIEVAL_DOCUMENT"
            }
        });

        if (!response || !response.embeddings || response.embeddings.length === 0) {
            throw new Error("Gemini returned no embedding");
        }

        const embedding = response.embeddings[0].values;

        if (!Array.isArray(embedding)) {
            throw new Error("Gemini returned an invalid embedding");
        }

        if (embedding.length !== EMBEDDING_DIMENSION) {
            throw new Error(`Unexpected embedding dimension. ` + `Expected ${EMBEDDING_DIMENSION}, ` + `received ${embedding.length}`);
        }

        return {
            embeddingText,
            embedding
        };

    } catch (error) {
        console.error(`❌ Embedding generation failed for ${product?.mpn || product?._id || "unknown product"}`);
        console.error(error.message);
        throw error;
    }
}

module.exports = {
    createProductEmbeddingText,
    generateProductEmbedding,
    EMBEDDING_MODEL,
    EMBEDDING_DIMENSION
};