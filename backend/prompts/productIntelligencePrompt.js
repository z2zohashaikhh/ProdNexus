function createProductIntelligencePrompt(productData) {
  const { mpn, brand, description, retrievedProducts } = productData;

  // Trim to top 4 matches and pick only core fields to minimize token processing time
  const trimmedCatalog = (retrievedProducts || []).slice(0, 4).map((item) => {
    const p = item.product || item;
    return {
      mpn: p.mpn || "Unknown",
      brand: p.brand || "Unknown",
      description: p.description ? p.description.slice(0, 150) : "",
      price: p.price || "Unlisted",
      productType: p.productType || "Hardware",
    };
  });

  return `
You are ProdNexus, an AI-powered industrial product intelligence engine.

TARGET PRODUCT:
- MPN: ${mpn}
- Brand: ${brand || "Not specified"}
- Description: ${description}

COMPARABLE CATALOG MATCHES:
${JSON.stringify(trimmedCatalog)}

Generate fast, concise, structured intelligence in valid JSON.

Return ONLY valid JSON matching this exact structure:
{
  "productSummary": "2-sentence executive summary detailing core product purpose and primary industrial applications.",
  "marketPosition": "Positioning tier (e.g. Premium Enterprise, Mid-Market Standard, Cost-Effective Industrial).",
  "pricingAnalysis": {
    "currentPrice": "Estimated $350 - $480 USD",
    "priceRange": "$200 - $800 USD",
    "pricePosition": "Competitive Mid-Tier",
    "priceInsight": "Estimated based on hardware class and brand standard; provides competitive lifecycle value.",
    "isEstimated": true
  },
  "competitorAnalysis": [
    {
      "brand": "",
      "product": "",
      "price": "",
      "comparison": ""
    }
  ],
  "keyFeatures": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "weaknesses": [
    "Limitation 1",
    "Limitation 2"
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "overallInsight": "1-sentence strategic procurement takeaway."
}

Rules:
1. Base technical specifications strictly on the provided context. Keep each bullet point under 15 words for maximum processing speed.
2. For pricingAnalysis: If exact vendor price is not listed, benchmark a realistic industrial market range prefixed with "Estimated" and set "isEstimated" to true.
3. competitorAnalysis should evaluate the most relevant retrieved products.
4. Return pure JSON without markdown code fences or conversational text.
`;
}

module.exports = {
  createProductIntelligencePrompt,
};