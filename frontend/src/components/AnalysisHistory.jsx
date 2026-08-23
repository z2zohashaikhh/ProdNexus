import { useState, useMemo } from "react";

function AnalysisHistory({
  history,
  onView,
  onDelete,
  onClear
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = useMemo(() => {
    if (!history) return [];
    if (!searchTerm.trim()) return history;

    return history.filter((item) => {
      const input = item.analysis?.input || {};
      const intel = item.analysis?.intelligence || {};
      const mpn = (input.mpn || "").toLowerCase();
      const brand = (input.brand || "").toLowerCase();
      const summary = (intel.productSummary || "").toLowerCase();
      const q = searchTerm.toLowerCase();

      return mpn.includes(q) || brand.includes(q) || summary.includes(q);
    });
  }, [history, searchTerm]);

  if (!history || history.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty-icon">◷</div>
        <div>
          <span className="input-label">ANALYSIS HISTORY</span>
          <h3>No previous analyses.</h3>
          <p>
            Products you analyze will appear here so you can
            quickly revisit previous product intelligence.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-history">
      <div className="history-header">
        <div>
          <span className="input-label">ANALYSIS HISTORY</span>
          <h3>Previous analyses</h3>
          <p>
            Revisit product intelligence generated during previous analysis sessions.
          </p>
        </div>

        <button className="history-clear" onClick={onClear}>
          Clear history
        </button>
      </div>

      {/* SEARCH BAR FOR HISTORY */}
      <div className="history-search-wrapper" style={{ margin: "18px 0" }}>
        <input
          type="text"
          className="history-search-input"
          placeholder="Search history by MPN or Brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="no-matches-found" style={{ padding: "24px 0", color: "#858f96" }}>
            No analyses match "{searchTerm}".
          </div>
        ) : (
          filteredHistory.map((item, idx) => {
            const input = item.analysis?.input || {};
            const intelligence = item.analysis?.intelligence || {};

            const productName =
              input.mpn ||
              intelligence.productSummary ||
              "Unknown product";

            const brand = input.brand || "Unknown brand";
            const retrievedCount =
              item.analysis?.retrieval?.results?.length || 0;

            return (
              <div className="history-item" key={item.id}>
                <div className="history-number">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="history-info">
                  <div className="history-title">
                    <strong>{productName}</strong>
                    <span>{brand}</span>
                  </div>

                  <div className="history-meta">
                    <span>{retrievedCount} products retrieved</span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="history-actions">
                  <button
                    className="history-view"
                    onClick={() => onView(item.analysis)}
                  >
                    View analysis
                    <span>→</span>
                  </button>

                  <button
                    className="history-delete"
                    onClick={() => onDelete(item.id)}
                    aria-label="Delete analysis"
                    title="Delete analysis"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AnalysisHistory;