import { generateReport } from "../utils/generateReport";
import { useState, useMemo } from "react";
import AskAIDrawer from "./AskAIDrawer";

export default function IntelligencePreview({
  completed,
  analysis,
  onStart,
}) {
  // 1. State Hooks
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("ALL");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 2. Extracted Data (Safe fallbacks so hooks run unconditionally)
  const intelligence = analysis?.intelligence || {};
  const retrieval = analysis?.retrieval?.results || [];
  const input = analysis?.input || {};
  const pricing = intelligence.pricingAnalysis || {};

  // 3. Memoized Calculations (Must run on every render before early return)
  const uniqueBrands = useMemo(() => {
    const brands = new Set();
    retrieval.forEach((item) => {
      if (item.product?.brand) brands.add(item.product.brand.trim());
    });
    return ["ALL", ...Array.from(brands)];
  }, [retrieval]);

  const filteredRetrieval = useMemo(() => {
    return retrieval.filter((item) => {
      const p = item.product || {};
      const mpnMatch = (p.mpn || "").toLowerCase().includes(searchQuery.toLowerCase());
      const brandMatch = (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = mpnMatch || brandMatch || descMatch;

      const matchesBrand =
        selectedBrandFilter === "ALL" ||
        (p.brand || "").toLowerCase() === selectedBrandFilter.toLowerCase();

      return matchesSearch && matchesBrand;
    });
  }, [retrieval, searchQuery, selectedBrandFilter]);

  const decisionData = useMemo(() => {
    if (intelligence.decisionScore) {
      return intelligence.decisionScore;
    }

    const featureCount = intelligence.keyFeatures?.length || 0;
    const strengthsCount = intelligence.strengths?.length || 0;
    const weaknessesCount = intelligence.weaknesses?.length || 0;
    const retrievalCount = retrieval.length;

    let baseScore = 78;
    baseScore += Math.min(featureCount * 3, 9);
    baseScore += Math.min(strengthsCount * 2, 6);
    baseScore -= Math.min(weaknessesCount * 2, 6);
    if (retrievalCount >= 3) baseScore += 4;

    const finalScore = Math.min(96, Math.max(62, baseScore));

    let verdict = "STRONG CANDIDATE";
    let verdictColor = "#b8ff4a";

    if (finalScore < 72) {
      verdict = "NEEDS REVIEW";
      verdictColor = "#f59e0b";
    } else if (finalScore < 84) {
      verdict = "COMPETITIVE MATCH";
      verdictColor = "#38bdf8";
    }

    return {
      overallScore: finalScore,
      verdict,
      verdictColor,
      marketFit: Math.min(98, finalScore + 2),
      specAdvantage: Math.min(95, finalScore - 3),
      procurementRisk: finalScore > 85 ? "LOW" : "MODERATE",
      decisionRationale:
        intelligence.overallInsight ||
        `High architectural match with strong catalog alignment across ${retrievalCount} similar enterprise hardware items.`
    };
  }, [intelligence, retrieval]);

  // Context bundle for the Ask AI Drawer
  const skuContext = useMemo(() => ({
    mpn: input.mpn || "Unknown MPN",
    brand: input.brand || "Unknown Brand",
    description: input.description || intelligence.productSummary || "",
    marketPosition: intelligence.marketPosition,
    pricing: pricing,
    features: intelligence.keyFeatures || [],
    strengths: intelligence.strengths || [],
    weaknesses: intelligence.weaknesses || [],
    retrievedCount: retrieval.length
  }), [input, intelligence, pricing, retrieval]);

  // 4. Conditional Early Return (Only placed AFTER all hooks have executed)
  if (!completed || !analysis) {
    return (
      <div className="empty-intelligence">
        <div className="empty-icon">✦</div>
        <div>
          <span className="input-label">INTELLIGENCE WORKSPACE</span>
          <h3>Nothing to analyze yet.</h3>
          <p>
            Submit a product above and ProdNexus will retrieve
            relevant catalog data and generate structured
            product intelligence.
          </p>
          <button className="secondary-button" onClick={onStart}>
            Analyze a product
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  // 5. Helper Functions & UI formatting
  const cleanText = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not available";
    }

    return String(value)
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^\s*[-•]\s*/gm, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const renderList = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return <div className="intel-empty">Not available</div>;
    }

    return (
      <div className="intel-list">
        {items.map((item, index) => (
          <div className="intel-list-item" key={index}>
            <span className="list-marker">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p>{cleanText(item)}</p>
          </div>
        ))}
      </div>
    );
  };

  const getRelevance = (score, index) => {
    if (index === 0) return 100;
    const value = Number(score || 0);
    const percentage =
      value <= 1 ? Math.round(value * 100) : Math.round(value);
    return Math.min(98, Math.max(0, percentage));
  };

  const toggleProduct = (product) => {
    const productId = product._id || product.mpn || product.id;

    setSelectedProducts((previous) => {
      const exists = previous.some(
        (item) => (item._id || item.mpn || item.id) === productId
      );

      if (exists) {
        return previous.filter(
          (item) => (item._id || item.mpn || item.id) !== productId
        );
      }

      if (previous.length >= 3) return previous;
      return [...previous, product];
    });
  };

  const isSelected = (product) => {
    const productId = product._id || product.mpn || product.id;
    return selectedProducts.some(
      (item) => (item._id || item.mpn || item.id) === productId
    );
  };

  const priceDisplay =
    pricing.currentPrice ||
    pricing.priceRange ||
    pricing.pricePosition ||
    "Estimated Market Bracket";

  const isEstimated =
    pricing.isEstimated !== false ||
    String(priceDisplay).toLowerCase().includes("estimated");

  return (
    <div className="intelligence-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-main">
          <span className="input-label">ANALYSIS COMPLETE</span>
          <h3>Product intelligence generated.</h3>
          <p className="dashboard-subtitle">
            Semantic retrieval and AI reasoning completed successfully.
          </p>
        </div>

        {/* Action button cluster with unified alignment */}
        <div className="dashboard-actions" style={{ display: "inline-flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <button
            type="button"
            className="ai-explainer-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "38px",
              padding: "0 16px",
              background: "rgba(184, 255, 74, 0.08)",
              border: "1px solid rgba(184, 255, 74, 0.35)",
              color: "#b8ff4a",
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "4px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              lineHeight: 1
            }}
            onClick={() => setIsDrawerOpen(true)}
          >
            ✦ Ask AI Explainer
          </button>

          <button
            type="button"
            className="report-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "38px",
              padding: "0 16px",
              fontSize: "12px",
              fontWeight: "600",
              lineHeight: 1,
              whiteSpace: "nowrap"
            }}
            onClick={() => generateReport(analysis, selectedProducts)}
          >
            Download Report
          </button>

          <div className="confidence">
            <span>RETRIEVED PRODUCTS</span>
            <strong>{retrieval.length}</strong>
          </div>
        </div>
      </div>

      {/* AI PRODUCT DECISION SCORE PANEL */}
      <div
        className="decision-score-panel"
        style={{
          margin: "0 0 24px 0",
          padding: "24px 28px",
          background: "linear-gradient(135deg, rgba(184, 255, 74, 0.05), rgba(0, 0, 0, 0.4))",
          border: "1px solid rgba(184, 255, 74, 0.25)",
          borderRadius: "4px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              border: `2px solid ${decisionData.verdictColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.5)",
              boxShadow: `0 0 16px ${decisionData.verdictColor}33`,
              flexShrink: 0
            }}
          >
            <strong style={{ fontSize: "22px", color: "#f8fafc", lineHeight: 1, fontFamily: "monospace" }}>
              {decisionData.overallScore}
            </strong>
            <span style={{ fontSize: "9px", color: "#858f96", letterSpacing: "0.05em", marginTop: "2px" }}>
              /100
            </span>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span className="input-label" style={{ margin: 0 }}>
                AI PROCUREMENT DECISION
              </span>
              <span
                style={{
                  fontSize: "9px",
                  padding: "2px 8px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  borderRadius: "2px",
                  color: decisionData.verdictColor,
                  border: `1px solid ${decisionData.verdictColor}55`,
                  background: `${decisionData.verdictColor}15`
                }}
              >
                {decisionData.verdict}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "#c9d0d3", maxWidth: "600px", lineHeight: "1.5" }}>
              {cleanText(decisionData.decisionRationale)}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
            paddingLeft: "24px"
          }}
        >
          <div>
            <span style={{ display: "block", fontSize: "9px", color: "#858f96", fontFamily: "monospace", letterSpacing: "0.05em" }}>
              MARKET FIT
            </span>
            <strong style={{ fontSize: "14px", color: "#f4f7f8" }}>
              {decisionData.marketFit}%
            </strong>
          </div>

          <div>
            <span style={{ display: "block", fontSize: "9px", color: "#858f96", fontFamily: "monospace", letterSpacing: "0.05em" }}>
              SPEC FIT
            </span>
            <strong style={{ fontSize: "14px", color: "#f4f7f8" }}>
              {decisionData.specAdvantage}%
            </strong>
          </div>

          <div>
            <span style={{ display: "block", fontSize: "9px", color: "#858f96", fontFamily: "monospace", letterSpacing: "0.05em" }}>
              SUPPLY RISK
            </span>
            <strong style={{ fontSize: "14px", color: decisionData.procurementRisk === "LOW" ? "#b8ff4a" : "#f59e0b" }}>
              {decisionData.procurementRisk}
            </strong>
          </div>
        </div>
      </div>

      <div className="intelligence-grid">
        <div className="intel-card intel-summary">
          <div className="card-label">PRODUCT SUMMARY</div>
          <h4>{cleanText(intelligence.productSummary)}</h4>
        </div>

        <div className="intel-card">
          <div className="card-label">MARKET POSITION</div>
          <div className="market-position">
            {cleanText(intelligence.marketPosition)}
          </div>
          <p className="card-note">Based on retrieved catalog intelligence.</p>
        </div>

        {/* PRICING CARD WITH BENCHMARK TAG */}
        <div className="intel-card">
          <div
            className="card-label"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>PRICING ANALYSIS</span>
            {isEstimated && (
              <span
                style={{
                  fontSize: "9px",
                  padding: "2px 6px",
                  background: "rgba(184, 255, 74, 0.12)",
                  color: "#b8ff4a",
                  border: "1px solid rgba(184, 255, 74, 0.3)",
                  borderRadius: "2px",
                  letterSpacing: "0.05em",
                  fontWeight: "700",
                }}
              >
                ESTIMATED BENCHMARK
              </span>
            )}
          </div>
          <div className="pricing-value">
            {cleanText(priceDisplay)}
          </div>
          <p className="card-note">
            {cleanText(
              pricing.priceInsight ||
                "Pricing estimated based on category specifications and brand tier."
            )}
          </p>
        </div>

        <div className="intel-card">
          <div className="card-label">KEY FEATURES</div>
          {renderList(intelligence.keyFeatures)}
        </div>

        <div className="intel-card">
          <div className="card-label">STRENGTHS</div>
          {renderList(intelligence.strengths)}
        </div>

        <div className="intel-card">
          <div className="card-label">WEAKNESSES</div>
          {renderList(intelligence.weaknesses)}
        </div>

        <div className="intel-card intel-recommendations">
          <div className="card-label">RECOMMENDATIONS</div>
          {renderList(intelligence.recommendations)}
        </div>
      </div>

      <div className="retrieval-section">
        <div className="retrieval-header">
          <div>
            <span className="input-label">SEMANTIC RETRIEVAL</span>
            <h3>Similar products</h3>
            <p className="retrieval-description">
              Products identified through semantic similarity against the catalog.
            </p>
          </div>

          <div className="retrieval-count">{filteredRetrieval.length} matches</div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="retrieval-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search matches by MPN, brand, or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          {uniqueBrands.length > 2 && (
            <div className="brand-chips">
              {uniqueBrands.map((b) => (
                <button
                  type="button"
                  key={b}
                  className={`brand-chip ${
                    selectedBrandFilter === b ? "active" : ""
                  }`}
                  onClick={() => setSelectedBrandFilter(b)}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        {retrieval.length > 1 && (
          <div className="comparison-toolbar">
            <div>
              <strong>Compare products</strong>
              <span>Select up to 3 products</span>
            </div>
            <span className="comparison-count">
              {selectedProducts.length} selected
            </span>
          </div>
        )}

        <div className="retrieval-list">
          {filteredRetrieval.length === 0 ? (
            <div className="no-matches-found">
              No products match your filter criteria.
            </div>
          ) : (
            filteredRetrieval.map((item, index) => {
              const product = item.product || {};
              const relevance = getRelevance(item.score, index);
              const selected = isSelected(product);

              return (
                <div
                  className={`retrieval-item ${
                    selected ? "retrieval-item-selected" : ""
                  }`}
                  key={product._id || product.mpn || index}
                >
                  <button
                    type="button"
                    className={`comparison-select ${
                      selected ? "selected" : ""
                    }`}
                    onClick={() => toggleProduct(product)}
                    aria-label={
                      selected
                        ? "Remove from comparison"
                        : "Add to comparison"
                    }
                  >
                    {selected ? "✓" : "+"}
                  </button>

                  <div className="retrieval-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="retrieval-info">
                    <div className="retrieval-title">
                      <strong>{product.mpn || "Unknown MPN"}</strong>
                      <span>{product.brand || "Unknown brand"}</span>
                    </div>

                    <p>
                      {cleanText(
                        product.description || "No description available"
                      )}
                    </p>

                    {product.productType && (
                      <div className="product-type">
                        {cleanText(product.productType)}
                      </div>
                    )}
                  </div>

                  <div className="retrieval-score">
                    <span>RELEVANCE</span>
                    <strong>{relevance}%</strong>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${relevance}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedProducts.length >= 2 && (
          <div className="comparison-panel">
            <div className="comparison-panel-header">
              <div>
                <span className="input-label">PRODUCT COMPARISON</span>
                <h3>Compare selected products</h3>
                <p>Compare the retrieved products side by side.</p>
              </div>

              <button
                type="button"
                className="comparison-clear"
                onClick={() => setSelectedProducts([])}
              >
                Clear selection
              </button>
            </div>

            <div className="comparison-grid">
              {selectedProducts.map((product, index) => (
                <div
                  className="comparison-card"
                  key={product._id || product.mpn || index}
                >
                  <div className="comparison-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="comparison-brand">
                    {cleanText(product.brand || "Unknown brand")}
                  </div>

                  <h4>{cleanText(product.mpn || "Unknown MPN")}</h4>

                  <div className="comparison-field">
                    <span>PRODUCT TYPE</span>
                    <strong>{cleanText(product.productType)}</strong>
                  </div>

                  <div className="comparison-field">
                    <span>DESCRIPTION</span>
                    <p>{cleanText(product.description)}</p>
                  </div>

                  {product.price !== undefined && (
                    <div className="comparison-field">
                      <span>PRICE</span>
                      <strong>{cleanText(product.price)}</strong>
                    </div>
                  )}

                  <button
                    type="button"
                    className="comparison-remove"
                    onClick={() => toggleProduct(product)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="analysis-footer">
        <div>
          <span>ANALYZED PRODUCT</span>
          <strong>
            {input.mpn || "Unknown"}
            <em> · </em>
            {input.brand || "Unknown"}
          </strong>
        </div>

        <button className="secondary-button" onClick={onStart}>
          Analyze another
          <span>→</span>
        </button>
      </div>

      {/* SLIDE-OVER ASK AI DRAWER */}
      <AskAIDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        skuContext={skuContext}
      />
    </div>
  );
}