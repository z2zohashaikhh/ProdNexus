import React from "react";

export default function Logo({ size = 28 }) {
  return (
    <div className="prodnexus-logo-wrapper" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Outer Hexagon Shield */}
        <path
          d="M20 3L35 11.66V28.34L20 37L5 28.34V11.66L20 3Z"
          stroke="#b8ff4a"
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="rgba(184, 255, 74, 0.08)"
        />
        {/* Core Nexus Nodes & Connection Circuit */}
        <circle cx="20" cy="14" r="2.5" fill="#f8fafc" />
        <circle cx="13" cy="25" r="2.5" fill="#b8ff4a" />
        <circle cx="27" cy="25" r="2.5" fill="#b8ff4a" />
        <path
          d="M20 14L13 25M20 14L27 25M13 25H27"
          stroke="#b8ff4a"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Center Spark / Intelligence Star */}
        <circle cx="20" cy="21" r="1.5" fill="#ffffff" />
      </svg>
      <div className="logo-text-group" style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "0.08em", color: "#f8fafc", lineHeight: 1 }}>
          PROD<span style={{ color: "#b8ff4a" }}>NEXUS</span>
        </span>
        <span style={{ fontSize: "8px", fontFamily: "monospace", letterSpacing: "0.14em", color: "#858f96", marginTop: "3px" }}>
          CATALYST · AI ENGINE
        </span>
      </div>
    </div>
  );
}