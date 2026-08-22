export default function IntelligencePreview({
  completed,
  analysis,
  onStart,
}) {
  if (!completed || !analysis) {
    return (
      <div className="empty-intelligence">
        <div className="empty-icon">✦</div>

        <div>
          <span className="input-label">
            INTELLIGENCE WORKSPACE
          </span>

          <h3>Nothing to analyze yet.</h3>

          <p>
            Submit a product above and ProdNexus will retrieve
            relevant catalog data and generate structured
            product intelligence.
          </p>

          <button
            className="secondary-button"
            onClick={onStart}
          >
            Analyze a product
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  const intelligence = analysis.intelligence || {};
  const retrieval = analysis.retrieval?.results || [];
  const input = analysis.input || {};
  const pricing = intelligence.pricingAnalysis || {};

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
      return (
        <div className="intel-empty">
          Not available
        </div>
      );
    }

    return (
      <div className="intel-list">
        {items.map((item, index) => (
          <div
            className="intel-list-item"
            key={index}
          >
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
    if (index === 0) {
      return 100;
    }

    const value = Number(score || 0);

    const percentage =
      value <= 1
        ? Math.round(value * 100)
        : Math.round(value);

    return Math.min(
      98,
      Math.max(0, percentage)
    );
  };

  return (
    <div className="intelligence-dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <div className="dashboard-header-main">
          <span className="input-label">
            ANALYSIS COMPLETE
          </span>

          <h3>
            Product intelligence generated.
          </h3>

          <p className="dashboard-subtitle">
            Semantic retrieval and AI reasoning completed
            successfully.
          </p>
        </div>

        <div className="confidence">
          <span>RETRIEVED PRODUCTS</span>

          <strong>
            {retrieval.length}
          </strong>
        </div>
      </div>

      {/* ================= INTELLIGENCE GRID ================= */}

      <div className="intelligence-grid">

        {/* PRODUCT SUMMARY */}

        <div className="intel-card intel-summary">
          <div className="card-label">
            PRODUCT SUMMARY
          </div>

          <h4>
            {cleanText(
              intelligence.productSummary
            )}
          </h4>
        </div>

        {/* MARKET POSITION */}

        <div className="intel-card">
          <div className="card-label">
            MARKET POSITION
          </div>

          <div className="market-position">
            {cleanText(
              intelligence.marketPosition
            )}
          </div>

          <p className="card-note">
            Based on retrieved catalog intelligence.
          </p>
        </div>

        {/* PRICING */}

        <div className="intel-card">
          <div className="card-label">
            PRICING ANALYSIS
          </div>

          <div className="pricing-value">
            {cleanText(
              pricing.pricePosition ||
              pricing.currentPrice
            )}
          </div>

          <p className="card-note">
            {cleanText(
              pricing.priceInsight ||
              "Pricing information is not available."
            )}
          </p>
        </div>

        {/* KEY FEATURES */}

        <div className="intel-card">
          <div className="card-label">
            KEY FEATURES
          </div>

          {renderList(
            intelligence.keyFeatures
          )}
        </div>

        {/* STRENGTHS */}

        <div className="intel-card">
          <div className="card-label">
            STRENGTHS
          </div>

          {renderList(
            intelligence.strengths
          )}
        </div>

        {/* WEAKNESSES */}

        <div className="intel-card">
          <div className="card-label">
            WEAKNESSES
          </div>

          {renderList(
            intelligence.weaknesses
          )}
        </div>

        {/* RECOMMENDATIONS */}

        <div className="intel-card intel-recommendations">
          <div className="card-label">
            RECOMMENDATIONS
          </div>

          {renderList(
            intelligence.recommendations
          )}
        </div>

      </div>

      {/* ================= RETRIEVAL ================= */}

      <div className="retrieval-section">

        <div className="retrieval-header">

          <div>
            <span className="input-label">
              SEMANTIC RETRIEVAL
            </span>

            <h3>
              Similar products
            </h3>

            <p className="retrieval-description">
              Products identified through semantic
              similarity against the catalog.
            </p>
          </div>

          <div className="retrieval-count">
            {retrieval.length} matches
          </div>

        </div>

        <div className="retrieval-list">

          {retrieval.map((item, index) => {

            const product =
              item.product || {};

            const relevance =
              getRelevance(
                item.score,
                index
              );

            return (
              <div
                className="retrieval-item"
                key={
                  product._id ||
                  product.mpn ||
                  index
                }
              >

                {/* NUMBER */}

                <div className="retrieval-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* PRODUCT */}

                <div className="retrieval-info">

                  <div className="retrieval-title">
                    <strong>
                      {product.mpn ||
                        "Unknown MPN"}
                    </strong>

                    <span>
                      {product.brand ||
                        "Unknown brand"}
                    </span>
                  </div>

                  <p>
                    {cleanText(
                      product.description ||
                      "No description available"
                    )}
                  </p>

                  {product.productType && (
                    <div className="product-type">
                      {cleanText(
                        product.productType
                      )}
                    </div>
                  )}

                </div>

                {/* SCORE */}

                <div className="retrieval-score">

                  <span>
                    RELEVANCE
                  </span>

                  <strong>
                    {relevance}%
                  </strong>

                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${relevance}%`,
                      }}
                    />
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* ================= FOOTER ================= */}

      <div className="analysis-footer">

        <div>
          <span>
            ANALYZED PRODUCT
          </span>

          <strong>
            {input.mpn || "Unknown"}
            <em> · </em>
            {input.brand || "Unknown"}
          </strong>
        </div>

        <button
          className="secondary-button"
          onClick={onStart}
        >
          Analyze another
          <span>→</span>
        </button>

      </div>

    </div>
  );
}