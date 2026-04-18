# AmalGus — Glass Marketplace Prototype (v2 MongoDB)

> World's First B2B2C Glass & Allied Products Niche Marketplace  
> Built for AmalGus Technology Internship Assignment — Migration to MongoDB

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + React Router + Recharts |
| Backend | Node.js + Express |
| Database | **MongoDB + Mongoose** (Migrated from JSON) |
| AI Matching | Rule-based scoring engine (Gemini-ready) |

---

## Features

- **Glass Product Catalog** — 12 glass types sourced from MongoDB with advanced filters
- **Persistence** — All generated estimates are now saved to the database
- **AI Smart Matching** — Rule-based glass recommendation matching products in DB
- **Estimate Generator** — Live quote calculator with persistent storage
- **Daily Rates Dashboard** — Dynamic rate trends from the database
- **Data Migration** — Built-in seeding script to populate DB from legacy JSON files

---

## Setup & Run

### 1. Database Setup
Ensure you have a MongoDB instance (Local or Atlas).
Add your connection string to `backend/.env`:
```env
MONGODB_URI=mongodb+srv://...
```

### 2. Backend setup
```bash
cd backend
npm install
node seed.js    # Crucial: This migrates glass data into MongoDB
node server.js
# API running at http://localhost:5001
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

