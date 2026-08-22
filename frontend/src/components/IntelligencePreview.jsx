export default function IntelligencePreview({
  completed,
  onStart
}) {
  if (!completed) {
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

  return (
    <div className="intelligence-dashboard">
      <div className="dashboard-header">
        <div>
          <span className="input-label">ANALYSIS COMPLETE</span>
          <h3>Product intelligence generated.</h3>
        </div>

        <div className="confidence">
          <span>Confidence</span>
          <strong>94%</strong>
        </div>
      </div>

      <div className="intelligence-grid">
        <div className="intel-card large">
          <span>PRODUCT SUMMARY</span>
          <h4>
            High-performance industrial sanding solution
          </h4>
          <p>
            Product intelligence generated from semantic
            product retrieval and contextual analysis.
          </p>
        </div>

        <div className="intel-card">
          <span>MARKET POSITION</span>
          <strong>Competitive</strong>
          <p>
            Strong relevance within the identified product segment.
          </p>
        </div>

        <div className="intel-card">
          <span>DATA COMPLETENESS</span>
          <strong>87%</strong>
          <p>
            Most core product information has been identified.
          </p>
        </div>

        <div className="intel-card">
          <span>KEY FEATURES</span>
          <ul>
            <li>Industrial-grade application</li>
            <li>Brand-specific product identity</li>
            <li>Relevant catalog matches</li>
          </ul>
        </div>

        <div className="intel-card">
          <span>RECOMMENDATION</span>
          <p>
            Enrich missing technical attributes and validate
            supporting documentation before publishing.
          </p>
        </div>
      </div>
    </div>
  );
}