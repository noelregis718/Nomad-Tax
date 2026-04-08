# 🌍 Nomad-Tax: Global Residency & Tax Intelligence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-black.svg)](https://www.prisma.io/)

**Nomad-Tax** is a high-fidelity, full-stack intelligence platform designed for digital nomads, remote professionals, and perpetual travelers. It solves the critical problem of tracking physical presence across multiple tax jurisdictions and visa zones, ensuring you never accidentally trigger a tax residency or overstay a visa.

---

## ✨ Key Features

### 🧠 Intelligent Residency Engine
- **Rolling Window Logic**: Hardware-accurate implementation of the **Schengen 90/180-day rule**.
- **Automated Tripwires**: Real-time alerts as you approach the **183-day tax threshold** in any country.
- **Conflict Detection**: Built-in logic to prevent overlapping stay entries, ensuring 100% data integrity.

### 📊 Premium Visual Experience
- **Bento-Style Dashboard**: A modern, data-dense interface designed for clarity and impact.
- **Animated Travel Timeline**: A color-coded, interactive timeline of your global movement (powered by Framer Motion).
- **Compliance Charts**: High-end data visualization of your residency status across multiple regions.

### 💼 Professional Utilities
- **Audit-Ready Reports**: One-click generation of travel history for tax season or visa applications.
- **Global Rule Vault**: Pre-configured rules for major zones including Schengen, USA, UK, and more.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React 19** | Modern UI components with extreme performance. |
| **Styling** | **Custom CSS** | Premium glassmorphic design system. |
| **Animations** | **Framer Motion** | Silky-smooth micro-interactions and timeline effects. |
| **Charts** | **Recharts** | Interactive residency data visualization. |
| **Backend** | **Node.js + Express** | High-performance RESTful API. |
| **Database** | **Prisma (PostgreSQL)** | Type-safe ORM for mission-critical travel data. |
| **Logic** | **date-fns**| Specialized mathematical engine for date range calculations. |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Git**
- **PostgreSQL** (Optional: You can switch Prisma to `sqlite` for local development)

### 2. Installation

#### Clone the repository:
```bash
git clone https://github.com/yourusername/nomad-tax.git
cd nomad-tax
```

#### Setup the Backend:
```bash
cd backend
npm install
# Create a .env file and add your DATABASE_URL
npx prisma generate
npx prisma db push
npm start
```

#### Setup the Frontend:
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```text
├── backend/
│   ├── prisma/              # Database schema and migrations
│   ├── utils/               # Core logic (calculator.js)
│   └── server.js            # Express API endpoints
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (Layout, Timeline)
│   │   ├── pages/           # Main views (Dashboard)
│   │   ├── utils/           # API communication layer
│   │   └── index.css        # Global glassmorphic 디자인 system
└── README.md
```

---

## 🗺️ Roadmap
- [ ] **Phase 4**: Real-time Map integration using MapLibre/Leaflet.
- [ ] **Phase 5**: Google/Apple Calendar sync for automated stay tracking.
- [ ] **Phase 6**: Push notifications for critical visa expiry alerts.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contact
Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/nomad-tax](https://github.com/yourusername/nomad-tax)

---
*Built with ❤️ for the global nomad community.*
