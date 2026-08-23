export default function Navbar({ onNavigate }) {
  return (
    <header className="navbar">
      <button
        className="brand"
        onClick={() => onNavigate("engine")}
      >
        <div className="brand-logo">
          <span />
          <span />
          <span />
        </div>

        <div className="brand-text">
          <strong>ProdNexus</strong>
          <small>PRODUCT INTELLIGENCE</small>
        </div>
      </button>

      <nav className="nav-links">
        <button onClick={() => onNavigate("engine")}>
          Overview
        </button>

        <button onClick={() => onNavigate("analyze")}>
          Analyze
        </button>

        <button onClick={() => onNavigate("insights")}>
          Insights
        </button>

        {/* NEW: History */}
        <button onClick={() => onNavigate("history")}>
          History
        </button>
      </nav>

      <div className="nav-status">
        <span className="online-dot" />
        <span>AI ENGINE ONLINE</span>
      </div>
    </header>
  );
}