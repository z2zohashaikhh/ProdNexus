require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ProdNexus Backend is running",
        database: "MongoDB Atlas",
        status: "OK"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ProdNexus API is healthy",
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("🚀 ProdNexus Backend Started");
    console.log(`🌐 Server: http://localhost:${PORT}`);
});