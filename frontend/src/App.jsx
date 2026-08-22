import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductInput from "./components/ProductInput";
import Pipeline from "./components/Pipeline";
import IntelligencePreview from "./components/IntelligencePreview";
import "./App.css";

function App() {
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const handleAnalyze = async (productData) => {
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify(productData)
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

      setAnalysis(data);
      setProcessing(false);
      setCompleted(true);

      setTimeout(() => {
        scrollTo("insights");
      }, 400);
    } catch (error) {
      console.error("Analysis error:", error);
      setProcessing(false);
      setCompleted(false);
      setError(error.message || "Unable to analyze product.");
    }
  };

  return (
    <div className="app">
      <div className="background-grid" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <Navbar onNavigate={scrollTo} />

      <main>
        <section id="engine" className="hero-section">
          <Hero onStart={() => scrollTo("analyze")} />
        </section>

        <section id="analyze" className="content-section">
          <div className="section-heading">
            <div>
              <span className="section-index">01</span>

              <div>
                <p className="section-kicker">
                  PRODUCT ANALYSIS
                </p>

                <h2>Start with what you know.</h2>
              </div>
            </div>

            <p className="section-description">
              Give ProdNexus a few product details. Our AI retrieves
              relevant catalog intelligence and builds a richer product profile.
            </p>
          </div>

          <ProductInput
            onAnalyze={handleAnalyze}
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

        <section
          id="insights"
          className="content-section insights-section"
        >
          <div className="section-heading">
            <div>
              <span className="section-index">02</span>

              <div>
                <p className="section-kicker">
                  AI OUTPUT
                </p>

                <h2>Product intelligence.</h2>
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
      </main>

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
          <span>UniHack 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;