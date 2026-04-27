# 🚀 Laptop Price Predictor — Deployment Guide

## Project Structure

```
laptop-price-prediction/
├── backend/
│   ├── app.py                    ✅ Fixed (PORT env variable)
│   ├── predict_price.py
│   ├── laptop_price_model.pkl    ⚠️  Copy here from your machine
│   ├── Procfile                  ✅ Fixed
│   └── requirements.txt          ✅ OK
└── frontend/
    ├── src/
│   │   ├── main.jsx
    │   └── LaptopPricePredictor.jsx  ✅ Fixed (uses VITE_API_URL)
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

---

## Fixes Applied

| File | Problem | Fix |
|------|---------|-----|
| `app.py` | Hardcoded port 10000 | Now reads `PORT` env variable (required by Render) |
| `LaptopPricePredictor.jsx` | Hardcoded `your-app.onrender.com` | Now uses `VITE_API_URL` env variable |
| `Procfile` | Could cause issues | Simplified to `web: gunicorn app:app` |

---

## Step-by-Step Deployment

### 1️⃣ Backend → Render (Free)

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** → `backend`
4. Set these:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Environment:** Python 3
5. Click **Deploy**
6. Copy your URL: `https://your-app-name.onrender.com`

> ⚠️ **Important:** The `.pkl` model file must be in the `backend/` folder.  
> If it's >100MB, use [Git LFS](https://git-lfs.com/) or host on Google Drive and download at startup.

---

### 2️⃣ Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Set **Root Directory** → `frontend`
4. Add **Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-app-name.onrender.com` (from step 1)
5. Click **Deploy**

---

### 3️⃣ Push to GitHub

```bash
# First time
git init
git add .
git commit -m "Initial commit — Laptop Price Predictor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# After changes
git add .
git commit -m "your message"
git push
```

---

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env → set VITE_API_URL=http://localhost:5000
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Test the API

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Dell",
    "type_name": "Notebook",
    "inches": 15.6,
    "ram_gb": 8,
    "weight_kg": 2.0,
    "cpu_brand": "Intel",
    "cpu_ghz": 2.5,
    "gpu_brand": "Nvidia",
    "ips": 1,
    "touchscreen": 0,
    "ppi": 141,
    "ssd_gb": 256,
    "hdd_gb": 0,
    "os": "Windows 10"
  }'
```

Expected response:
```json
{"status": "success", "predicted_price": 52430.75}
```
