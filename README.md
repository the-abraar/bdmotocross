# Bangladesh Motocross Club & Academy (BMCA) — Official Platform

> **Version:** `v0.2`  
> **Riders in:** Dhaka, Narsingdi, Sylhet, Chittagong, Cumilla (nationwide, not Chittagong-based)  
> **Motto:** *Ride Safe • Train Hard • Race Strong*  
> **Official Web Platform:** [https://bdmotocross.com](https://bdmotocross.com)  
> **Rider Paddock Community:** [https://paddock.bdmotocross.com](https://paddock.bdmotocross.com)

The official web platform and digital ecosystem for **Bangladesh Motocross Club & Academy (BMCA)**. BMCA is Bangladesh's premier racing club and motocross rider development academy, fostering grassroots dirt bike competition, athlete conditioning, track discipline, and certified safety standards at national events nationwide.

---

## 🏁 Architecture & Live Platforms

The BMCA digital ecosystem is split into two complementary production tiers operating under a unified domain topology:

| Tier | Purpose | Stack | Domain | Hosting & Infrastructure |
| :--- | :--- | :--- | :--- | :--- |
| **Public Marketing Hub** (`website/`) | High-octane public landing page, racer & mentor roster, race fixture countdown, curriculum breakdown, lightbox media gallery, sponsor showcase, WhatsApp registration. | Semantic HTML5, CSS3, Vanilla ES6 JavaScript | [https://bdmotocross.com](https://bdmotocross.com) | **GitHub Pages** with Namecheap DNS (A & AAAA records, `www` CNAME), automated Let's Encrypt TLS (Enforce HTTPS). Deployed via GitHub Actions (`.github/workflows/deploy.yml`). |
| **BMCA Rider Paddock** (`paddock/`) | Full-stack member community, vanity racer profiles (`/u/:username`), trackside admin roster provisioning (`/admin/roster`), live community feed (`/feed`), WebP media uploads, WhatsApp privacy controls. | Next.js 16 (App Router), React 19, Tailwind CSS, TypeScript | [https://paddock.bdmotocross.com](https://paddock.bdmotocross.com) | **Vercel** with Supabase PostgreSQL (Row-Level Security, database triggers, `paddock-media` storage bucket). Subdomain mapped via Namecheap CNAME (`cname.vercel-dns.com.`). |

---

## 📂 Repository Structure

```
.
├── .github/workflows/
│   ├── deploy.yml            # Automated GitHub Pages CI/CD workflow for website/
│   └── keep-alive.yml        # Scheduled Supabase free-tier keep-alive ping
├── docs/                     # Strategic architecture, PRD, and research documentation
│   ├── architecture_for_profiles.md # Technical architecture specification (v2.1)
│   ├── PRD_for_profiles.md   # Product requirements document for rider profiles & paddock
│   ├── BRAND_IDENTITY.md     # Master Brand Identity & Design System Specification
│   ├── marketing/
│   │   └── domain-comparison.md # Domain strategy & registrar pricing comparison
│   └── dev_agent_handoffs/   # Implementation guides and audits
├── paddock/                  # Next.js 16 Paddock Community Platform
│   ├── app/                  # Next.js App Router (feed, login, settings, admin, /u/:username)
│   ├── components/           # Reusable UI components & modals
│   ├── supabase/             # Supabase database migrations, tests & unified setup
│   │   ├── full_setup.sql    # Single-run master schema script (Migrations 1–5)
│   │   ├── migrations/       # Sequential individual SQL migrations (0001–0005)
│   │   └── tests/            # pgTAP RLS tests (rls.test.sql, `npm run test:rls`)
│   └── utils/                # Supabase client/server/admin utilities
├── website/                  # Production static marketing website
│   ├── CNAME                 # Apex custom domain configuration (bdmotocross.com)
│   ├── css/
│   │   └── styles.css        # High-octane dark motorsports stylesheet
│   ├── js/
│   │   ├── site.js           # Landing, academy & gallery pages: nav, countdown, lightbox, rider codes, WhatsApp forms
│   │   ├── analytics.js      # PostHog (pageviews, clicks, scroll, heatmaps, replay) + named events; set KEY to enable
│   │   └── main.js           # Legacy pages (racers/, mentors/, brand.html)
│   ├── images/               # High-res photography, logos, sponsor assets
│   ├── racers/               # Individual standalone racer profiles
│   ├── mentors/              # Mentor accreditation and coaching bio
│   ├── academy.html          # Academy: curriculum, programmes, rider-code discount entrance, safety
│   ├── gallery.html          # Dedicated full-page media gallery
│   └── index.html            # Main flagship single-page hub
├── .gitignore
└── README.md
```

---

## 🚀 Local Development

### 1. Marketing Website (`website/`)

To run and preview the static marketing site locally:

```bash
cd website
python3 -m http.server 8000
```

Navigate to `http://localhost:8000`.

### 2. Paddock Community App (`paddock/`)

To develop and test the Next.js Paddock platform:

```bash
cd paddock
npm install
npm run dev
```

Navigate to `http://localhost:3000`.

To run database and component tests:

```bash
cd paddock
npm test
```

---

## 🌐 Production Deployments & DNS Topology

### Namecheap Advanced DNS Configuration (`bdmotocross.com`)

| Type | Host | Target / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `185.199.108.153` | GitHub Pages Apex |
| **A Record** | `@` | `185.199.109.153` | GitHub Pages Apex |
| **A Record** | `@` | `185.199.110.153` | GitHub Pages Apex |
| **A Record** | `@` | `185.199.111.153` | GitHub Pages Apex |
| **AAAA Record** | `@` | `2606:50c0:8000::153` | GitHub Pages IPv6 |
| **AAAA Record** | `@` | `2606:50c0:8001::153` | GitHub Pages IPv6 |
| **AAAA Record** | `@` | `2606:50c0:8002::153` | GitHub Pages IPv6 |
| **AAAA Record** | `@` | `2606:50c0:8003::153` | GitHub Pages IPv6 |
| **CNAME Record** | `www` | `the-abraar.github.io.` | Redirects www to root |
| **CNAME Record** | `paddock` | `cname.vercel-dns.com.` | Routes Paddock app to Vercel |

### GitHub Pages (Marketing Site)
- Triggered automatically on push to `main` via [.github/workflows/deploy.yml](file:///.github/workflows/deploy.yml).
- Served at `https://bdmotocross.com` with HTTPS enforced.

### Vercel & Supabase (Paddock Platform)
- Linked to `the-abraar/bdmotocross` with root directory set to `paddock`.
- Environment variables connected via the official Supabase Vercel Integration (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_DOMAIN`).
- Served at `https://paddock.bdmotocross.com`.

---

© 2026 Bangladesh Motocross Club & Academy • Bangladesh
