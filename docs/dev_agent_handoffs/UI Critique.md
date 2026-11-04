# UI Finish-Gate Review: Bangladesh Motocross Club & Academy (BMCA)

**Target Codebase:** `website/`  
**Primary Surfaces:** `index.html`, `css/styles.css`, `js/main.js`, `gallery.html`, `racers/`, `mentors/`  
**Date:** 2026-11-04 (Follow-up Audit v2)  
**Reviewer:** UI Finish-Gate Reviewer Agent  
**Previous Gate:** HOLD (v0.1)  
**Current Gate:** **PASS** (v0.1.4)  

---

## 1. Product Lens

### The Core Job
Bangladesh Motocross Club & Academy (BMCA) is a sanctioned racing organization and athlete development academy based out of the Chittagong Dirt Arena. The platform serves two primary user funnels:
1. **Prospective Riders & Guardians (Conversion):** Evaluating safety credibility, equipment requirements, and admissions logistics. Their primary blockers were practical: *Do I need my own dirt bike? What safety gear is required? Is off-road motocross safe for my child compared to street stunting?*
2. **Competitors & Regional Spectators (Race Coordination):** Tracking sanctioned 2026–2027 race trials (e.g., Feni Track Trial on 15 November 2026), verifying rider appointments, and registering machines into sanctioned classes.

### Operational Context
Motocross is an extreme, high-risk sport where institutional legitimacy depends on tangible proof: FIM/DOT safety gear compliance, formal coach accreditation (TWM Academy Kolkata certification), and closed-circuit track marshaling. With over 80% mobile traffic in Bangladesh, the interface must deliver instantaneous, friction-free WhatsApp communication without popup interference or cognitive friction.

---

## 2. Comparable Evidence & Benchmarks

1. **AMA Pro Motocross & MXGP Paddock Standards:**
   - *Pattern:* Prominent racing bib numbers, sanctioned category classification, and explicit motorcycle machine specs (Make, Model, 4-stroke displacement) alongside verified podium records.
   - *Implementation:* Applied across the BMCA roster (`Honda CRF250R`, `Yamaha YZ250F`, `Suzuki RM-Z250`, `KTM 250 SX-F`).
2. **Millsaps Training Facility (MTF) & California Motocross School:**
   - *Pattern:* Transparent equipment prerequisites and tiered enrollment packages distinguishing "Arrive & Ride" fleet trainees from private bike owners.
   - *Implementation:* Implemented via the 3-Tier Academy Admissions matrix (`Weekend Starter Clinic`, `Monthly Academy Cadet`, `Open Paddock Pass`).
3. **FIM & Red Bull KTM Safety Protocol Portals:**
   - *Pattern:* Clear parental reassurance framing closed-track motocross as a disciplined athletic sport with mandatory protective armor and corner flag marshals.
   - *Implementation:* Established through the dedicated **Guardians' & Parents' Safety Hub** with FIM flag definitions, cadet low-speed throttle governors, and on-site medical trauma standby.
4. **MXGP Race Weekend Alert System:**
   - *Pattern:* Countdown banners directly coupled with one-click competitor entry.
   - *Implementation:* Actionable `.race-alert-action` button linking directly to calendar registration.

---

## 3. Design Contract

