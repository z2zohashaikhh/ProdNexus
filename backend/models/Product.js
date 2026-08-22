const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        mpn: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            trim: true,
            default: null,
            index: true
        },

        manufacturer: {
            type: String,
            trim: true,
            default: null,
            index: true
        },

        category: {
            type: String,
            trim: true,
            default: null,
            index: true
        },

        productType: {
            type: String,
            trim: true,
            default: null,
            index: true
        },

        specifications: {
            width: {
                type: String,
                default: null
            },

            length: {
                type: String,
                default: null
            },

            diameter: {
                type: String,
                default: null
            },

            thickness: {
                type: String,
                default: null
            },

            grit: {
                type: String,
                default: null
            },

            material: {
                type: String,
                default: null
            },

            packSize: {
                type: Number,
                default: null
            }
        },

        sourceData: {
            e1Brand: {
                type: String,
                default: null
            },

            unilogBrand: {
                type: String,
                default: null
            },

            dibBrand: {
                type: String,
                default: null
            },

            manufacturerRaw: {
                type: String,
                default: null
            }
        },

        embeddingText: {
            type: String,
            default: null
        },

        embedding: {
            type: [Number],
            default: undefined
        },

        intelligence: {
            score: {
                type: Number,
                default: null
            },

            dataCompleteness: {
                type: Number,
                default: null
            },

            competitivePosition: {
                type: String,
                default: null
            },

            gaps: {
                type: [String],
                default: []
            },

            recommendations: {
                type: [String],
                default: []
            },

            analyzedAt: {
                type: Date,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);