// imports CSV → MongoDB
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const connectDB = require("../config/db");
const Product = require("../models/Product");

const datasetPath = path.join(
    __dirname,
    "../data/sample-input.csv"
);

const INVALID_VALUES = new Set([
    "",
    "-- Unbranded --",
    "-- No Unilog Brand --",
    "-- No DIB Brand --",
    "-- No Brand --",
    "N/A",
    "NA",
    "NULL"
]);

const clean = (value) => {
    if (value === undefined || value === null) {
        return null;
    }

    const text = String(value).trim();

    if (INVALID_VALUES.has(text)) {
        return null;
    }

    return text;
};

const normalizeBrand = (value) => {
    const brand = clean(value);

    if (!brand) {
        return null;
    }

    return brand;
};

const extractManufacturer = (value) => {
    const manufacturer = clean(value);

    if (!manufacturer) {
        return null;
    }

    return manufacturer
        .replace(/\s*\([^)]*\)\s*$/, "")
        .trim();
};

const detectBrandFromDescription = (description) => {
    if (!description) {
        return null;
    }

    const text = description.toLowerCase();

    const knownBrands = [
        "diablo",
        "3m",
        "dewalt",
        "milwaukee",
        "makita",
        "bosch",
        "mirka",
        "norton",
        "festool",
        "grizzly",
        "legrand",
        "leviton",
        "philips",
        "satco",
        "southwire",
        "trex",
        "timbertech",
        "hager"
    ];

    for (const brand of knownBrands) {
        const pattern = new RegExp(
            `\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
            "i"
        );

        if (pattern.test(text)) {
            return brand
                .split(" ")
                .map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ");
        }
    }

    return null;
};

const resolveBrand = (row, description) => {
    const e1Brand = normalizeBrand(row.E1_Brand);

    if (e1Brand) {
        return e1Brand;
    }

    const dibBrand = normalizeBrand(row.DIB_Brand);

    if (dibBrand) {
        return dibBrand;
    }

    const unilogBrand = normalizeBrand(row.Unilog_Brand);

    if (unilogBrand) {
        return unilogBrand;
    }

    return detectBrandFromDescription(description);
};

const detectCategory = (description) => {
    if (!description) {
        return "Other";
    }

    const text = description.toLowerCase();

    const categories = [
        {
            category: "Electrical",
            keywords: [
                "switch",
                "outlet",
                "receptacle",
                "wire",
                "cable",
                "bulb",
                "lamp",
                "lighting",
                "breaker",
                "electrical",
                "connector",
                "transformer"
            ]
        },
        {
            category: "Hardware",
            keywords: [
                "screw",
                "bolt",
                "nut",
                "washer",
                "hinge",
                "latch",
                "bracket",
                "fastener"
            ]
        },
        {
            category: "Abrasives",
            keywords: [
                "sanding",
                "abrasive",
                "cut-off disc",
                "cut off disc",
                "cubitron",
                "hiolit",
                "abranet"
            ]
        },
        {
            category: "Tools",
            keywords: [
                "snip",
                "plier",
                "pliers",
                "wrench",
                "hammer",
                "saw",
                "blade",
                "drill",
                "driver",
                "cutter",
                "tool"
            ]
        },
        {
            category: "Building Materials",
            keywords: [
                "siding",
                "decking",
                "door",
                "window",
                "trim",
                "roofing",
                "lumber"
            ]
        }
    ];

    for (const group of categories) {
        if (
            group.keywords.some(keyword =>
                text.includes(keyword)
            )
        ) {
            return group.category;
        }
    }

    return "Other";
};

const detectProductType = (description) => {
    if (!description) {
        return null;
    }

    const text = description.toLowerCase();

    const productTypes = [
        ["Sanding Belt", ["sanding belt"]],
        [
            "Metal Cut-Off Disc",
            ["metal cut-off disc", "metal cut off disc"]
        ],
        ["Sanding Disc", ["sanding disc"]],
        ["Sanding Sponge", ["sanding sponge"]],
        ["Cutting Disc", ["cutting disc"]],
        ["Saw Blade", ["saw blade"]],
        ["Light Bulb", ["light bulb", "bulb"]],
        ["Switch", ["switch"]],
        ["Outlet", ["outlet", "receptacle"]],
        ["Wire", ["wire"]],
        ["Cable", ["cable"]],
        ["Screw", ["screw"]],
        ["Bolt", ["bolt"]],
        ["Hinge", ["hinge"]],
        ["Door", ["door"]],
        ["Window", ["window"]],
        ["Snip", ["snip"]],
        ["Sander", ["sander"]]
    ];

    for (const [type, keywords] of productTypes) {
        if (
            keywords.some(keyword =>
                text.includes(keyword)
            )
        ) {
            return type;
        }
    }

    return null;
};

const extractGrit = (description) => {
    if (!description) {
        return null;
    }

    const pGrit = description.match(
        /\bP\s*(\d{2,4})\b/i
    );

    if (pGrit) {
        return `P${pGrit[1]}`;
    }

    const grit = description.match(
        /\b(\d{2,4})\s*grit\b/i
    );

    if (grit) {
        return grit[1];
    }

    return null;
};

const extractPackSize = (description) => {
    if (!description) {
        return null;
    }

    const patterns = [
        /\b(\d+)\s*(?:pc|pcs|piece|pieces)\b/i,
        /\b(\d+)\s*disc\/box\b/i,
        /\b(\d+)\s*discs\/box\b/i,
        /\b(\d+)\s*\/box\b/i
    ];

    for (const pattern of patterns) {
        const match = description.match(pattern);

        if (match) {
            return Number(match[1]);
        }
    }

    return null;
};

const extractSpecifications = (description) => {
    const specifications = {
        width: null,
        length: null,
        diameter: null,
        thickness: null,
        grit: extractGrit(description),
        material: null,
        packSize: extractPackSize(description)
    };

    if (!description) {
        return specifications;
    }

    const text = description.replace(/"/g, "");

    const dimensionMatch = text.match(
        /(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:in|inch)?\s*x\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:in|inch)?/i
    );

    if (dimensionMatch) {
        specifications.width = `${dimensionMatch[1]} inch`;
        specifications.length = `${dimensionMatch[2]} inch`;
    }

    return specifications;
};

const createEmbeddingText = (product) => {
    return [
        `MPN: ${product.mpn}`,
        `Brand: ${product.brand || "Unknown"}`,
        `Manufacturer: ${product.manufacturer || "Unknown"}`,
        `Category: ${product.category || "Unknown"}`,
        `Product Type: ${product.productType || "Unknown"}`,
        `Description: ${product.description}`,
        `Width: ${product.specifications.width || "Unknown"}`,
        `Length: ${product.specifications.length || "Unknown"}`,
        `Diameter: ${product.specifications.diameter || "Unknown"}`,
        `Thickness: ${product.specifications.thickness || "Unknown"}`,
        `Grit: ${product.specifications.grit || "Unknown"}`,
        `Material: ${product.specifications.material || "Unknown"}`,
        `Pack Size: ${product.specifications.packSize || "Unknown"}`
    ].join(" | ");
};

const transformRow = (row) => {
    const mpn = clean(row.Mfg_Part_Num);
    const description = clean(row.Part_Desc);

    if (!mpn || !description) {
        return null;
    }

    const manufacturerRaw = clean(row.Part_Manuf);
    const manufacturer = extractManufacturer(
        manufacturerRaw
    );

    const brand = resolveBrand(
        row,
        description
    );

    const category = detectCategory(
        description
    );

    const productType = detectProductType(
        description
    );

    const specifications =
        extractSpecifications(description);

    const product = {
        mpn,
        description,
        brand,
        manufacturer,
        category,
        productType,
        specifications,

        sourceData: {
            e1Brand: clean(row.E1_Brand),
            unilogBrand: clean(row.Unilog_Brand),
            dibBrand: clean(row.DIB_Brand),
            manufacturerRaw
        }
    };

    product.embeddingText =
        createEmbeddingText(product);

    return product;
};

const readCSV = () => {
    return new Promise((resolve, reject) => {
        const products = [];

        if (!fs.existsSync(datasetPath)) {
            return reject(
                new Error(
                    `Dataset not found: ${datasetPath}`
                )
            );
        }

        fs.createReadStream(datasetPath)
            .pipe(csv())
            .on("data", row => {
                const product = transformRow(row);

                if (product) {
                    products.push(product);
                }
            })
            .on("end", () => {
                resolve(products);
            })
            .on("error", reject);
    });
};

const importProducts = async () => {
    try {
        console.log("==========================================");
        console.log("🚀 ProdNexus Product Import");
        console.log("==========================================");

        await connectDB();

        console.log("📄 Reading CSV...");

        const products = await readCSV();

        console.log(
            `📦 Products parsed: ${products.length}`
        );

        if (!products.length) {
            throw new Error(
                "No valid products found."
            );
        }

        const duplicateMPNs = new Set();
        const seenMPNs = new Set();

        for (const product of products) {
            if (seenMPNs.has(product.mpn)) {
                duplicateMPNs.add(product.mpn);
            }

            seenMPNs.add(product.mpn);
        }

        console.log(
            `🔎 Duplicate MPNs preserved: ${duplicateMPNs.size}`
        );

        console.log("🧹 Clearing existing products...");

        await Product.deleteMany({});

        console.log("📥 Importing into MongoDB Atlas...");

        const BATCH_SIZE = 250;

        let imported = 0;

        for (
            let i = 0;
            i < products.length;
            i += BATCH_SIZE
        ) {
            const batch = products.slice(
                i,
                i + BATCH_SIZE
            );

            await Product.insertMany(batch);

            imported += batch.length;

            console.log(
                `   ${imported}/${products.length}`
            );
        }

        const totalProducts =
            await Product.countDocuments();

        console.log("✅ IMPORT COMPLETE");
        console.log(`📦 Products: ${totalProducts}`);
        console.log(`🔁 Duplicate MPNs: ${duplicateMPNs.size}`);
        console.log("🗄️ MongoDB Atlas: Connected");

        process.exit(0);
    } catch (error) {
        console.error("❌ Import failed:");
        console.error(error);

        process.exit(1);
    }
};

importProducts();