import { useState } from "react";
import "./ProductInput.css";

export default function ProductInput({ onAnalyze, processing }) {
  const [description, setDescription] = useState("");
  const [mpn, setMpn] = useState("");
  const [brand, setBrand] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mpn.trim() || !brand.trim() || !description.trim()) {
      setError("All required intelligence fields must be completed.");
      return;
    }

    setError("");

    onAnalyze({
      mpn: mpn.trim(),
      brand: brand.trim(),
      description: description.trim()
    });
  };

  return (
    <section className="input-section" id="product-input">
      <div className="input-topline">
        <span>01</span>
        <div></div>
        <span>INTELLIGENCE INITIALIZATION</span>
      </div>

      <div className="input-header">
        <div className="input-heading">
          <div className="section-label">
            PRODUCT ANALYSIS
          </div>

          <h2>
            Start with
            <span> what you know.</span>
          </h2>

          <p>
            Feed the engine minimal product information.
            ProdNexus will discover, structure, normalize
            and validate the intelligence behind it.
          </p>
        </div>

        <div className="analysis-status">
          <div className="status-icon">
            <span></span>
          </div>

          <div>
            <small>ENGINE STATUS</small>
            <strong>
              {processing ? "ANALYZING PRODUCT" : "READY FOR ANALYSIS"}
            </strong>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="field">
            <div className="field-heading">
              <label>
                Manufacturer Part Number
                <span>*</span>
              </label>

              <span className="field-index">01</span>
            </div>

            <div className="input-wrapper">
              <span className="input-prefix">MPN</span>

              <input
                value={mpn}
                onChange={(e) => setMpn(e.target.value)}
                placeholder="MTR-4500X"
                disabled={processing}
              />

              <span className="input-state">REQUIRED</span>
            </div>

            <small>
              Unique identifier assigned by the manufacturer.
            </small>
          </div>

          <div className="field">
            <div className="field-heading">
              <label>
                Brand
                <span>*</span>
              </label>

              <span className="field-index">02</span>
            </div>

            <div className="input-wrapper">
              <span className="input-prefix">BRD</span>

              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Siemens"
                disabled={processing}
              />

              <span className="input-state">REQUIRED</span>
            </div>

            <small>
              Manufacturer or product brand.
            </small>
          </div>
        </div>

        <div className="field description-field">
          <div className="field-heading">
            <label>
              Short Product Description
              <span>*</span>
            </label>

            <div className="character-count">
              <strong>{description.length}</strong>
              <span>/500</span>
            </div>
          </div>

          <div className="textarea-wrapper">
            <div className="textarea-index">03</div>

            <textarea
              maxLength="500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="3-phase industrial induction motor for automation and manufacturing applications..."
              disabled={processing}
            />

            <div className="textarea-corner">
              INPUT
            </div>
          </div>

          <small>
            Provide any product information currently available.
            More context improves enrichment accuracy.
          </small>
        </div>

        {error && (
          <div className="form-error">
            <span>!</span>
            {error}
          </div>
        )}

        <div className="form-footer">
          <div className="security-note">
            <span className="security-icon">‡</span>

            <div>
              <strong>SECURE ANALYSIS</strong>
              <small>
                Product information is processed securely
              </small>
            </div>
          </div>

          <button
            type="submit"
            className="analyze-button"
            disabled={processing}
          >
            {processing ? (
              <>
                <span className="loader"></span>
                PROCESSING INTELLIGENCE
              </>
            ) : (
              <>
                <span>GENERATE PRODUCT INTELLIGENCE</span>
                <strong>↗</strong>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}