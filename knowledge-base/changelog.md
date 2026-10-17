# Changelog

## 2026-10-17 — Fix Mobile Header Overlay & Sizing
**What**: Fixed mobile header issues — nav overlay, logo sizing, z-index layering
**Why**: Mobile menu wasn't properly covering page content; logo overflowed header container
**Files Changed**: `client/src/styles.css`
**Commit**: `a26a650`
- Mobile nav now covers full viewport (top: 0) with padding for header clearance
- Logo reduced to 52px (tablet) / 44px (mobile) from 72px to fit header
- Header z-index bumped to 100, nav to 55, menu-toggle to 60 for proper layering
- Added `-webkit-backdrop-filter` for Safari mobile support
- Added `--header-height: 60px` for mobile breakpoint (≤560px)

## 2026-10-15 — Premium UI/UX Redesign
**What**: Complete visual redesign with premium animations, smooth scrolling, and modern UI
**Why**: Transform the existing functional website into a premium international B2B trading brand
**Files Changed**:
- `client/index.html` — Updated meta, fonts, title for TRISHVI GLOBAL LTD
- `client/src/styles.css` — Complete redesign with new color palette, typography, animations
- `client/src/App.jsx` — GSAP ScrollTrigger integration, Lenis smooth scroll, enhanced components
- Bullet details added after implementation

## 2026-10-17 — Added Logo Image (lo.png)
**What**: Replaced text-based wordmarks in Header and Footer with the actual company logo image (lo.png)
**Why**: User requested adding lo.png as the site logo for consistent brand identity
**Files Changed**:
- `client/src/App.jsx` — Header brand link now uses `<img>` with `lo.png`; Footer wordmark replaced with logo image wrapped in a link
- `client/src/styles.css` — Replaced `.wordmark` styles with `.brand` / `.brand-logo` styles (52px height); replaced `.footer-wordmark` styles with `.footer-logo` (56px height, white inversion filter for dark background)
- Logo file located at: `client/public/lo.png`

## 2026-10-17 — Clickable Service Cards with Detail Pages
**What**: Made all 6 service cards clickable, each opening a full detail page at `/services/:slug`
**Why**: User requested each service card navigate to a full content page
**Files Changed**:
- `client/src/data.js` — Added `slug`, `detail`, `points[]`, and `heroImage` to each service object
- `client/src/App.jsx` — Wrapped `ServiceCard` in `<Link>`, added `ServiceDetail` page component with prev/next navigation, added `/services/:slug` route
- `client/src/styles.css` — Added `.service-card-link`, `.service-detail`, `.service-points`, `.service-nav-*` styles and `.button.outline-deep` variant

## 2026-10-17 — Git Repository Initialized and Pushed to GitHub
**What**: Added `.gitignore`, initialized Git repository, set main branch, and pushed source code to GitHub remote
**Why**: Version control setup and repository backup to https://github.com/MBKANERIYA/new-trisvi.git
**Files Changed**:
- `.gitignore` — Created to ignore `node_modules/`, `dist/`, logs, and environment configs
- `knowledge-base/changelog.md` — Documented changes
**Commit**: `679c851`

## 2026-10-17 — Vercel Deployment Configuration
**What**: Added `vercel.json` config and serverless API functions for Vercel deployment
**Why**: Deploy the site to Vercel (serverless platform) — Express server can't run as-is on Vercel
**Files Changed**:
- `vercel.json` — Build command, output directory, SPA rewrite rules
- `api/health.js` — Serverless GET /api/health endpoint
- `api/contact.js` — Serverless POST /api/contact endpoint
- `api/enquiries.js` — Serverless POST /api/enquiries endpoint
**Commit**: `77d9e1e`

## 2026-10-17 — Real Contact Details Added
**What**: Updated contact info across the site with real company details: email (trishvigloballtd@gmail.com), two phone contacts (Kairav Patel +44 7916221136, Shad Sheikh +91 7069862072), and full UK address (11 Alexandra Street, Thurmaston, Leicester, LE4 8FD)
**Why**: User provided real business contact information to replace placeholder data
**Files Changed**:
- `client/src/data.js` — Replaced placeholder emails with real contact object (email, phone1/name1, phone2/name2, address)
- `client/src/App.jsx` — Updated Contact page sidebar with address + phone contacts, added "Our Office" section to About page with 4-card grid, updated Footer with email/phones/address
- `client/src/styles.css` — Added `.about-contact`, `.about-contact-grid`, `.about-contact-card` styles with responsive breakpoints
**Commit**: `0596014`
