# TRISHVI GLOBAL LTD — Website

## Overview
Premium B2B import-export website for TRISHVI GLOBAL LTD, a UK-based international trading company connecting UK, India, and global markets.

## Tech Stack
- **Frontend:** React 19 + Vite 6
- **Backend:** Express 5 (Node.js)
- **Routing:** React Router DOM 7
- **Animation:** GSAP 3.15 + ScrollTrigger, Lenis 1.3
- **Icons:** Lucide React
- **Styling:** Vanilla CSS with CSS variables
- **Fonts:** Poppins (headings) + Inter (body)

## Directory Structure
```
new trisvi/
├── client/
│   ├── index.html          # Entry HTML
│   ├── vite.config.js      # Vite config
│   ├── src/
│   │   ├── main.jsx        # React bootstrap
│   │   ├── App.jsx         # All components + routes (single-file)
│   │   ├── data.js          # Business data (products, services, contact)
│   │   └── styles.css       # All styles
│   └── public/assets/       # Static images
│       ├── img-s/           # Product & page images (33 files)
│       └── *.svg            # Icon assets
├── server/
│   └── server.js            # Express API (contact form + enquiries)
└── package.json              # Root config with dev/build scripts
```

## Pages & Routes
| Route | Component | Description |
|---|---|---|
| `/` | Home | Hero + About + Services + Products + Trade Facts + Process + Quality |
| `/about` | About | Company info + Quality & Compliance |
| `/services` | Services | All 6 services grid |
| `/services/:slug` | ServiceDetail | Individual service full detail page |
| `/products` | Products | All 7 product categories grid |
| `/products/:slug` | CategoryDetail | Individual product category detail |
| `/how-we-work` | Process | 6-step process detailed view |
| `/partners` | Partners | Supplier partnership form |
| `/buyer-enquiry` | BuyerEnquiry | Buyer enquiry form |
| `/product-development` | ProductDevelopment | Development pipeline + current project |
| `/contact` | Contact | Contact form + company info |

## API Endpoints
- `GET /api/health` — Health check
- `POST /api/contact` — Contact form submission
- `POST /api/enquiries` — Enquiry form submission

## Color Palette (Redesign)
- Primary sky blue: `#38BDF8`
- Deep navy: `#0F172A`
- White: `#FFFFFF`
- Pale blue: `#F0F9FF`
- Secondary blue: `#0284C7`
- Light borders: `#E2E8F0`

## Quick Facts
| Field | Value |
|---|---|
| Repository | `https://github.com/MBKANERIYA/new-trisvi.git` |
| Default Branch | `main` |
| Frontend Dev Port | `5173` |
| Backend API Port | `5000` |

## Reading Order
1. `README.md` — This file
2. `changelog.md` — Change history

