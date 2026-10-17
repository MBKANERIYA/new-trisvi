# Changelog

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



