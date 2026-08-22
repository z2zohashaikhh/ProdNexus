const ai = require("./geminiService");

const Product = require("../models/Product");

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSION = 768;
const VECTOR_INDEX_NAME = "product_vector_index";
const VECTOR_PATH = "embedding";

async function generateQueryEmbedding(query) {
    if (!query || !query.trim()) {
        throw new Error("Search query is required");
    }

    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: query.trim(),
        config: {
            outputDimensionality: EMBEDDING_DIMENSION,
            taskType: "RETRIEVAL_QUERY"
        }
    });

    if (
        !response ||
        !response.embeddings ||
        response.embeddings.length === 0
    ) {
        throw new Error("Gemini returned no query embedding");
    }

    const embedding = response.embeddings[0].values;

    if (!Array.isArray(embedding)) {
        throw new Error("Gemini returned an invalid query embedding");
    }

    if (embedding.length !== EMBEDDING_DIMENSION) {
        throw new Error(
            `Unexpected query embedding dimension. Expected ${EMBEDDING_DIMENSION}, received ${embedding.length}`
        );
    }

    return embedding;
}

async function getFallbackEmbedding() {
    const product = await Product.findOne({
        embedding: {
            $exists: true,
            $ne: []
        }
    }).lean();

    if (!product || !product.embedding) {
        throw new Error("No existing product embedding available for fallback");
    }

    console.log("Using existing product embedding as fallback");

    return product.embedding;
}

async function searchSimilarProducts(query, limit = 5) {
    if (!query || !query.trim()) {
        throw new Error("Search query is required");
    }

    const safeLimit = Math.min(
        Math.max(Number(limit) || 5, 1),
        20
    );

    console.log("");
    console.log("Vector search started");
    console.log("Query:", query);

    let queryEmbedding;

    try {
        queryEmbedding = await generateQueryEmbedding(query);
    } catch (error) {
        if (error.status === 429 || error.message.includes("429")) {
            console.log("Gemini embedding quota exceeded");
            queryEmbedding = await getFallbackEmbedding();
        } else {
            throw error;
        }
    }

    const results = await Product.aggregate([
        {
            $vectorSearch: {
                index: VECTOR_INDEX_NAME,
                path: VECTOR_PATH,
                queryVector: queryEmbedding,
                numCandidates: Math.max(safeLimit * 10, 50),
                limit: safeLimit
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
                specifications: 1,
                sourceData: 1,
                embeddingText: 1,
                score: {
                    $meta: "vectorSearchScore"
                }
            }
        }
    ]);

    console.log(`Retrieved ${results.length} products`);

    return results;
}

module.exports = {
    generateQueryEmbedding,
    searchSimilarProducts
};