```markdown
# BMCA Web Platform Design Contract — v2 (Verified)

**User + job:** Aspiring riders enrolling in safe motocross training + racers entering 2026 track trials.
**First-read object:** Live Lal Mai trial video reel HUD + Chittagong track operations + Feni Track Trial countdown.
**Primary action:** Direct WhatsApp registration consultation (+8801975376114) with pre-filled package context.
**Density decision:** High data density for technical track specifications, racer credentials, and 3-tier packages; clean breathing room for video playback.
**Hierarchy:** 
  1. Sticky navigation with persistent "Enroll in Academy" CTA across all viewport widths.
  2. Hero split: Clear value proposition on left + interactive Lal Mai video reel with chapter navigation on right.
  3. Actionable next race countdown banner with direct registration button.
  4. Operational track specifications (circuits, fleet bikes, marshaling).
  5. Executive Director's paddock briefing (MR99).
  6. Official Racer & Mentor Roster featuring machine specs and contract proof.
  7. Dedicated Academy Logistics Matrix + 3-Tier Admissions Packages.
  8. Guardians' Safety Hub (flag discipline, throttle stops, medical standby).
  9. Filterable 2026–2027 calendar fixtures.
  10. Interactive registration form with equipment status selector.
**Interaction model:** Single-page conversion hub with anchor navigation, video chapter seeking, modal dossiers, photo lightbox, and synchronous mobile WhatsApp dispatch.
**Responsive priority:** 390px mobile viewport maintains single-column flow, native keyboard safety, sticky navigation CTA, and zero popup blocking.
**Forbidden defaults:**
  - Generic SaaS-style 3-card emoji feature grids.
  - Fake vanity metrics ("100% Safety").
  - Unactionable countdown tickers.
  - Asynchronous popup-blocked mobile redirects.
**Finish evidence:** Mobile (390px) & Desktop (1440px) viewport verification, WCAG AA compliance (`--text-dim: #94a3b8`, `--text-muted: #cbd5e1`), synchronous mobile dispatch, and verified appointment letter artifacts.
```

---

## 4. Implementation Review & Resolution of Previous HOLD Items

### 4.1 Product Legibility & First Viewport
- **Hero CTA Consolidation:** The previous 3 competing buttons with conflicting accent colors were replaced by a clean, 2-tier hierarchy: primary `Enroll in Academy` (`.btn-primary`) and secondary `2026–2027 Race Fixtures` (`.btn-secondary`). Unicode decorative emojis (`⚡`, `🏁`, `💬`) were removed from buttons.
- **Operational Video Showcase:** The static hero backdrop was replaced with an interactive video showcase playing real Lal Mai trial race footage (`bmca_short.mp4`), featuring HUD play/pause, sound toggle, progress scrubber, and 5 interactive chapter pills (`Staging & Launch`, `Lal Mai Dirt Circuit`, `Furious Berm Cornering`, `High-Speed Dirt Run`, `Paddock Sprint`).
- **Credible Metrics:** Generic placeholder metric (`"100% Safety"`) was replaced with `"DOT / ECE Certified Gear Protocol"` and `"4-Stage Curriculum Track"`.

### 4.2 Hierarchy & Alert Bar Usability
- **Actionable Countdown Banner:** The alert banner for the Feni Track Trial (15 Nov 2026) now includes a prominent, direct action button (`Register for Feni Trial`) linking directly to the fixture entry flow.
- **Roster & Director De-duplication:** The director section was repositioned as the executive *Director's Paddock Briefing*, eliminating redundant stat chips, while MR99's roster card now focuses on his machine specs (`Honda CRF250R • Pro 250cc`) and single primary dossier action.

### 4.3 Domain Specificity & Academy Architecture
- **Operational Track Specs:** Replaced generic marketing pillars with authentic motorsports infrastructure details: *Sanctioned Racing Circuits* (loam and red clay, 150cc–450cc), *Dedicated Training Fleet* (fleet machines provided or bring personal bike), and *Strict Trackside Marshaling*.
- **Fleet Logistics Matrix:** Added the 4-card *Academy Prerequisites & Logistics Matrix*, explicitly detailing:
  1. *Bike Fleet & Ownership:* BMCA fleet 150cc–250cc bikes provided; trainees owning bikes welcome.
  2. *Mandatory Safety Armor:* Full-face DOT/ECE helmets, roost guards, knee armor, and boots compulsory.
  3. *Age & Experience:* Junior Division (12–17) and Senior Division (18+); beginners welcome.
  4. *Chittagong Dirt Arena:* Loam/clay circuit topography with paddock shade and wash bays.
- **3-Tier Transparent Admissions Packages:**
  1. *Weekend Starter Clinic:* Turnkey arrive-and-ride package with fleet motorcycle and sanitized armor.
  2. *Monthly Academy Cadet:* 4-week progressive curriculum for Junior & Senior athletes.
  3. *Open Paddock Pass:* Practice access and suspension sag tuning by Moto Freak Lab for personal bike owners.
- **Guardians' & Parents' Safety Hub:**
  - Clear brand positioning: *"Leave the stunts off the streets. Bring your courage to the dirt."*
  - 4-pillar safety dossier: Mandatory Personal Armor, FIM Flag Marshaling (Yellow, Red, Chequered), Low-Speed Throttle Stops for Cadets, and On-Site First-Aid Trauma Standby.

### 4.4 Racer Dossiers & Primary Verification
- **Machine Specifications:** All roster cards and profile pages now feature verified motorcycle make, model, and class:
  - *MR99:* Honda CRF250R • Pro Track 250cc
  - *Baundal Bulbul (#07):* Yamaha YZ250F • Enduro 250cc
  - *Sharif ON Track (#05):* Suzuki RM-Z250 • Pro Track 250cc
  - *Sultan Sheikh (#77):* KTM 250 SX-F • Pro Open Category
- **Contract & Appointment Artifacts:** Added verified primary source imagery:
  - Sharif ON Track's official 2-year BMCA appointment letter and contract signing ceremony.
  - Sultan Sheikh's appointment letter and leadership delegation handover ceremony.
  - FBR CampFest 2025 podium trophy and cash prize verification.
  - Suzuki Off-Road Championship congratulations poster.
- **Cognitive Action Cleanup:** Card buttons standardized on single `Career Dossier` modal trigger + subtle permalink link (`Full Profile Page →`).

### 4.5 Interaction States & Mobile Dispatch
- **Popup-Safe WhatsApp Integration:** In `js/main.js`, asynchronous `setTimeout` dispatch was eliminated. Mobile devices execute synchronous navigation (`window.location.href = waUrl`) to bypass WebKit/Blink popup blockers and trigger native WhatsApp immediately. Desktop attempts new tab opening with fallback.
- **Preserved Form State:** Added fallback click link in status text; form data is not cleared on blocked submissions.
- **Interactive Equipment Selector:** Added radio card options (`[Need Fleet Bike & Armor]` vs `[Bringing Own Motorcycle]`) ensuring inquiries arrive at coaches with equipment context pre-selected.
- **Accessibility & Focus Trapping:** Implemented keyboard focus trapping and Escape-key handling in modal dialogs.
- **Mobile Navigation CTA:** Restored persistent `.nav-mobile-cta` in the mobile drawer, ensuring mobile users always have a conversion path.

### 4.6 Code Hygiene & Standards Compliance
- **Asset Cleanup:** Removed root duplicate images (`website/*.jpg`) and deleted orphaned `website/racers/baundal-bulbul.html`.
- **WCAG AA Contrast:** Corrected `--text-dim` from `#64748b` to `#94a3b8` and `--text-muted` to `#cbd5e1`, achieving passing contrast ratios (> 4.5:1) against dark backgrounds.
- **Visual Polish:** Removed unicode emoji clutter from primary buttons and headers, elevating brand credibility.

---

## 5. UI Finish Gate: PASS

```markdown
# UI Finish Gate — Bangladesh Motocross Club & Academy (BMCA Web Platform)

## Decision: PASS

## Summary
All 7 blocking requirements from the v0.1 Finish-Gate audit have been systematically engineered, verified, and tested across desktop and mobile viewports. The platform has transitioned from a generic landing page into an authoritative, evidence-backed motorsports destination.

## Verified Implementation Details
1. [Hero Clarity] — Unambiguous 2-button hierarchy paired with authentic Lal Mai trial video reel HUD.
2. [Actionable Alert Bar] — Feni Track Trial countdown is anchored by an immediate registration action.
3. [Fleet & Logistics Proof] — Clear answers provided on motorcycle fleet availability, gear, and age limits.
4. [3-Tier Academy Packages] — Transparent enrollment options for beginners, cadets, and paddock practice.
5. [Guardians' Safety Hub] — Direct anti-street-stunting positioning backed by FIM flag rules, throttle stops, and trauma standby.
6. [Machine Specs & Contracts] — Roster cards display engine specs (CRF250R, YZ250F, RM-Z250, 250 SX-F) and link to verified scanned contracts.
7. [Mobile Reliability] — Synchronous WhatsApp dispatch eliminating popup-blocker failure modes; full WCAG AA contrast compliance.

## Operational Recommendations for Production Launch
- Monitor CDN/hosting bandwidth for `bmca_short.mp4` and `bmca-srimongol-trail-run.mp4` on GitHub Pages; ensure poster images continue to serve as graceful fallbacks on low-speed 3G connections.
- Track incoming WhatsApp query payloads to optimize coaching consultation response times.
```
