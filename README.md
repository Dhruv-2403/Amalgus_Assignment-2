# AmalGus — Glass Marketplace Prototype

> World's First B2B2C Glass & Allied Products Niche Marketplace  
> Built for AmalGus Technology Internship Assignment

---

## Live Demo
> Add your deployed URL here after deployment

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + React Router + Recharts |
| Backend | Node.js + Express |
| Database | JSON file-based (products, rates, vendors, allied products) |
| AI Matching | Google Gemini 1.5 Flash API |

---

## Features

- **Glass Product Catalog** — 12 glass types with filters by type, application, and search
- **AI Smart Matching** — Gemini-powered natural language glass recommendation
- **Estimate Generator** — Live quote calculator with GST, installation, vendor comparison
- **Daily Rates Dashboard** — Real-time rate ticker + 7-day trend chart (Recharts)
- **Vendor Comparison** — Multiple vendors per product with pricing and ratings
- **Allied Products Cross-sell** — Hardware, sealants, frames suggested alongside glass
- **Role Selector** — Homeowner / Architect / Builder / Dealer experience
- **Product Detail Page** — Full specs, vendor contacts, allied product suggestions

---

## Project Structure

```
amalgus/
├── backend/
│   ├── server.js           # Express entry point
│   ├── routes/
│   │   ├── products.js     # GET /api/products, GET /api/products/:id
│   │   ├── rates.js        # GET /api/rates
│   │   ├── estimate.js     # POST /api/estimate
│   │   └── ai.js           # POST /api/ai/match
│   ├── data/
│   │   ├── products.json   # 12 glass products
│   │   ├── rates.json      # Daily rates + 7-day trend
│   │   ├── vendors.json    # 4 verified vendors
│   │   └── allied.json     # 10 allied products
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/index.js    # Axios API helpers
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   └── pages/
│   │       ├── Catalog.jsx
│   │       ├── ProductDetail.jsx
│   │       ├── AIMatch.jsx
│   │       ├── Estimate.jsx
│   │       └── Rates.jsx
│   └── package.json
└── README.md
```

---

## Setup & Run

### 1. Get a Gemini API Key
Go to [aistudio.google.com](https://aistudio.google.com) → Get API Key (free)

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env and paste your Gemini API key
npm install
npm run dev
# API running at http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | All products (supports `?type=`, `?application=`, `?search=`) |
| GET | `/api/products/:id` | Product detail + matched vendors + allied products |
| GET | `/api/rates` | Today's rates + 7-day trend |
| POST | `/api/estimate` | Generate quote (body: `productId`, `widthMm`, `heightMm`, `quantity`, `role`) |
| POST | `/api/ai/match` | Gemini AI glass recommendation (body: `query`, `role`) |

---

## Deployment

### Backend → Railway or Render
1. Push to GitHub
2. Connect repo on [railway.app](https://railway.app) or [render.com](https://render.com)
3. Set environment variable: `GEMINI_API_KEY=your_key`
4. Deploy — get your backend URL

### Frontend → Vercel or Netlify
1. Update `vite.config.js` proxy target to your backend URL (for production, set `VITE_API_URL` env var)
2. Push to GitHub, connect on Vercel/Netlify
3. Deploy

---

## Sample AI Queries to Test

| Query | Expected result |
|---|---|
| "Glass for bathroom shower" | Toughened 8mm |
| "Soundproof office cabin" | Acoustic or DGU/IGU |
| "High-rise balcony railing" | Toughened + Laminated 12mm |
| "Energy efficient south facade" | Low-E DGU |
| "Kitchen backsplash" | Back-Painted 8mm |
| "Conference room privacy" | Frosted or Smart/Switchable |

---

*Built with 25 years of glass industry knowledge + modern full-stack technology.*
