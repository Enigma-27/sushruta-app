# 🏥 Sushruta: Senior Care & Remote Wellbeing Platform

> **"Empowering the golden years with clinical clarity, connected caregiving, and intelligent monitoring."**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 🌟 Overview & Problem Statement

Navigating modern healthcare technology can be intimidating and overwhelming for senior citizens. Existing medical applications are often cluttered with fine print, complex navigation patterns, and fragmented records with no integration for caregivers and physicians.

**Sushruta** is a full-stack, accessibility-first geriatric healthcare platform engineered specifically for seniors, their caregivers, and medical practitioners. Featuring a high-contrast, intuitive interface with real-time vitals calculation, voice feedback, emergency SOS dispatching, and role-based workflows, Sushruta bridges the communication gap between family members and doctors.

---

## 🚀 Key Features & Architecture

### 1. 👥 Multi-Role Access Control (RBAC)
* **Senior Mode:** High-contrast touch targets, one-tap medicine adherence, audio guidance, and streamlined vitals.
* **Caretaker Mode:** Inventory replenishment triggers, adherence compliance auditing, and diet tracking.
* **Doctor Portal:** Clinical dashboard to review vitals, prescribe medications, and approve or reschedule patient appointments.

### 2. 📊 WHO-Referenced Health Score Engine
* Clinical algorithm dynamically calculates a composite **0–100 Daily Health Score** based on:
  * **Medicine Adherence (30 pts)** — Daily routine completion percentage.
  * **Blood Pressure (20 pts)** — Systolic and diastolic evaluation against WHO thresholds.
  * **Resting Heart Rate (10 pts)** — Normative range monitoring.
  * **Sleep Quality (15 pts)** — Rest duration and consistency.
  * **Mobility & Activity (15 pts)** — Daily step threshold tracking.
  * **Physical Exercise (10 pts)** — Guided movement routines.

### 3. 🚨 One-Click SOS Emergency System
* Prominent, 2-step confirmed panic trigger to prevent accidental alerts.
* Dispatches instantaneous emergency broadcast with GPS coordinates to registered guardians, primary physicians, and local emergency services.

### 4. 💊 Digital Pillbox & Smart Pharmacy
* Schedule-based medicine tracking (Morning, Afternoon, Night).
* Live stock counters with automated low-inventory alerts.
* Integrated directory linking to verified pharmacies (Tata 1mg, Apollo 24/7, PharmEasy).

### 5. 📑 Encrypted Records & Insurance Vault
* Unified digital health repository storing diagnostic reports and insurance policy documents.
* Indexed by doctor, date, and document type.

### 6. 🌿 Holistic Wellness & Mind Care
* **Emotional Wellbeing:** Daily mood logs, gratitude journaling, and curated geriatric wellness media.
* **AI Companion:** Interactive conversational health assistant for everyday health queries.
* **Nutritional Guidance & Yoga:** Meal plans and gentle seated/standing yoga routines designed for joint pain relief.

### 7. 🔄 Fault-Tolerant Hybrid Data Sync
* **Cloud API First:** Synchronizes live state with the Express / MongoDB REST API.
* **Offline Local Cache:** Automatic fallback to browser storage during network outages, guaranteeing zero downtime or blank screens.
* **Live Connectivity Badge:** Desktop status indicator displays real-time synchronization state.

---

## 🛠️ Full-Stack Technology Stack

### Frontend
* **Core:** React 19, JavaScript (ESNext)
* **Build System:** Vite 7 (sub-second HMR & optimized production chunking)
* **Styling:** Vanilla CSS & Tailwind CSS v4, Glassmorphism, Responsive Mobile/Desktop Drawers
* **Icons & Visuals:** Phosphor Icons Web, Lucide React
* **Data Visualization:** Chart.js, SVG Health Ring Animation
* **Browser APIs:** Web Speech Synthesis API (`speechSynthesis`), HTML5 Geolocation API

### Backend & Database
* **Runtime:** Node.js (v20+)
* **Framework:** Express.js (v5)
* **Database:** MongoDB Atlas via Mongoose ODM (v9)
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs salted hashing
* **Middleware:** Asynchronous error handling, CORS headers, JWT authorization guards

---

## 📁 Repository Structure

```
sushruta-app/
├── backend/                  # Express REST API Server
│   ├── config/              # MongoDB connection & status
│   ├── controllers/         # Business logic (auth, meds, appts, records, etc.)
│   ├── middleware/          # JWT protect guard & error handler
│   ├── models/              # Mongoose schemas (User, Med, Appointment, Record, etc.)
│   ├── routes/              # Express endpoint routers
│   ├── .env.sample          # Environment variables template
│   └── server.js            # Main backend server entry point
├── src/                      # React Single Page Application
│   ├── components/          # Reusable UI cards, charts, loaders, and modals
│   ├── features/            # Feature domains (auth, dashboard, meds, connect, etc.)
│   ├── layout/              # Sidebar navigation, Header, Right calendar panel
│   ├── services/            # API client (api.js), Data sync engine (dataService.js)
│   ├── styles/              # Global styles, Tailwind v4 directives, keyframe animations
│   ├── App.jsx              # Main application controller
│   └── main.jsx             # React DOM root & Phosphor icon weight providers
├── public/                  # Static assets & icons
├── index.html               # HTML5 document template
├── package.json             # Frontend dependencies & scripts
└── vite.config.js           # Vite configuration
```

---

## 💻 Local Setup & Installation

### Prerequisites
* **Node.js**: v18.0 or higher
* **npm**: v9.0 or higher
* **MongoDB**: Local MongoDB instance or free MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/Enigma-27/sushruta-app.git
cd sushruta-app
```

### 2. Configure Backend Environment
Create a `.env` file in the `backend/` directory:
```bash
cd backend
cp .env.sample .env
```
Ensure `backend/.env` contains your preferred configuration:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/sushruta
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Install Dependencies
```bash
# Install frontend dependencies (from root directory)
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 4. Start the Application

Open two terminal windows:

* **Terminal 1 — Start the Backend Server:**
  ```bash
  cd backend
  npm start
  ```
  *The server will start on `http://localhost:5000` with health check at `http://localhost:5000/api/health`.*

* **Terminal 2 — Start the Frontend Development Server:**
  ```bash
  npm run dev
  ```
  *Open your browser and navigate to `http://localhost:5173`.*

---

## 👥 Core Engineering Team

* **Yash Madake** — *Full Stack Developer* (System architecture, API integration, frontend–backend coordination)  
* **Sanskar Sagare** — *Frontend Developer* (UI components, state management, responsive design, UX flow)  
* **Rohan Yadav** — *Backend Developer* (API logic, database models, authentication, server-side workflows)  
* **Ruturaj Joshi** — *AI Engineer* (AI feature exploration, data processing, model integration, intelligent automation)  
* **Taarak Gulhane** — *Cloud & Deployment Engineer* (Cloud infrastructure setup, CI/CD pipelines, environment configuration)

---

## 📄 License
This project is open source and available under the [ISC License](LICENSE).
