# ProdNexus

> **AI-Powered Product Intelligence Platform**

ProdNexus is an AI-powered product intelligence platform designed to transform fragmented industrial product data into structured, enriched, and actionable procurement intelligence.

The platform combines:

- React + Vite
- Node.js + Express
- MongoDB Atlas
- MongoDB Vector Search
- Gemini AI
- Semantic Retrieval
- Batch CSV Processing
- AI-powered Product Analysis

ProdNexus allows users to analyze individual industrial products or process entire product catalogs and receive structured intelligence that supports procurement and product decisions.

---

## 🚀 Live Demo

### 🌐 ProdNexus — Live Application

**https://prodnexus-frontend.vercel.app/**

👉 **[Open ProdNexus Live Demo](https://prodnexus-frontend.vercel.app/)**

### Backend

https://prodnexus-backend.vercel.app/

### Production Analysis API

https://prodnexus-backend.vercel.app/api/products/analyze

### GitHub Repository

https://github.com/z2zohashaikhh/ProdNexus/

---
# ✨ Features

## ⚡ Single SKU Deep-Dive

Users can analyze an individual industrial product by providing:

- Manufacturer Part Number (MPN)
- Brand
- Short Product Description

The frontend sends the product information to the backend, where the product is validated, enriched, semantically matched against the catalog, and analyzed using AI.

The resulting product intelligence is returned to the frontend and displayed in the Product Intelligence interface.

---

## 📦 Bulk CSV Batch Ingestion

ProdNexus supports processing multiple industrial products through CSV upload.

The bulk processing workflow supports:

- CSV file upload
- CSV parsing
- Product catalog processing
- Batch product analysis
- Processing progress tracking
- AI decision scores
- Procurement verdicts
- Individual product inspection
- Enriched CSV export

This allows a complete industrial product catalog to be processed through the same intelligence pipeline used for individual products.

---

## 🧠 AI Product Intelligence

After analysis, ProdNexus generates structured product intelligence including:

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
- Procurement Decision

The generated intelligence converts raw product information into a decision-oriented output.

---

## 🔎 Semantic Product Retrieval

ProdNexus uses semantic similarity to retrieve related products from the product catalog.

Retrieved products can include:

- Product / Part Number
- Brand
- Description
- Relevance Score
- Product Category

Semantic retrieval helps identify products that are conceptually similar even when their exact names or descriptions differ.

---

## ✦ AI Explainer

The **Ask AI Explainer** interface allows users to interact with generated product intelligence and better understand the reasoning behind the analysis.

It provides an additional interface for exploring the generated intelligence.

---

## 📊 Analysis History

ProdNexus provides an analysis history workspace where users can revisit previously generated product analyses.

Users can:

- View previous analyses
- Reopen product intelligence
- Delete individual history entries
- Clear analysis history

Analysis history is persisted in the browser using **LocalStorage**.

---

## 📥 Enriched CSV Export

After bulk processing is completed, users can export the processed catalog as an enriched CSV file.

The exported data can contain:

- Part Number
- Manufacturer
- Product Description
- AI Decision Score
- Procurement Verdict
- Processing Status

---

## 📄 Product Intelligence Report

Generated product intelligence can also be exported as a structured report using the frontend report generation utility.

---

# 🏗️ System Architecture

ProdNexus follows a client-server architecture where the React frontend communicates with the Node.js backend through REST APIs.

```text
                         ┌─────────────────────────┐
                         │          USER           │
                         │                         │
                         │  Product Input / CSV    │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │     REACT FRONTEND      │
                         │                         │
                         │ React + Vite            │
                         │ Product Analysis UI     │
                         │ Bulk Processing UI      │
                         │ Intelligence UI         │
                         │ Analysis History        │
                         └────────────┬────────────┘
                                      │
                                      │ REST API
                                      │ POST /api/products/analyze
                                      ▼
                         ┌─────────────────────────┐
                         │     EXPRESS BACKEND     │
                         │                         │
                         │ Node.js + Express       │
                         │ Product Validation      │
                         │ API Processing           │
                         └────────────┬────────────┘
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                     ▼                ▼                ▼
          ┌──────────────────┐ ┌───────────────┐ ┌───────────────┐
          │   Embeddings     │ │ MongoDB Atlas │ │   Gemini AI   │
          │                  │ │               │ │               │
          │ Product          │ │ Product       │ │ AI Product    │
          │ Embedding        │ │ Catalog       │ │ Analysis      │
          └────────┬─────────┘ │ Vector Search │ └───────┬───────┘
                   │           └───────┬───────┘         │
                   │                   │                 │
                   └───────────────────┼─────────────────┘
                                       │
                                       ▼
                         ┌─────────────────────────┐
                         │  PRODUCT INTELLIGENCE   │
                         │                         │
                         │ Decision Score           │
                         │ Procurement Decision     │
                         │ Market Fit               │
                         │ Specification Fit        │
                         │ Supply Risk              │
                         │ Pricing Analysis         │
                         │ Features                 │
                         │ Strengths                │
                         │ Weaknesses               │
                         │ Recommendations          │
                         │ Similar Products         │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │     REACT FRONTEND      │
                         │                         │
                         │ Product Intelligence    │
                         │ AI Explainer            │
                         │ History                 │
                         │ Report Export           │
                         └─────────────────────────┘
```

---

# 🔄 Product Analysis Workflow

The complete product analysis workflow is:

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
Express Backend
  │
  ▼
Product Validation
  │
  ▼
Product Embedding Generation
  │
  ▼
MongoDB Atlas Vector Search
  │
  ▼
Retrieve Semantically Similar Products
  │
  ▼
Gemini AI
  │
  ▼
Generate Product Intelligence
  │
  ├── Product Summary
  ├── Market Position
  ├── Pricing Analysis
  ├── Features
  ├── Strengths
  ├── Weaknesses
  ├── Recommendations
  ├── Decision Score
  ├── Market Fit
  ├── Specification Fit
  └── Supply Risk
  │
  ▼
Structured API Response
  │
  ▼
React Frontend
  │
  ▼
Product Intelligence Interface
```

---

# 📊 Bulk Processing Workflow

ProdNexus also supports batch processing of industrial product catalogs.

```text
CSV File Upload
      │
      ▼
React Frontend
      │
      ▼
CSV Parsing
      │
      ▼
Read Product Records
      │
      ▼
Process Products
      │
      ├── Product Validation
      │
      ├── Embedding Generation
      │
      ├── Semantic Retrieval
      │
      └── Gemini AI Analysis
      │
      ▼
Generate Product Intelligence
      │
      ▼
Track Processing Progress
      │
      ▼
Display Batch Results
      │
      ├── Decision Score
      ├── Procurement Verdict
      ├── Processing Status
      └── Product Inspection
      │
      ▼
Export Enriched CSV
```

---

# 🧠 AI and Semantic Retrieval Pipeline

ProdNexus combines semantic retrieval and generative AI to produce product intelligence.

```text
Raw Product Information
          │
          ▼
Product Validation
          │
          ▼
Product Embedding
          │
          ▼
MongoDB Vector Search
          │
          ▼
Semantically Similar Products
          │
          ▼
Retrieved Product Context
          │
          ▼
Gemini AI
          │
          ▼
Structured Product Intelligence
          │
          ▼
Procurement Decision
```

This approach allows the AI system to use both the submitted product information and relevant catalog context when generating the analysis.

---

# 🧩 Application Sections

The ProdNexus interface is organized into three primary sections.

## 01 — Product Analysis

The main workspace for entering product information and starting AI analysis.

Users can choose between:

- Single SKU Deep-Dive
- Bulk CSV Batch Ingestion

## 02 — Product Intelligence

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

## 03 — Analysis History

Provides access to previously generated product analyses.

Users can revisit, inspect, and manage previously generated intelligence.

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend build tool and development server |
| JavaScript | Application logic |
| HTML5 | Application structure |
| CSS3 | Styling and responsive design |
| LocalStorage | Client-side analysis history |
| Fetch API | Backend communication |

## Backend & AI

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | Backend API framework |
| MongoDB Atlas | Product database |
| MongoDB Vector Search | Semantic product retrieval |
| Gemini AI | AI-powered product analysis |
| REST API | Frontend-backend communication |

## Deployment & Infrastructure

| Service | Usage |
|---|---|
| Vercel | Frontend deployment |
| Vercel | Backend deployment |
| GitHub | Source code repository |
| MongoDB Atlas | Cloud database and vector search |

---

# 🔐 Backend Communication

The frontend communicates with the deployed ProdNexus backend for product analysis.

## Production API

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

# 🌐 API Request Flow

```text
React Frontend
      │
      │ POST /api/products/analyze
      ▼
Vercel Backend
      │
      ├──────────────► Product Validation
      │
      ├──────────────► Product Embedding
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

# 📁 Project Structure

```text
ProdNexus/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── components/
│   │   │   ├── AnalysisHistory.css
│   │   │   ├── AnalysisHistory.jsx
│   │   │   ├── AskAIDrawer.jsx
│   │   │   ├── BulkBatchProcessor.jsx
│   │   │   ├── Hero.css
│   │   │   ├── Hero.jsx
│   │   │   ├── IntelligencePreview.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pipeline.css
│   │   │   ├── Pipeline.jsx
│   │   │   ├── ProductInput.css
│   │   │   └── ProductInput.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── generateReport.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
└── backend/
    │
    ├── server.js
    ├── package.json
    ├── package-lock.json
    ├── routes/
    ├── controllers/
    ├── models/
    ├── services/
    └── ...
```

---

# 🧩 Important Frontend Components

## App.jsx

The main application component responsible for:

- Application state
- Product analysis requests
- Analysis history
- Navigation
- Error handling
- Rendering major application sections

## ProductInput.jsx

Handles product input and allows users to switch between:

- Single SKU Deep-Dive
- Bulk CSV Batch Ingestion

## BulkBatchProcessor.jsx

Handles:

- CSV uploads
- CSV parsing
- Batch product processing
- Progress tracking
- AI decision scores
- Procurement verdicts
- Enriched CSV export
- Product inspection

## IntelligencePreview.jsx

Displays the generated product intelligence, including:

- AI decision
- Product summary
- Pricing
- Features
- Strengths
- Weaknesses
- Recommendations
- Semantic retrieval results

## AnalysisHistory.jsx

Manages previously generated product analyses and allows users to:

- View analyses
- Delete analyses
- Clear history

## Pipeline.jsx

Displays the visual AI processing pipeline while product analysis is running.

## AskAIDrawer.jsx

Provides the AI explainer interaction for generated product intelligence.

## generateReport.js

Frontend utility responsible for generating the product intelligence report.

---

# 📊 Example Analysis

## Example Input

**MPN:** MTR-4500X

**Brand:** Siemens

**Description:** 3-phase industrial induction motor for automation and manufacturing applications.

## Example Generated Intelligence

**Decision Score:** 93/100

**Procurement Decision:** STRONG CANDIDATE

**Market Fit:** 95%

**Specification Fit:** 90%

**Supply Risk:** LOW

The application can also display:

- Similar catalog products
- Relevance scores
- Pricing analysis
- Product features
- Strengths
- Weaknesses
- Procurement recommendations

The example values above illustrate the expected format of product intelligence. Actual results depend on the product submitted and the backend analysis.

---

# 💻 Local Development

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/z2zohashaikhh/ProdNexus.git
```

## 2. Navigate to the Project

```bash
cd ProdNexus
```

## 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## 4. Start the Frontend Development Server

```bash
npm run dev
```

The Vite development server will provide a local URL, typically:

```text
http://localhost:5173
```

## 5. Build the Frontend

```bash
npm run build
```

## 6. Preview the Production Build

```bash
npm run preview
```

---

# 🔧 Backend Development

Navigate to the backend directory:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Start the backend according to the backend configuration.

The backend is responsible for:

- Product validation
- Embedding generation
- Semantic retrieval
- MongoDB communication
- Gemini AI analysis
- Product intelligence generation

---

# 🔑 Environment Configuration

The backend requires environment variables for external services.

Typical configuration may include:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Environment variable names should match the actual backend implementation.

Do not commit API keys, database credentials, or other secrets to GitHub.

---

# ☁️ Deployment

ProdNexus is deployed using Vercel.

## Frontend Deployment

The frontend project is connected to the GitHub repository:

https://github.com/z2zohashaikhh/ProdNexus

The frontend root directory is:

```text
frontend
```

Vercel builds the React application using Vite.

## Backend Deployment

The backend is deployed separately using Vercel.

Backend:

https://prodnexus-backend.vercel.app/

The deployed backend exposes the product analysis API.

## Production URLs

### Frontend

https://prodnexus-frontend.vercel.app/

### Backend

https://prodnexus-backend.vercel.app/

### Analysis Endpoint

https://prodnexus-backend.vercel.app/api/products/analyze

---

# 📡 API

## Analyze Product

### Endpoint

```text
POST /api/products/analyze
```

### Production Endpoint

https://prodnexus-backend.vercel.app/api/products/analyze

### Request Body

```json
{
  "mpn": "MTR-4500X",
  "brand": "Siemens",
  "description": "3-phase industrial induction motor for automation and manufacturing applications."
}
```

### Processing

The backend processes the request through:

```text
Product Input
      │
      ▼
Validation
      │
      ▼
Embedding Generation
      │
      ▼
Semantic Vector Search
      │
      ▼
Similar Product Retrieval
      │
      ▼
Gemini AI Analysis
      │
      ▼
Structured Product Intelligence
```

---

# 📋 Product Intelligence Output

The generated product intelligence can contain the following information.

## Decision Score

An overall score representing the AI-generated assessment of the product.

## Procurement Decision

A procurement-oriented recommendation based on the generated intelligence.

## Market Fit

Indicates how well the product appears to fit the relevant market context.

## Specification Fit

Indicates how well the product specifications align with the analyzed requirements.

## Supply Risk

Represents the assessed supply-related risk.

## Product Summary

A concise description of the analyzed product.

## Market Position

AI-generated analysis of the product's position within its relevant market.

## Pricing Analysis

AI-generated pricing-related observations.

## Features

Important product characteristics identified during analysis.

## Strengths

Positive aspects identified from the available product information and retrieved context.

## Weaknesses

Potential limitations or concerns identified during analysis.

## Recommendations

Procurement-oriented recommendations based on the generated intelligence.

## Similar Products

Semantically related products retrieved from the product catalog.

---

# 🔎 Semantic Retrieval

Semantic retrieval allows ProdNexus to identify products based on meaning rather than only exact keyword matches.

For example, two products may use different wording while describing similar industrial equipment.

The workflow is:

```text
Product Description
       │
       ▼
Embedding Generation
       │
       ▼
Vector Representation
       │
       ▼
MongoDB Vector Search
       │
       ▼
Similarity Matching
       │
       ▼
Related Catalog Products
```

Retrieved products provide additional context for the AI analysis.

---

# 📦 Batch CSV Processing

Bulk processing allows multiple products to be analyzed from a CSV file.

A typical workflow is:

```text
CSV Upload
    │
    ▼
Parse CSV
    │
    ▼
Read Product Rows
    │
    ▼
Analyze Products
    │
    ▼
Track Progress
    │
    ▼
Display Results
    │
    ▼
Export Enriched CSV
```

The batch interface can provide:

- Processing progress
- Product status
- Decision score
- Procurement verdict
- Product inspection
- Enriched CSV export

---

# 💾 Analysis History

Analysis history is stored on the client side using browser LocalStorage.

This allows users to:

- Revisit previous analyses
- Open previously generated intelligence
- Delete individual entries
- Clear the complete history

The history is browser-specific and does not represent a server-side database of user accounts or analyses unless separately implemented by the backend.

---

# 📄 Report Generation

ProdNexus includes a frontend report generation utility:

```text
frontend/src/utils/generateReport.js
```

This utility is responsible for generating a structured product intelligence report from the generated analysis.

---

# 🎯 Project Purpose

ProdNexus is designed to demonstrate how AI can transform raw industrial product information into meaningful procurement and product intelligence.

Instead of manually searching through fragmented product catalogs, users can provide a small amount of product information and receive structured intelligence.

The overall concept is:

```text
Raw Product Data
        ↓
Product Validation
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

# 🌟 Key Benefits

ProdNexus demonstrates how AI and semantic retrieval can help:

- Structure fragmented product information
- Identify semantically similar products
- Enrich product data
- Analyze product characteristics
- Generate procurement-oriented insights
- Process multiple catalog products
- Track AI-generated decision scores
- Export enriched product data
- Revisit previous analyses

---

# 🔐 Security Notes

API keys and database credentials should never be committed to the repository.

Use environment variables for sensitive configuration.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Do not expose private credentials in frontend source code.

---

# 🚀 Future Improvements

Potential future improvements include:

- User authentication
- Persistent cloud-based analysis history
- Advanced procurement dashboards
- Supplier comparison
- Price trend analysis
- More detailed product specifications
- Advanced filtering of retrieved products
- Analytics dashboards
- Role-based access
- Larger-scale batch processing
- Additional AI models
- Improved product recommendation systems

---

# 👩‍💻 Authors

**Muskan Mulani**

**Zoha Shaikh**

Computer Engineering Students  
Trinity Academy of Engineering, Pune

---

# 📌 Project

**ProdNexus**

> Turn Product Data Into Product Intelligence.

---

# 🔗 Repository

GitHub:

https://github.com/z2zohashaikhh/ProdNexus
