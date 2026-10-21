# 🌾 KrishiSetu

> **Empowering Indian Farmer Collectives through Crop Pooling, Direct Buyer Outreach, Labour Marketplace & Farm Gear Exchange.**

[![Deployment](https://img.shields.io/badge/Deployed_on-render-000000?style=for-the-badge&logo=renderl&logoColor=white)](https://krishisetu-8ubi.onrender.com/)&nbsp;&nbsp;&nbsp;
[![Languages](https://img.shields.io/badge/Languages-7_Indian_Languages-d89932?style=for-the-badge)](https://shreyasjoshi659-tech.github.io/krishisetu-ai/)

---

## 🌐 Live Website & Demo Access

Website - https://krishisetu-8ubi.onrender.com/
- **Demo Farmer Login**:
  - **Mobile Number**: `9876543210`
  - **Password**: `password123`
  - *(Or click **"New Register"** to create a custom farmer account in any state)*

---

## 🚜 Key Features & Workflows

### 1. 🌾 Crop Pooling (फसल एकत्रीकरण)
- Instead of individual farmers selling small quantities at distress prices in the mandi, farmers pool identical crops (wheat, basmati rice, soybean, cotton, gram/pulses) into wholesale bulk volumes (50–500 quintals).
- Real-time countdown timer to **Harvest Readiness** keeps all members coordinated.

### 2. ⚖️ Unanimous Price Agreement (मूल्य सहमति)
- Mandi benchmark reference card compares Government Minimum Support Price (MSP) with local APMC market ranges.
- Members vote in an encrypted collective chat to establish a binding minimum reserve price before any offer is released.

### 3. 🏭 Direct Mill Buyer Outreach (सीधी बिक्री)
- Send verified bulk quotations directly to registered flour mills, dal processors, and food manufacturing companies with zero middleman commissions.
- Counter-offers and buyer feedback update directly in the pool chat.

### 4. 🧑‍🌾 Farm Labour Marketplace (खेत श्रमिक)
- Connect with verified agricultural laborers for sowing, harvesting, weeding, and pesticide spraying.
- Transparent daily wage rates and proximity search.

### 5. 🚜 Farm Gear Rental & Exchange (कृषि यंत्र)
- Hourly/daily tractor, reaper, rotavator, and sprayer rentals between neighboring farmers.

### 6. 🌱 Vertical Farming Workspace (Hackathon Demo)
- Open **Vertical Farm** from the signed-in app navigation to see example crop progress, equipment checks, sample produce plans, and demo produce orders.
- Farm Operators and Delivery Partners can register, view role-based work, accept assignments, and update task status. Operator profiles can post work.
- Partner profiles, task assignments, plan requests, and demo order requests use the existing JSON-file store under `DATA_DIR`; they are protected by the app's existing sign-in.
- Plan prices, produce quantities, crop progress, equipment status, catalog prices, and seeded work listings are **sample demo data**, not confirmed offers or live sensor readings. Plan and order requests do not collect payment or arrange delivery.
- The investment comparison uses editable example inputs to estimate annual revenue, operating costs, break-even selling price, and setup payback. It is an illustration, not financial advice or a profit guarantee.

---

## 🗣️ Supported Languages (7 Indian Languages)

KrishiSetu features a reactive, zero-reload translation engine with synchronized dropdowns on the topbar and authentication forms:
- 🇮🇳 **English** (`en`)
- 🇮🇳 **हिन्दी (Hindi)** (`hi`)
- 🇮🇳 **मराठी (Marathi)** (`mr`)
- 🇮🇳 **ਪੰਜਾਬੀ (Punjabi)** (`pa`)
- 🇮🇳 **ಕನ್ನಡ (Kannada)** (`kn`)
- 🇮🇳 **తెలుగు (Telugu)** (`te`)
- 🇮🇳 **ગુજરાતી (Gujarati)** (`gu`)

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/shreyasjoshi659-tech/KrishiSetu_.git

# Navigate into project directory
cd KrishiSetu_

# Install dependencies
npm ci

# macOS / Linux: keep test accounts and JSON changes outside the sample data folder
DATA_DIR=.local-data npm start
# Server runs at http://localhost:3000
```

On Windows PowerShell, set the data directory first, then start the server:
```powershell
$env:DATA_DIR = ".local-data"
npm start
```

Open `http://localhost:3000`, register a test account, sign in, then choose **Vertical Farm**. The old `/vertical-farming.html` URL redirects to the integrated app page. The demo does not need extra environment variables; the app creates a local JWT secret automatically. `.local-data/` is ignored by Git so test records are not committed. Render's `render.yaml` sets `DATA_DIR=/var/data` and mounts a persistent disk, so the new JSON collections persist there. The Vercel configuration uses the app's `/tmp` fallback unless a persistent data directory is configured.

---

## 📜 License
Developed for Indian Agricultural Cooperatives & Farmer Producer Organizations (FPOs).
