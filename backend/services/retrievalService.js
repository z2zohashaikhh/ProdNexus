const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");


// =====================================================
// DATASET PATH
// =====================================================

const datasetPath = path.join(
    __dirname,
    "../data/sample-input.csv"
);


// =====================================================
// LOAD DATASET
// =====================================================

let products = [];

let datasetLoaded = false;


const loadDataset = () => {

    return new Promise((resolve, reject) => {

        if (datasetLoaded) {
            return resolve(products);
        }


        if (!fs.existsSync(datasetPath)) {

            return reject(
                new Error(
                    `Dataset not found at: ${datasetPath}`
                )
            );

        }


        products = [];


        fs.createReadStream(datasetPath)

            .pipe(csv())

            .on("data", (row) => {

                products.push(row);

            })

            .on("end", () => {

                datasetLoaded = true;

                console.log(
                    `✅ Dataset loaded: ${products.length} products`
                );

                resolve(products);

            })

            .on("error", (error) => {

                reject(error);

            });

    });

};


// =====================================================
// NORMALIZE TEXT
// =====================================================

const normalizeText = (text) => {

    if (!text) {
        return "";
    }

    return text
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

};


// =====================================================
// TOKENIZE
// =====================================================

const tokenize = (text) => {

    return new Set(
        normalizeText(text)
            .split(" ")
            .filter(word => word.length > 2)
    );

};


// =====================================================
// CALCULATE TEXT SIMILARITY
// =====================================================

const calculateSimilarity = (
    query,
    productText
) => {

    const queryTokens = tokenize(query);

    const productTokens = tokenize(productText);


    if (queryTokens.size === 0) {
        return 0;
    }


    let matches = 0;


    queryTokens.forEach(token => {

        if (productTokens.has(token)) {
            matches++;
        }

    });


    return matches / queryTokens.size;

};


// =====================================================
// RETRIEVE RELEVANT PRODUCTS
// =====================================================

const retrieveRelevantProducts = async ({
    mpn,
    brand,
    description
}) => {

    const dataset = await loadDataset();


    const normalizedMPN =
        normalizeText(mpn);

    const normalizedBrand =
        normalizeText(brand);

    const normalizedDescription =
        normalizeText(description);


    const query = [
        normalizedMPN,
        normalizedBrand,
        normalizedDescription
    ]
        .filter(Boolean)
        .join(" ");


    // ---------------------------------------------
    // SCORE EVERY PRODUCT
    // ---------------------------------------------

    const scoredProducts = dataset.map(product => {

        const productMPN =
            normalizeText(product.Mfg_Part_Num);

        const productDescription =
            normalizeText(product.Part_Desc);

        const productBrand =
            normalizeText(product.E1_Brand);

        const productManufacturer =
            normalizeText(product.Part_Manuf);


        let score = 0;


        // -----------------------------------------
        // EXACT MPN MATCH
        // -----------------------------------------

        if (
            normalizedMPN &&
            productMPN === normalizedMPN
        ) {

            score += 1;

        }


        // -----------------------------------------
        // MPN CONTAINMENT
        // -----------------------------------------

        else if (
            normalizedMPN &&
            productMPN.includes(normalizedMPN)
        ) {

            score += 0.8;

        }


        // -----------------------------------------
        // DESCRIPTION SIMILARITY
        // -----------------------------------------

        const descriptionScore =
            calculateSimilarity(
                normalizedDescription,
                productDescription
            );

        score += descriptionScore * 0.6;


        // -----------------------------------------
        // BRAND MATCH
        // -----------------------------------------

        if (
            normalizedBrand &&
            normalizedBrand !== "unbranded" &&
            normalizedBrand !== "no brand"
        ) {

            if (
                productBrand.includes(normalizedBrand) ||
                normalizedBrand.includes(productBrand)
            ) {

                score += 0.3;

            }

        }


        // -----------------------------------------
        // MANUFACTURER RELEVANCE
        // -----------------------------------------

        if (
            normalizedBrand &&
            productManufacturer.includes(normalizedBrand)
        ) {

            score += 0.15;

        }


        return {
            product,
            score
        };

    });


    // ---------------------------------------------
    // SORT BY RELEVANCE
    // ---------------------------------------------

    scoredProducts.sort(
        (a, b) => b.score - a.score
    );


    // ---------------------------------------------
    // RETURN TOP 5
    // ---------------------------------------------

    return scoredProducts
        .slice(0, 5)
        .map(item => ({

            score: Number(
                item.score.toFixed(3)
            ),

            product: item.product

        }));

};


module.exports = {
    retrieveRelevantProducts
};