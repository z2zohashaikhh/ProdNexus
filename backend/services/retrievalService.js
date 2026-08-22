const {
    searchSimilarProducts
} = require("./vectorSearchService");

const normalize = (value) => {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const retrieveRelevantProducts = async ({
    mpn,
    brand,
    description
}) => {
    if (!mpn && !description) {
        throw new Error("MPN or description is required for retrieval");
    }

    const normalizedDescription = normalize(description);
    const normalizedBrand = normalize(brand);
    const normalizedMpn = normalize(mpn);

    const query = [
        description,
        brand
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    console.log("");
    console.log("🔎 Retrieval query:", query);

    const results = await searchSimilarProducts(query, 15);

    const descriptionWords = normalizedDescription
        .split(" ")
        .filter(word => word.length > 2);

    const scoredResults = results.map(item => {
        const product = item;

        const productDescription = normalize(product.description);
        const productType = normalize(product.productType);
        const productCategory = normalize(product.category);
        const productBrand = normalize(product.brand);
        const productMpn = normalize(product.mpn);

        const searchableText = [
            productDescription,
            productType,
            productCategory
        ]
            .filter(Boolean)
            .join(" ");

        const productWords = new Set(
            searchableText.split(" ")
        );

        let keywordMatches = 0;

        descriptionWords.forEach(word => {
            if (productWords.has(word)) {
                keywordMatches++;
            }
        });

        const keywordScore =
            descriptionWords.length > 0
                ? keywordMatches / descriptionWords.length
                : 0;

        let score = Number(item.score || 0);

        if (
            normalizedMpn &&
            productMpn === normalizedMpn
        ) {
            score = 10;
        } else {
            if (
                normalizedBrand &&
                productBrand === normalizedBrand
            ) {
                score += 0.03;
            }

            score += keywordScore * 0.35;

            const hasSanding =
                searchableText.includes("sanding");

            const hasBelt =
                searchableText.includes("belt");

            const queryHasSanding =
                normalizedDescription.includes("sanding");

            const queryHasBelt =
                normalizedDescription.includes("belt");

            if (queryHasSanding && hasSanding) {
                score += 0.35;
            }

            if (queryHasBelt && hasBelt) {
                score += 0.35;
            }

            if (
                queryHasSanding &&
                queryHasBelt &&
                !(hasSanding && hasBelt)
            ) {
                score -= 0.50;
            }
        }

        return {
            score,
            product
        };
    });

    scoredResults.sort(
        (a, b) => b.score - a.score
    );

    return scoredResults
        .slice(0, 5)
        .map(item => ({
            score: Number(
                item.score.toFixed(4)
            ),
            product: item.product
        }));
};

module.exports = {
    retrieveRelevantProducts
};