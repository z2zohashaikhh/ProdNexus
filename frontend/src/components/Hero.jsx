import "./Hero.css";

export default function Hero({ onStart }) {
  return (
    <section className="hero">
      <div className="hero-orbit orbit-one"></div>
      <div className="hero-orbit orbit-two"></div>
      <div className="hero-orbit orbit-three"></div>

      <div className="hero-glow"></div>

      <div className="hero-scan-line"></div>

      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot"></span>
          <span>AI-POWERED PRODUCT INTELLIGENCE</span>
        </div>

        <h1 className="hero-title">
          <span className="title-main">Product Data.</span>
          <span className="title-accent">
            Intelligence, Built In.
          </span>
        </h1>

        <p className="hero-description">
          ProdNexus transforms fragmented product data into
          structured, verified and actionable intelligence.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="hero-button"
            onClick={onStart}
          >
            <span>Analyze  Product</span>
            <span className="hero-arrow">→</span>
          </button>

          <div className="hero-status">
            <span className="status-pulse"></span>
            <span>AI ENGINE READY</span>
          </div>
        </div>
      </div>

      <div className="hero-capabilities">
        <div className="capability">
          <span className="capability-number">01</span>
          <div>
            <strong>Discover</strong>
            <small>Relevant product data</small>
          </div>
        </div>

        <div className="capability-divider"></div>

        <div className="capability">
          <span className="capability-number">02</span>
          <div>
            <strong>Retrieve</strong>
            <small>Semantic knowledge</small>
          </div>
        </div>

        <div className="capability-divider"></div>

        <div className="capability">
          <span className="capability-number">03</span>
          <div>
            <strong>Enrich</strong>
            <small>Product attributes</small>
          </div>
        </div>

        <div className="capability-divider"></div>

        <div className="capability">
          <span className="capability-number">04</span>
          <div>
            <strong>Analyze</strong>
            <small>Actionable insights</small>
          </div>
        </div>
      </div>
    </section>
  );
}