import React, { useState, useRef, useEffect } from "react";

export default function AskAIDrawer({ isOpen, onClose, skuContext }) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedPrompts = [
    "Is this interchangeable with similar models in the catalog?",
    "What mounting accessories or hardware are required?",
    "Generate a 1-sentence sales pitch for this item.",
    "Highlight the main procurement risks or warranty caveats."
  ];

  // Initialize welcome message when drawer opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: "ai",
          text: `Hi! I have loaded the catalog data for **${skuContext?.mpn || "this SKU"}** (${skuContext?.brand || "Brand"}). What would you like to know?`
        }
      ]);
    }
  }, [isOpen, skuContext]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (queryText) => {
    const query = queryText || inputQuery;
    if (!query.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-sku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          context: skuContext
        })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply || data.answer || "No response received." }
      ]);
    } catch {
      // Mock fallback response for instant frontend testing
      setTimeout(() => {
        let answer = `Based on specifications for ${skuContext?.mpn}: `;
        if (query.toLowerCase().includes("pitch")) {
          answer += `The ${skuContext?.brand} ${skuContext?.mpn} offers top-tier build quality and performance optimized for enterprise catalog standards.`;
        } else if (query.toLowerCase().includes("interchangeable") || query.toLowerCase().includes("similar")) {
          answer += `This unit is functionally compatible with standard catalog equivalents in its class, but check mounting dimension tolerances before replacement.`;
        } else {
          answer += `Compatible with standard mounting fixtures matching its specification profile.`;
        }

        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: answer }
        ]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <span className="drawer-badge">AI EXPLAINER</span>
            <h3>Ask AI about SKU</h3>
            <p className="drawer-sub">
              {skuContext?.mpn} · {skuContext?.brand}
            </p>
          </div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="drawer-quick-prompts">
          <span className="quick-label">SUGGESTED QUESTIONS</span>
          <div className="quick-chips">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-chip"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="drawer-chat-area">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.sender}`}>
              <div className="bubble-header">
                {msg.sender === "ai" ? "✦ PRODNEXUS AI" : "YOU"}
              </div>
              <p>{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble ai">
              <em>Thinking...</em>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          className="drawer-footer"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            placeholder="Ask about fitment, specs, or sales..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
          />
          <button type="submit" disabled={!inputQuery.trim() || loading}>
            Send →
          </button>
        </form>
      </div>
    </div>
  );
}