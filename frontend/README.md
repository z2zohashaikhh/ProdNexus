# ProdNexus — Frontend

> **AI-Powered Product Intelligence Platform**

ProdNexus transforms fragmented industrial product data into structured, enriched, and actionable product intelligence using AI, semantic retrieval, and intelligent analysis.

This directory contains the **React + Vite frontend** of the ProdNexus platform.

---

## 🚀 Live Demo

### ProdNexus — Live Application

https://prodnexus-frontend.vercel.app/

The frontend is deployed on **Vercel** and communicates with the deployed ProdNexus backend for product analysis and AI-powered intelligence generation.

### Backend API

https://prodnexus-backend.vercel.app/

---

## ✨ Features

### ⚡ Single SKU Deep-Dive

Analyze an individual industrial product by providing:

- Manufacturer Part Number (MPN)
- Brand
- Short Product Description

The frontend sends the product information to the ProdNexus backend and displays the generated product intelligence.

### 📦 Bulk CSV Batch Ingestion

Upload an industrial product catalog as a CSV file and process multiple products through the AI enrichment pipeline.

The bulk processing interface supports:

- CSV file upload
- Product catalog parsing
- Batch processing
- Processing progress tracking
- AI decision scores
- Procurement verdicts
- Individual product inspection
- Enriched CSV export

### 🧠 Product Intelligence

After analysis, ProdNexus presents structured product intelligence including:

- Product Summary
- Market Position
- Pricing Analysis
- Key Features
- Strengths
- Weaknesses
- Recommendations
- Decision Score
- Market Fit
- Specification Fit
- Supply Risk

### 🔎 Semantic Retrieval

The frontend displays products retrieved through semantic similarity from the product catalog.

Retrieved products include:

- Product / Part Number
- Brand
- Description
- Relevance Score
- Product Category

This allows users to understand which existing catalog products are semantically related to the analyzed product.

### ✦ AI Explainer

The **Ask AI Explainer** interface allows users to interact with generated product intelligence and understand the reasoning behind the analysis.

### 📊 Analysis History

ProdNexus provides a workspace for revisiting previously generated analyses.

Users can:

- View previous analyses
- Reopen product intelligence
- Delete individual history entries
- Clear analysis history

Analysis history is persisted in the browser using **LocalStorage**.

### 📥 Enriched CSV Export

After bulk processing is completed, users can export the enriched batch as a CSV file containing:

- Part Number
- Manufacturer
- Product Description
- AI Decision Score
- Procurement Verdict
- Processing Status

### 📄 Product Intelligence Report

Generated product intelligence can also be exported as a structured report through the frontend report generation utility.

---

## 🎨 Application Sections

The ProdNexus interface is organized into three primary sections.

### 01 — Product Analysis

The main workspace for entering product information and starting AI analysis.

Users can choose between:

- **Single SKU Deep-Dive**
- **Bulk CSV Batch Ingestion**

### 02 — Product Intelligence

Displays the generated AI analysis, including:

- Decision Score
- Procurement Decision
- Market Fit
- Specification Fit
- Supply Risk
- Product Summary
- Market Position
- Pricing Analysis
- Features
- Strengths
- Weaknesses
- Recommendations
- Semantic Retrieval Results

### 03 — Analysis History

Provides access to previously generated product analyses.

Users can revisit, inspect, and manage previously generated intelligence.

---

## 🔄 Product Analysis Flow

```text
User
  │
  ▼
Enter Product Information
  │
  ├── MPN
  ├── Brand
  └── Description
  │
  ▼
React Frontend
  │
  │ POST /api/products/analyze
  ▼
ProdNexus Backend
  │
  ├── Product Validation
  ├── Product Embedding Generation
  ├── MongoDB Atlas
  ├── MongoDB Vector Search
  └── Gemini AI
  │
  ▼
Product Intelligence
  │
  ▼
React Intelligence Interface
  │
  ├── Decision Score
  ├── Market Fit
  ├── Specification Fit
  ├── Supply Risk
  ├── Pricing Analysis
  ├── Features
  ├── Strengths
  ├── Weaknesses
  ├── Recommendations
  └── Similar Products
```

---

## 📁 Frontend Structure

