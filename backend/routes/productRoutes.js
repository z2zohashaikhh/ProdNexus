const express = require("express");

const {
    analyzeProduct
} = require("../controllers/productController");

const router = express.Router();


// =====================================================
// ANALYZE PRODUCT
// =====================================================

router.post("/analyze", analyzeProduct);


module.exports = router;