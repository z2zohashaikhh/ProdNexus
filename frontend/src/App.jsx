import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductInput from "./components/ProductInput";
import Pipeline from "./components/Pipeline";
import IntelligencePreview from "./components/IntelligencePreview";
import AnalysisHistory from "./components/AnalysisHistory";

import "./App.css";
import "./components/AnalysisHistory.css";

function App() {
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  /*
   * Initialize directly from localStorage (Prevents initial overwrite bug)
   */
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem("prodNexusAnalysisHistory");
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          return parsedHistory;
        }
      }
    } catch (err) {
      console.error("Unable to load analysis history:", err);
    }
    return [];
  });

  /*
   * Save history whenever it changes
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        "prodNexusAnalysisHistory",
        JSON.stringify(history)
      );
    } catch (err) {
      console.error("Unable to save analysis history:", err);
    }
  }, [history]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /*
   * Analyze product
   */
  const handleAnalyze = async (productData) => {
    if (!productData || !productData.mpn || !productData.description) {
      setError("Manufacturer Part Number and description are required.");
      return;
    }

    setProcessing(true);
    setCompleted(false);
    setAnalysis(null);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/products/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Product analysis failed."
        );
      }

      /*
       * Store current analysis
       */
      setAnalysis(data);
      setProcessing(false);
      setCompleted(true);

      /*
       * Add analysis to history
       */
      const historyItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        analysis: data,
      };

      setHistory((previousHistory) => [
        historyItem,
        ...previousHistory,
      ]);

      /*
       * Scroll to intelligence result
       */
      setTimeout(() => {
        scrollTo("insights");
      }, 400);
    } catch (err) {
      console.error("Analysis error:", err);

      setProcessing(false);
      setCompleted(false);
      setError(
        err.message || "Unable to analyze product."
      );
    }
  };

  /*
   * Open an analysis directly (used for history & bulk inspect)
   */
  const handleViewHistory = (savedAnalysis) => {
    if (!savedAnalysis) return;

    setAnalysis(savedAnalysis);
    setCompleted(true);
    setProcessing(false);
    setError("");

    setTimeout(() => {
      scrollTo("insights");
    }, 150);
  };

  /*
   * Delete one history item
   */
  const handleDeleteHistory = (id) => {
    setHistory((previousHistory) =>
      previousHistory.filter((item) => item.id !== id)
    );
  };

  /*
   * Clear all history
   */
  const handleClearHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all analysis history?"
    );

    if (!confirmed) {
      return;
    }

    setHistory([]);
  };

  return (
    <div className="app">
      <div className="background-grid" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <Navbar onNavigate={scrollTo} />

      <main>
        {/* =====================================================
            HERO
            ===================================================== */}
        <section id="engine" className="hero-section">
          <Hero onStart={() => scrollTo("analyze")} />
        </section>

        {/* =====================================================
            PRODUCT ANALYSIS
            ===================================================== */}
        <section id="analyze" className="content-section">
          <div className="section-heading">
            <div>
              <span className="section-index">01</span>
              <div>
                <p className="section-kicker">PRODUCT ANALYSIS</p>
                <h2>Start With What You Know.</h2>
              </div>
            </div>

            <p className="section-description">
              Give ProdNexus a few product details. Our AI retrieves relevant
              catalog intelligence and builds a richer product profile.
            </p>
          </div>

          <ProductInput
            onAnalyze={handleAnalyze}
            onInspectProduct={handleViewHistory}
            processing={processing}
          />

          {processing && (
            <div className="pipeline-container">
              <Pipeline
                processing={processing}
                completed={completed}
              />
            </div>
          )}

          {error && (
            <div className="form-error">
              <span>!</span>
              {error}
            </div>
          )}
        </section>

        {/* =====================================================
            INTELLIGENCE
            ===================================================== */}
        <section
          id="insights"
          className="content-section insights-section"
        >
          <div className="section-heading">
            <div>
              <span className="section-index">02</span>
              <div>
                <p className="section-kicker">AI OUTPUT</p>
                <h2>Product Intelligence.</h2>
              </div>
            </div>

            <p className="section-description">
              Structured insights generated from semantic retrieval,
              product context and AI reasoning.
            </p>
          </div>

          <IntelligencePreview
            completed={completed}
            analysis={analysis}
            onStart={() => scrollTo("analyze")}
          />
        </section>

        {/* =====================================================
            HISTORY
            ===================================================== */}
        <section
          id="history"
          className="content-section history-section"
        >
          <div className="section-heading">
            <div>
              <span className="section-index">03</span>
              <div>
                <p className="section-kicker">WORKSPACE</p>
                <h2>Analysis History.</h2>
              </div>
            </div>

            <p className="section-description">
              Revisit product intelligence from your previous analysis
              sessions.
            </p>
          </div>

          <AnalysisHistory
            history={history}
            onView={handleViewHistory}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
          />
        </section>
      </main>

      {/* =======================================================
          FOOTER
          ======================================================= */}
      <footer className="footer">
        <div className="footer-left">
          <div className="footer-logo">P</div>
          <div>
            <strong>ProdNexus</strong>
            <span>AI PRODUCT INTELLIGENCE</span>
          </div>
        </div>

        <div className="footer-right">
          <span className="online-dot" />
          AI ENGINE ONLINE
          <span>ProdNexus 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;