```text
frontend/
│
├── src/
│   │
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── AnalysisHistory.css
│   │   ├── AnalysisHistory.jsx
│   │   ├── AskAIDrawer.jsx
│   │   ├── BulkBatchProcessor.jsx
│   │   ├── Hero.css
│   │   ├── Hero.jsx
│   │   ├── IntelligencePreview.jsx
│   │   ├── Logo.jsx
│   │   ├── Navbar.css
│   │   ├── Navbar.jsx
│   │   ├── Pipeline.css
│   │   ├── Pipeline.jsx
│   │   ├── ProductInput.css
│   │   └── ProductInput.jsx
│   │
│   ├── utils/
│   │   └── generateReport.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── package-lock.json
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend build tool and development server |
| JavaScript | Application logic |
| HTML5 | Structure |
| CSS3 | Styling and responsive UI |
| LocalStorage | Client-side analysis history |
| Fetch API | Backend communication |

### Backend & AI

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | Backend API framework |
| MongoDB Atlas | Product database |
| MongoDB Vector Search | Semantic product retrieval |
| Gemini AI | AI-powered product analysis |
| REST API | Frontend-backend communication |

### Deployment & Infrastructure

| Service | Usage |
|---|---|
| Vercel | Frontend deployment |
| Vercel | Backend deployment |
| GitHub | Source code repository |
| MongoDB Atlas | Cloud database and vector search |

---

## 🔐 Backend Communication

The frontend communicates with the deployed ProdNexus backend for product analysis.

### Production API

https://prodnexus-backend.vercel.app/api/products/analyze

The frontend sends product information using a POST request:

```json
{
  "mpn": "MTR-4500X",
  "brand": "Siemens",
  "description": "3-phase industrial induction motor for automation and manufacturing applications."
}
```

The backend processes the request using:

- Product validation
- Product embedding generation
- Semantic vector retrieval
- MongoDB Atlas Vector Search
- Gemini AI analysis
- Product intelligence generation

The resulting intelligence is returned to the React application and rendered in the Product Intelligence section.

---

## 🌐 API Request Flow

```text
React Frontend
      │
      │ POST
      ▼
/api/products/analyze
      │
      ▼
Vercel Backend
      │
      ├──────────────► MongoDB Atlas
      │
      ├──────────────► MongoDB Vector Search
      │
      └──────────────► Gemini AI
      │
      ▼
Structured Product Intelligence
      │
      ▼
React Frontend
```

---

## 💻 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/z2zohashaikhh/ProdNexus.git
```

### 2. Navigate to the frontend

```bash
cd ProdNexus/frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The Vite development server will provide a local URL, typically:

http://localhost:5173

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## ☁️ Deployment

The ProdNexus frontend is deployed using **Vercel**.

The frontend project is connected to the GitHub repository:

https://github.com/z2zohashaikhh/ProdNexus

The frontend root directory is:

```text
frontend
```

Vercel automatically builds the React application using Vite.

### Production URLs

**Frontend:**

https://prodnexus-frontend.vercel.app/

**Backend:**

https://prodnexus-backend.vercel.app/

---

## 🔗 Project Repository

**GitHub:**

https://github.com/z2zohashaikhh/ProdNexus

### Project Structure

```text
ProdNexus/
│
├── frontend/
│   └── React + Vite application
│
└── backend/
    └── Node.js + Express API
```

---

## 🧩 Important Frontend Components

### App.jsx

The main application component responsible for:

- Application state
- Product analysis requests
- Analysis history
- Navigation
- Error handling
- Rendering major application sections

### ProductInput.jsx

Handles product input and allows users to switch between:

- Single SKU Deep-Dive
- Bulk CSV Batch Ingestion

### BulkBatchProcessor.jsx

Handles:

- CSV uploads
- CSV parsing
- Batch product processing
- Progress tracking
- AI decision scores
- Procurement verdicts
- Enriched CSV export
- Product inspection

### IntelligencePreview.jsx

Displays the generated product intelligence, including:

- AI decision
- Product summary
- Pricing
- Features
- Strengths
- Weaknesses
- Recommendations
- Semantic retrieval results

### AnalysisHistory.jsx

Manages previously generated product analyses and allows users to:

- View analyses
- Delete analyses
- Clear history

### Pipeline.jsx

Displays the visual AI processing pipeline while product analysis is running.

### AskAIDrawer.jsx

Provides the AI explainer interaction for generated product intelligence.

### generateReport.js

Frontend utility responsible for generating the product intelligence report.

---

## 📊 Example Analysis

### Example Input

**MPN:** MTR-4500X

**Brand:** Siemens

**Description:** 3-phase industrial induction motor for automation and manufacturing applications.

### Example Generated Intelligence

**Decision Score:** 93/100

**Procurement Decision:** STRONG CANDIDATE

**Market Fit:** 95%

**Specification Fit:** 90%

**Supply Risk:** LOW

The application also displays:

- Similar catalog products
- Relevance scores
- Pricing analysis
- Product features
- Strengths
- Weaknesses
- Procurement recommendations

---

## 🎯 Purpose

ProdNexus is designed to demonstrate how AI can transform raw industrial product information into meaningful procurement and product intelligence.

Instead of manually searching through fragmented catalogs, users can provide a small amount of product information and receive:

```text
Raw Product Data
        ↓
Semantic Retrieval
        ↓
AI Enrichment
        ↓
Product Intelligence
        ↓
Procurement Decision
```

---

## 👩‍💻 Authors

**Muskan Mulani**

**Zoha Shaikh**

Computer Engineering Students  
Trinity Academy of Engineering, Pune

---

## 📌 Project

**ProdNexus**

> Turn Product Data Into Product Intelligence.
