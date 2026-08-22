require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const total = await Product.countDocuments();

        const embedded = await Product.countDocuments({
            embedding: { $exists: true }
        });

        const missing = await Product.countDocuments({
            embedding: { $exists: false }
        });

        console.log({
            total,
            embedded,
            missing
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();