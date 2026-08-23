import React from "react";
import Logo from "./Logo";

export default function Navbar({ onNavigate }) {
  return (
    <header className="navbar">
      <button
        className="brand"
        onClick={() => onNavigate("engine")}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          textAlign: "left",
        }}
      >
        <Logo size={28} />
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