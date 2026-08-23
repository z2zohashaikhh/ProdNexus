import jsPDF from "jspdf";

const clean = (val) => {
  if (!val) return "Not available";
  return String(val)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^\s*[-•]\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
};

export function generateReport(analysis, selectedProducts = []) {
  if (!analysis) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const input = analysis.input || {};
  const intel = analysis.intelligence || {};
  const retrieval = analysis.retrieval?.results || [];
  const pricing = intel.pricingAnalysis || {};

  const checkPageBreak = (neededHeight) => {
    if (cursorY + neededHeight > pageHeight - margin - 8) {
      doc.addPage();
      cursorY = margin;
      return true;
    }
    return false;
  };

  // --- BRAND HEADER ---
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, pageWidth, 28, "F");

  // Accent line
  doc.setFillColor(184, 255, 74); // Neon Accent (#b8ff4a)
  doc.rect(0, 26, pageWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("PRODNEXUS", margin, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text("AI PRODUCT INTELLIGENCE & MARKET REPORT", margin, 20);

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, 16, { align: "right" });

  cursorY = 36;

  // --- ANALYZED PRODUCT BANNER ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 18, 2, 2, "FD");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TARGET PRODUCT", margin + 5, cursorY + 6);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  const prodTitle = `${input.brand || "Unknown Brand"} — ${input.mpn || "Unknown MPN"}`;
  doc.text(prodTitle, margin + 5, cursorY + 13);

  cursorY += 25;

  const addHeading = (title) => {
    checkPageBreak(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, cursorY);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, cursorY + 2, pageWidth - margin, cursorY + 2);
    cursorY += 8;
  };

  // --- EXECUTIVE OVERVIEW ---
  addHeading("Executive Overview");

  const writeField = (label, value) => {
    checkPageBreak(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(label, margin, cursorY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const lines = doc.splitTextToSize(clean(value), contentWidth - 32);
    doc.text(lines, margin + 32, cursorY);
    cursorY += lines.length * 4.5 + 3;
  };

  writeField("Summary:", intel.productSummary);
  writeField("Position:", intel.marketPosition);

  // Pricing formatting with AI Benchmark detection
  const priceDisplay =
    pricing.currentPrice ||
    pricing.priceRange ||
    pricing.pricePosition ||
    "Estimated Market Bracket";
  
  const priceInsight =
    pricing.priceInsight ||
    "Pricing estimated based on category specifications and brand tier.";

  writeField(
    "Pricing:",
    `${priceDisplay} [AI Benchmark] — ${priceInsight}`
  );
  cursorY += 4;

  // --- STRATEGIC LISTS ---
  const writeSectionList = (title, items) => {
    addHeading(title);
    if (!Array.isArray(items) || items.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text("No specific points recorded.", margin, cursorY);
      cursorY += 6;
      return;
    }

    items.forEach((item, index) => {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${String(index + 1).padStart(2, "0")}.`, margin + 1, cursorY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(clean(item), contentWidth - 10);
      doc.text(lines, margin + 8, cursorY);
      cursorY += lines.length * 4.2 + 2.5;
    });
    cursorY += 4;
  };

  writeSectionList("Key Features", intel.keyFeatures);
  writeSectionList("Strengths", intel.strengths);
  writeSectionList("Weaknesses & Risks", intel.weaknesses);
  writeSectionList("Strategic Recommendations", intel.recommendations);

  // --- COMPARISON (IF PRODUCTS SELECTED) ---
  if (selectedProducts && selectedProducts.length > 0) {
    addHeading(`Compared Products (${selectedProducts.length} Selected)`);

    selectedProducts.forEach((p, idx) => {
      checkPageBreak(20);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, cursorY, contentWidth, 16, 1.5, 1.5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(
        `#${idx + 1}  ${clean(p.brand)} - ${clean(p.mpn)} (${clean(p.productType || "N/A")})`,
        margin + 4,
        cursorY + 5
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const desc = doc.splitTextToSize(clean(p.description), contentWidth - 8);
      doc.text(desc[0] || "No description", margin + 4, cursorY + 10);

      cursorY += 19;
    });
    cursorY += 4;
  }

  // --- RETRIEVED PRODUCTS ---
  if (retrieval.length > 0) {
    addHeading(`Catalog Matches (${retrieval.length} Found)`);

    retrieval.slice(0, 8).forEach((item, idx) => {
      const p = item.product || {};
      const score = item.score
        ? `${Math.round(item.score <= 1 ? item.score * 100 : item.score)}%`
        : "N/A";

      checkPageBreak(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`#${idx + 1}  ${clean(p.mpn)}`, margin, cursorY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(`[${clean(p.brand)}] - Match: ${score}`, margin + 55, cursorY);

      cursorY += 4.5;
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const snippet = doc.splitTextToSize(clean(p.description), contentWidth - 4);
      doc.text(snippet[0] || "", margin + 4, cursorY);
      cursorY += 7;
    });
  }

  // --- FOOTER PAGINATION ---
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${totalPages}  |  ProdNexus Intelligence Report`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  const filename = `ProdNexus_${clean(input.mpn || "Report").replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}