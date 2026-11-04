# Bangladesh Motocross Club & Academy (BMCA) — Official Website

> **Version:** `v0.1`  
> **Headquarters:** Chittagong, Bangladesh  
> **Motto:** *Ride Safe • Train Hard • Race Strong*

The official web platform for **Bangladesh Motocross Club & Academy (BMCA)**. BMCA is Bangladesh's premier racing club and motocross rider development academy, fostering grassroots dirt bike competition, athlete conditioning, track discipline, and certified safety standards from Chittagong to national events nationwide.

---

## 🏁 Key Features & Architecture

- **High-Octane Motorsports Theme:** Custom dark aesthetic engineered with racing red (`#e11d48`), track green (`#22c55e`), and trophy gold accents, modern typography (`Barlow Semi Condensed`, `Plus Jakarta Sans`, `Teko`).
- **Interactive Racer & Mentor Roster:**
  - **Md. Mahabubur Rahman Hafiz (MR99):** Director & Pro Track Champion
  - **Salauddin Ahmed Bulbul (Baundal Bulbul #07):** Official Mentor (Certified 6-Month Enduro/Motocross Training at TWM Academy of Moto Adventure, Kolkata, India)
  - **Sharif ON Track (#05):** Pro Track Racer
  - **Sultan Sheikh (#77):** Pro Category Racer
- **2026–2027 Racing Fixture Calendar:**
  - Interactive fixture tracker with dynamic countdown timer to upcoming races (Feni Track Trial, Chittagong Hill Track Champion, Furious Track Trial, MRF Rajshahi, Jessore Enduro, MotoMadness 2027).
- **Curriculum & Skill Progression:**
  - Comprehensive 4-stage academy breakdown: Bike Control & Body Stance, Cornering & Rut Traversal, Jumping & Pre-load, Gate Starts & Racecraft.
- **High-Definition Lightbox Gallery:**
  - Filterable photo archive with keyboard-accessible fullscreen lightbox.
- **Direct WhatsApp Academy Registration:**
  - Validated interactive inquiry form that pre-formats direct WhatsApp messages to BMCA leadership (`+8801975376114`).
- **Official Sponsors & Partners:**
  - DCS (Official Sponsor)
  - Moto Freak Lab (Official Service Partner)

---

## 📂 Repository Structure

```
.
├── .github/workflows/
│   └── deploy.yml            # Automated GitHub Pages CI/CD workflow
├── builder/                  # Project specifications, handoffs & research
├── website/                  # Production website root
│   ├── css/
│   │   └── styles.css        # Modern responsive stylesheet
│   ├── js/
│   │   └── main.js           # Navigation, filters, countdown, lightbox, forms
│   ├── images/               # High-res photography, logos, and sponsor assets
│   ├── racers/               # Individual standalone racer profiles
│   │   ├── mahabubur-rahman-hafiz.html
│   │   ├── sharif-on-track.html
│   │   └── sultan-sheikh.html
│   ├── mentors/              # Mentor accreditation and coaching bio
│   │   └── salauddin-ahmed-bulbul.html
│   ├── gallery.html          # Dedicated full-page media gallery
│   └── index.html            # Main flagship single-page hub
├── BRAND_IDENTITY.md                               # Master Brand Identity & Design System Specification
├── international-benchmarks-and-brand-evolution.md # Global Benchmark Research (US & EU Compounds)
├── product-and-frontend-implementation-guide.md    # Product & Frontend Implementation Guide
├── .gitignore
└── README.md
```

---

## 🚀 Local Development

To run and preview the site locally:

```bash
cd website
python3 -m http.server 8000
```

Then navigate to `http://localhost:8000` in your web browser.

---

## 🌐 Deployment to GitHub Pages

This repository is equipped with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys the contents of `website/` to GitHub Pages on every push to `main`.

To enable:
1. Go to **Settings > Pages** in the GitHub repository.
2. Under **Build and deployment > Source**, select **GitHub Actions**.

---

© 2026 Bangladesh Motocross Club & Academy • Chittagong, Bangladesh
