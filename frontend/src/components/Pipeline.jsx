export default function Pipeline({ processing, completed }) {
  const steps = [
    {
      number: "01",
      title: "Discover",
      text: "Finding relevant product information"
    },
    {
      number: "02",
      title: "Retrieve",
      text: "Searching the product knowledge base"
    },
    {
      number: "03",
      title: "Structure",
      text: "Extracting meaningful attributes"
    },
    {
      number: "04",
      title: "Validate",
      text: "Checking consistency and confidence"
    }
  ];

  return (
    <div className="pipeline-card">
      <div className="pipeline-header">
        <div>
          <span className="input-label">AI PIPELINE</span>
          <h3>
            {completed
              ? "Intelligence generated."
              : "Building product intelligence."}
          </h3>
        </div>

        <div className="pipeline-live">
          <span />
          {completed ? "COMPLETE" : "PROCESSING"}
        </div>
      </div>

      <div className="pipeline-steps">
        {steps.map((step, index) => {
          const active = processing && index === 0;
          const done = completed;

          return (
            <div
              className={`pipeline-step ${
                active ? "active" : ""
              } ${done ? "done" : ""}`}
              key={step.number}
            >
              <div className="pipeline-number">
                {done ? "✓" : step.number}
              </div>

              <div>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}