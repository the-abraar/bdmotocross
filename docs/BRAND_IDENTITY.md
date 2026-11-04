# Bangladesh Motocross Club & Academy (BMCA)
# Brand Identity & Design System Specification

> **Version:** `1.0.0`  
> **Status:** Active Standard for All AI Agents & Human Collaborators  
> **Headquarters:** Chittagong Dirt Arena, Chittagong, Bangladesh  
> **Platform URL:** [https://the-abraar.github.io/bdmotocross/](https://the-abraar.github.io/bdmotocross/)  
> **Motto:** *Ride Safe • Train Hard • Race Strong*  
> **Hero Tagline:** *Ride. Race. Achieve.*  

---

## 📌 Document Purpose & Scope

This specification serves as the **authoritative single source of truth (SSOT)** for the brand identity, visual system, voice, technical architecture, and domain knowledge of the **Bangladesh Motocross Club & Academy (BMCA)**.

Any AI agent (ArchitectUX, LuxuryDeveloper, ProjectManager, ContentWriter, UI Reviewer, etc.) or developer contributing to BMCA codebases, documentation, marketing materials, or communications **must adhere to the directives in this document**.

---

## 1. Brand Core & Mission

### 1.1 Brand Story & Positioning
Motocross in Bangladesh is an emerging, high-octane motorsport that has historically suffered from informal organization, lack of dedicated training circuits, and high physical risk. 

**Bangladesh Motocross Club & Academy (BMCA)** was founded in Chittagong to pioneer a professional, disciplined, and safety-certified motorsports culture. BMCA bridges the gap between grassroots off-road passion and international competitive standards. It is simultaneously:
1. **A Competitive Racing Team:** Flying the BMCA crest in regional and national championship track trials.
2. **A Certified Training Academy:** Offering structured, stepped coaching from foundational motorcycle control to pro gate-drops and high-speed racecraft.
3. **A Safety Authority:** Enforcing non-negotiable personal protective armor and track marshaling standards across all events.

### 1.2 Core Pillars
1. **Certified Track Safety (Zero Compromise):** Mandatory DOT/ECE helmets, chest/roost armor, knee braces, motocross boots, and trained corner flag marshals. Motorsports is an athletic discipline, not reckless stunting.
2. **Technical Coaching Credentials:** Head coach and mentor accreditation through verified international programs (e.g., TWM Academy of Moto Adventure, Kolkata, India).
3. **Structured Progression:** 4-stage pedagogical academy curriculum moving from body posture and clutch control to ruts, berms, tabletop jumps, and gate starts.
4. **Mechanical Competency:** Educating riders on motorcycle engineering, suspension sag tuning, tire pressures, and trackside maintenance in partnership with certified service facilities.
5. **Grassroots Inclusivity:** Welcoming trainees from age 12 (Junior Division) to adult open-class competitors, maintaining an academy training fleet so riders without machines can train.

### 1.3 Key Audiences & User Jobs
| Audience | Core Job & User Need | Primary Conversion Trigger |
| :--- | :--- | :--- |
| **Prospective Trainees & Guardians** | Need assurance of safety, logistics clarity (bikes provided vs. bring own, armor requirements, fees, location). | Direct WhatsApp Consultation (`+8801975376114`) & Academy Enrollment Form |
| **Championship Racers & Competitors** | Need verified race calendar, trial entry requirements, track surface details, and machine class rules. | Race Fixture Calendar & Event Entry Dispatch |
| **Sponsors & Technical Partners** | Need proof of professional operations, audience engagement, paddock exposure, and mechanical credibility. | Sponsor Dossiers & Partnership Inquiry Channels |
| **Motorsports Spectators & Fans** | Want authentic photos, race recaps, lap times, rider profiles, and video footage. | Rider Roster Dossiers & Filterable Media Gallery |

---

## 2. Voice, Tone & Messaging Rules

### 2.1 Brand Voice Attributes
- **Authoritative & Disciplined:** Speak like seasoned motorsport paddock directors and certified track marshals. Prioritize precision, physical fitness, and procedural rigor.
- **High-Octane & Dynamic:** Capture the visceral adrenaline of four-stroke dirt bike engines, roosting clay ruts, and gate drops without tipping into juvenile recklessness.
- **Supportive & Mentorship-Driven:** Encourage grassroots enthusiasts to take their passion off public streets and onto sanctioned, controlled dirt circuits.
- **Authentic & Grounded:** Root all copy in real Bangladeshi locations (Chittagong Dirt Arena, Feni, Rajshahi, Comilla, Jessore) and actual rider machines.

### 2.2 Do's and Don'ts for AI Agents

| ❌ STRICTLY FORBIDDEN | ✅ MANDATORY BMCA STANDARD |
| :--- | :--- |
| **Generic SaaS Jargon:** "Empowering seamless off-road synergies with next-gen solutions." | **Domain Precision:** "Structured throttle modulation, apex braking, and rhythm whoops on loam circuits." |
| **Street Stunting & Reckless Imagery:** Mentions of public road wheelies, racing in traffic, or riding without gear. | **Sanctioned Racing Only:** Emphasize closed tracks, flag marshals, and mandatory protective gear. |
| **Unquantifiable Vanity Metrics:** "100% Safety Guaranteed" (motocross inherently carries risk). | **Certified Operational Standards:** "Mandatory DOT/ECE-certified helmets, chest armor, and medical standby." |
| **Emoji-Stuffed Headings:** Cluttering production headers with `⚡🔥🚀🏆💬🏁`. | **Clean, High-Impact Typographic Hierarchy:** Use clean badges and semantic icons sparingly. |
| **Vague Headshots:** Listing racers like corporate executives ("Manager of Operations"). | **Motocross Dossiers:** Always include Race Number (#), Class, Machine Model, Origin, and Landmark Result. |
| **Broken WhatsApp Popups:** Triggering `window.open` inside asynchronous timers that browser popup blockers swallow. | **Direct Synchronous Dispatch:** Use clean, validated direct WhatsApp URLs and phone actions. |

---

## 3. Visual Identity & Design System Tokens

BMCA uses a high-performance, dark motorsports aesthetic inspired by factory racing paddocks (KTM, Monster Energy Pro Circuit, Honda HRC).

### 3.1 Color Palette & CSS Variables

```css
:root {
  /* ==========================================================================
     DARK CANVAS & PADDOCK OBSIDIAN SURFACES
     ========================================================================== */
  --bg-deep: #07090c;         /* Deep canvas foundation / Page background */
  --bg-primary: #0d1117;      /* Primary section background alternation */
  --bg-surface: #141a23;      /* Elevated panels, forms, and containers */
  --bg-card: #18202c;         /* Interactive cards, dossiers, table rows */
  --bg-card-hover: #1f2a3a;   /* Card hover state */
  --bg-glass: rgba(13, 17, 23, 0.85); /* Glassmorphism navigation bar */

  /* ==========================================================================
     MOTORSPORT ACCENT PALETTE
     ========================================================================== */
  /* Racing Red: Primary brand energy, urgent actions, podium heat */
  --red-racing: #e11d48;      /* Primary brand accent / Main CTA button */
  --red-bright: #ff2b56;      /* Hover states, focus rings, active indicators */
  --red-deep: #9f1239;        /* Gradients, subtle card borders */
  --red-glow: rgba(225, 29, 72, 0.35); /* Ambient paddock backlights */

  /* Track Green: Safety clearance, live race alerts, direct WhatsApp channel */
  --green-track: #22c55e;     /* WhatsApp buttons, verified status, green flags */
  --green-glow: rgba(34, 197, 94, 0.3);

  /* Trophy Gold / Amber: Accreditations, championship trophies, mentors */
  --yellow-trophy: #f59e0b;   /* Trophy badges, mentor accreditation, lap times */
  --yellow-glow: rgba(245, 158, 11, 0.35);

  /* ==========================================================================
     TYPOGRAPHY & ACCESSIBILITY CONTRAST (WCAG AA COMPLIANT)
     ========================================================================== */
  --text-main: #f8fafc;       /* Highest contrast: Titles, headings, primary values */
  --text-muted: #cbd5e1;      /* Secondary reading: Body paragraphs, descriptions */
  --text-dim: #94a3b8;        /* Minimum 4.5:1 ratio on #07090c for meta & dates */

  /* ==========================================================================
     BORDERS & ELEVATIONS
     ========================================================================== */
  --border-subtle: rgba(255, 255, 255, 0.08); /* Card separation */
  --border-card: rgba(255, 255, 255, 0.12);   /* Default container outline */
  --border-hover: rgba(225, 29, 72, 0.45);    /* Active card highlight */

  /* ==========================================================================
     SPACING & RADII
     ========================================================================== */
  --radius-sm: 6px;           /* Tags, badges, small buttons */
  --radius-md: 12px;          /* Cards, modals, form inputs */
  --radius-lg: 18px;          /* Featured banners, hero enclosures */
  --container-max: 1200px;    /* Max readable content width */
  --nav-height: 76px;         /* Fixed sticky navbar height */
}
```

### 3.2 Typography Stack

BMCA pairs high-impact motorsport display typography with a modern, highly legible sans-serif for UI and body text:

| Role | Font Family | Weights | Text Transform | Ideal Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Numbers** | `'Teko', impact, sans-serif` | 500, 600, 700 | Uppercase | Big countdown timers, racing numbers (#99, #07), lap times, hero callouts |
| **Headings & Badges** | `'Barlow Semi Condensed', sans-serif` | 600, 700, 800 | Uppercase | Section titles, card headings, navigation links, eyebrow tags |
| **Body & Forms** | `'Plus Jakarta Sans', sans-serif` | 400, 500, 600, 700 | Normal | Paragraphs, curriculum breakdowns, form labels, machine specifications |

**Google Fonts Import:**
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700;1,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Teko:wght@500;600;700&display=swap">
```

### 3.3 Visual Motifs & Paddock Textures
- **Ambient Glows:** Soft circular radial gradients in `--red-racing` and `--green-track` blurred with `filter: blur(120px)` behind hero sections.
- **Racing Grid Matrix:** Subtle 32px semi-transparent checkered grid lines (`rgba(255, 255, 255, 0.03)`) providing structural depth.
- **Number Plates:** Dedicated racing badges displaying `#99`, `#07`, `#05`, `#77` styled with italic slant (`transform: skewX(-8deg)`) and high-contrast borders.
- **Focus States:** Every interactive link, button, and input must feature a high-contrast focus ring:
  ```css
  :focus-visible {
    outline: 2px solid var(--red-bright);
    outline-offset: 3px;
  }
  ```

---

## 4. Entity Directory & Domain Knowledge

AI agents drafting copy, creating pages, or querying data must use these exact verified entities:

### 4.1 Club Leadership & Active Athletes

#### 1. Md. Mahabubur Rahman Hafiz (`MR99`)
- **Official Title:** Director & Pro Track Champion
- **Racing Code / Number Plate:** `MR99` / `#99`
- **Competition Machine:** Honda CRF250R (Pro 250cc 4-Stroke)
- **Hometown / Origin:** Chittagong, Bangladesh
- **Key Accolades:** Champion of Curves 2025; Executive Director of BMCA Academy; Founder of Chittagong Dirt Arena.
- **Quote:** *"Motocross in Bangladesh must not be an uncontrolled thrill. It is an Olympic-caliber discipline requiring exceptional physical stamina, motorcycle mechanical knowledge, and track safety rigor."*

#### 2. Salauddin Ahmed Bulbul (`Baundal Bulbul #07`)
- **Official Title:** Official Mentor & Head of Training
- **Racing Code / Number Plate:** `Baundal Bulbul #07` / `#07`
- **Competition Machine:** Yamaha YZ250F (Enduro 250cc)
- **Accreditation:** Certified 6-Month Enduro/Motocross Training at **TWM Academy of Moto Adventure (Kolkata, India)**.
- **Hometown / Origin:** Narsingdi, Bangladesh
- **Key Accolades:** SR Dirt Fest India (4th place); Certified Youth Coach & Track Marshall.
- **Role in Academy:** Leads the 4-Stage Progressive Curriculum, riding posture analysis, and gate-drop coaching.

#### 3. Sharif ON Track (`#05`)
- **Official Title:** Pro Track Racer
- **Racing Code / Number Plate:** `Sharif ON Track #05` / `#05`
- **Competition Machine:** Suzuki RM-Z250 (Pro 250cc)
- **Hometown / Origin:** Chittagong, Bangladesh
- **Key Accolades:** Suzuki Off-Road 2026 (2nd place); Regional Chittagong Track Trialist.

#### 4. Sultan Sheikh (`#77`)
- **Official Title:** Pro Category Racer
- **Racing Code / Number Plate:** `Sultan Sheikh #77` / `#77`
- **Competition Machine:** KTM 250 SX-F (Open Class)
- **Hometown / Origin:** Bangladesh
- **Key Accolades:** Moto Madness S2 (1st Runner-Up); Specialist in rhythm sections and tabletop jumps.

---

### 4.2 Official Sponsors & Technical Partners

1. **DCS (Official Sponsor):**
   - **Role:** Premier commercial sponsor backing BMCA championship entries, rider jerseys, and training track trials.
   - **Official Channel:** [DCS Facebook Page](https://www.facebook.com/share/14vhacSQqj9/)
2. **Moto Freak Lab (Official Service Partner):**
   - **Role:** Precision race workshop specializing in suspension re-valving, dirt bike carburetor/EFI tuning, off-road diagnostics, and trackside pit support.
   - **Official Channel:** [Moto Freak Lab Facebook Page](https://www.facebook.com/share/1DzcBwjjfJ/)

---

### 4.3 Academy Curriculum & Training Logistics

#### 4-Stage Progression Matrix
- **Stage 01: Bike Control & Body Stance** — Center of gravity balance, standing pegs posture, throttle modulation, clutch biting-point friction zone, and balance recovery.
- **Stage 02: Cornering, Berms & Rut Traversal** — Apex braking, counter-steering, leg-out positioning, locking into deep dirt ruts, and carrying momentum through high-banked berms.
- **Stage 03: Jumping & Suspension Pre-load** — Approach velocity, suspension compression on takeoff faces, flight attitude correction (rear brake tap & throttle tap), tabletop absorption, and smooth landings.
- **Stage 04: Gate Starts & Racecraft** — Holeshot launch posture, 30-second gate board drop reaction, inside-line defense, overtaking etiquette, and adherence to track safety flags.

#### Academy Logistics Checklist
- **Motorcycle Availability:** BMCA maintains a dedicated fleet of 150cc–250cc training dirt bikes for enrolled students. Trainees who own personal dirt bikes or dual-sport machines are encouraged to bring them for custom suspension sag setup.
- **Required Gear:** Mandatory full-face DOT/ECE helmet, protective goggles, roost/chest deflector, knee/shin guards, elbow pads, and motocross boots. Sanitized loaner safety kits are available for beginner trial sessions.
- **Eligibility:** Junior Division (Ages 12–17 with parental consent); Senior Division (Ages 18+). Basic manual motorcycle clutch experience is recommended.
- **Venue:** Chittagong Dirt Arena (natural red clay & loam terrain with banked berms and elevated jumps).

---

### 4.4 Official Contact & Dispatch Channels

| Channel | Endpoint / Value | Primary Role |
| :--- | :--- | :--- |
| **Direct Phone & WhatsApp** | `+880 1975-376114` (`01975376114`) | Immediate enrollment inquiries, rider admissions, and track visits |
| **Official Email** | `bangladeshmotocrossclubacademy@gmail.com` | Formal sponsorship, media inquiries, race entries |
| **Official Facebook** | [BMCA Facebook Page](https://www.facebook.com/share/1J7fKtW8wE/) | Race day live streams, community announcements, photos |
| **Official YouTube** | [@bangladeshmotocrossclubacademy](https://youtube.com/@bangladeshmotocrossclubacademy?si=N-alBRnOj76ZNnTn) | HD race recaps, training drills, rider interviews |
| **Paddock Location** | Chittagong, Bangladesh | Headquarters & Dirt Training Arena |

---

## 5. UI/UX Component Specifications

For developers and agents authoring or modifying HTML/CSS/JS components:

### 5.1 Call-to-Action (CTA) Hierarchy
To prevent user cognitive fatigue and conversion scatter:
1. **Primary Conversion Action (`.btn-primary`):** 
   - Solid `--red-racing` background, white bold uppercase text, 6px border-radius, red glow on hover.
   - Reserved for the main conversion goal on a surface (e.g., *"Enroll in Academy"*).
2. **Action / WhatsApp Channel (`.btn-green` or `.btn-whatsapp`):**
   - Solid `--green-track` background with WhatsApp messaging integration.
   - Used for direct communication and instant coach inquiry.
3. **Secondary / Outline Action (`.btn-outline`):**
   - Transparent background, `--border-card` outline, hover transition to `--bg-card-hover`.
   - Used for secondary discovery (e.g., *"Race Fixtures"*, *"View Dossier"*).
4. **Hero Rule:** Never place more than two action buttons in a hero row. Never use three competing bright colors side-by-side.

### 5.2 Racer Profile Cards & Dossiers
Every racer card in the paddock roster must display:
1. **Slanted Number Badge:** e.g., `#99`, `#07`, `#05`, `#77`.
2. **Category / Role Badge:** `Director / Champion`, `Official Mentor`, `Pro Track`, `Pro Open`.
3. **Machine Spec:** Make, Model, Displacement & Class (e.g., `Honda CRF250R • Pro 250cc`).
4. **Key Stats List:** Racing Code, Origin, and Latest Win / Accreditation.
5. **Action:** Single clear trigger to view career stats or full dossier.

### 5.3 Next Race Countdown Banner
A countdown timer must never be passive. It must include:
- Official Race Name (e.g., `FENI TRACK TRIAL`).
- Date & Location (e.g., `15 November 2026 • Feni Dirt Circuit`).
- Dynamic Ticking Counter (Days, Hours, Minutes, Seconds).
- **Direct Entry CTA Button:** High-contrast button linking directly to the entry form or WhatsApp coordinator with pre-filled event context.

### 5.4 WhatsApp Form Integration Architecture
To prevent mobile WebKit (iOS Safari) and Chrome popup blockers from silently dropping inquiries:
- **Do NOT** call `window.open` inside an asynchronous `setTimeout`.
- **Do:** Perform immediate synchronous dispatch:
  ```javascript
  const waUrl = `https://wa.me/8801975376114?text=${encodeURIComponent(message)}`;
  window.location.href = waUrl;
  ```
- Keep the user's form input preserved until the action is confirmed.

---

## 6. Architecture & File Structure Conventions

The repository follows a clean, static, high-performance architecture:

```
.
├── .github/workflows/
│   └── deploy.yml              # Automated GitHub Pages CI/CD workflow
├── builder/                    # Specifications, research, and agent handoffs
│   ├── dev_agent_handoffs/     # UI audits, finish-gate reports
│   ├── marketing/              # Domain comparisons, audience research
│   └── brand-identity.md       # Mirror copy of this brand identity spec
├── website/                    # Production web platform root
│   ├── css/
│   │   └── styles.css          # Design system variables, layout, components
│   ├── js/
│   │   └── main.js             # Navigation, countdown, lightbox, forms
│   ├── images/                 # Optimized web assets (logos, riders, tracks)
│   ├── racers/                 # Dedicated racer profile HTML files
│   │   ├── mahabubur-rahman-hafiz.html
│   │   ├── sharif-on-track.html
│   │   └── sultan-sheikh.html
│   ├── mentors/                # Dedicated mentor accreditation files
│   │   └── salauddin-ahmed-bulbul.html
│   ├── gallery.html            # Media gallery surface
│   └── index.html              # Main flagship single-page hub
├── BRAND_IDENTITY.md           # Authoritative Brand Identity Document (Root SSOT)
└── README.md                   # Repository overview & setup instructions
```

---

## 7. Quality Checklist for Collaborating Agents

Before completing any task on BMCA, verify your work against this checklist:

- [ ] **Brand Consistency:** Did you use official colors (`--red-racing: #e11d48`, `--green-track: #22c55e`, `--bg-deep: #07090c`)?
- [ ] **Contrast Compliance:** Is all secondary text at least `#94a3b8` (minimum 4.5:1 WCAG AA contrast ratio on dark backgrounds)?
- [ ] **Domain Accuracy:** Are rider names, race numbers, motorcycle models, and sponsor names spelled exactly as defined in Section 4?
- [ ] **Mobile Responsiveness:** Does the UI function flawlessly on 390px mobile viewports (sticky navigation, responsive form inputs, zero horizontal scroll)?
- [ ] **No Emoji Litter:** Did you avoid random decorative emojis in production headings and action buttons?
- [ ] **Reliable Conversion:** Does the registration/contact funnel open WhatsApp (`+8801975376114`) directly without popup blockers?
- [ ] **Documentation Sync:** If you altered a design token or added an official racer/sponsor, did you update this `BRAND_IDENTITY.md` file?

---

*Authored by ArchitectUX Agent for Bangladesh Motocross Club & Academy (BMCA).*  
*Approved for all autonomous agent workflows.*
