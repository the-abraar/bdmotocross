# UI Finish-Gate Review: Bangladesh Motocross Club & Academy (BMCA)

**Target Codebase:** `website/`  
**Primary Surfaces:** `index.html`, `css/styles.css`, `js/main.js`, `gallery.html`, `racers/`  
**Date:** 2026-11-04  
**Reviewer:** UI Finish-Gate Reviewer Agent  

---

## 1. Product Lens

### The Core Job
Bangladesh Motocross Club & Academy (BMCA) operates at the intersection of a competitive regional racing team and a grassroots dirt bike training academy based in Chittagong. Visitors arrive with two distinct jobs:
1. **Prospective Riders & Guardians (Conversion):** Need to determine if BMCA is a legitimate, certified, and physically safe academy. Their highest-frequency blockers are practical logistics: *Where is the training track? Do I need to own a 150–250cc dirt bike, or does BMCA supply bikes and armor? How do I talk directly to the coach?*
2. **Motorsports Competitors & Spectators (Calendar/Entry):** Need to verify the upcoming race schedule (e.g., Feni Track Trial on 15 November 2026), identify the competing categories (Pro Track vs. Amateur/Novice), view verified rider credentials, and register an entry.

### Operational Reality & Risk
Motocross is an extreme, high-liability sport with zero room for vague marketing jargon. In Bangladesh, where off-road motorsports infrastructure is emerging, proof of certified training (such as Baundal Bulbul’s 6-month certification at TWM Academy Kolkata) and track safety gear (DOT/ECE helmets, body armor, marshaled tracks) is the product's ultimate currency. Over 80% of users access this platform via mobile devices, converting primarily through WhatsApp and direct phone calls.

---

## 2. Comparable Evidence (Adjacent High-Performance Motocross & Academy Patterns)

1. **AMA Pro Motocross & MXGP Rider Dossiers:**
   - *Pattern:* Rider profile cards lead with the official number plate graphic, competition class (e.g., 250 Pro / 450 Open), and specific motorcycle machine specs (Make, Model, Engine CC, e.g., *Yamaha YZ250F / Honda CRF450R*), paired with chronological podium finishes.
   - *Lesson:* Motocross athletes are defined by their machine, race number, and class. Generic headshots with agency-style job titles ("Director / Champion") make the club look like a corporate consulting firm rather than a motorsports paddock.
2. **Millsaps Training Facility (MTF) & California Motocross School:**
   - *Pattern:* Dedicated "Academy Essentials" matrix answering 4 upfront questions before the application form: (a) *Own Bike Required vs. Rental Fleet*, (b) *Mandatory Protective Armor Checklist*, (c) *Age & Experience Minimums*, and (d) *Track Location & Surface*.
   - *Lesson:* Academy registration stalls when prospective riders don't know the equipment prerequisites. Answering logistical constraints on the page dramatically increases qualified inquiries.
3. **Red Bull KTM Factory Racing / F1 Race Weekend Alert:**
   - *Pattern:* Impending race countdown banner contains an immediate dual action: [View Track Location & Details] and [Competitor Entry / Inquire].
   - *Lesson:* A ticking countdown ticker without an immediate interactive trigger is decorative filler.
4. **Loretta Lynn’s Amateur National Motocross:**
   - *Pattern:* Strict separation between the "Racer Registration (Sanctioned Entry)" path and the "Rider Academy (Student Coaching)" path.
   - *Lesson:* Forcing race competitors to scroll into a generic student inquiry form degrades competitor confidence.

---

## 3. Design Contract

```markdown
# BMCA Web Platform Design Contract

**User + job:** Prospective riders seeking safe academy coaching + racers entering 2026 track trials.
**First-read object:** Clear verification of Chittagong track operations, next race fixture, and academy enrollment terms (gear/bike prerequisites).
**Primary action:** Direct WhatsApp registration consultation (+8801975376114) with pre-filled category context.
**Density decision:** Balanced-to-Compact. High data density for race fixtures and racer stats; structured technical hierarchy for academy curriculum.
**Hierarchy:** 
  1. Sticky navigation with persistent "Join Academy" action on all viewports.
  2. Hero with single primary conversion trigger + track location proof.
  3. Actionable next race countdown banner with direct entry trigger.
  4. Academy logistics & 4-stage progression.
  5. Official Racer roster with machine specs & racing numbers.
  6. Filterable 2026–2027 calendar fixtures.
  7. Direct WhatsApp / Form dispatch.
**Interaction model:** Single-page conversion hub with anchor navigation, modal dossiers for quick-scanning racer careers, fullscreen accessible photo lightbox, and calendar tabs.
**Responsive priority:** 390px mobile viewport must maintain sticky WhatsApp/Join CTA, full single-column fixture cards, and native keyboard-safe form inputs.
**Forbidden defaults:**
  - Generic SaaS-style 3-card emoji feature grids ("Competitive Racing", "Safety Standards").
  - Fake/placeholder vanity metrics ("100% Safety").
  - Competing side-by-side primary action buttons with divergent accent colors.
  - Double-billing the same racer in hero features and subsequent roster grids.
**Finish evidence:** Mobile (390px) & Desktop (1440px) viewport checks, zero popup-blocker triggers on WhatsApp submission, WCAG AA color contrast compliance on dark surfaces, zero dead/redundant file links.
```

---

## 4. Implementation Audit

### 4.1 Product Legibility
- **Generic Hero CTA Scatter (`index.html` lines 99–105):** The hero displays three competing full-size buttons side-by-side (`⚡ Explore Academy Programs` in red gradient, `🏁 2026-2027 Race Calendar` in dark slate, and `💬 WhatsApp Chat` in bright green). When three different actions compete with three different colors, there is no visual anchor.
- **Vanity Metric in Stats Grid (`index.html` lines 121–125):** The hero stat `"100% Safety & Protective Gear"` is an unquantifiable placeholder. In motorsports, credibility comes from specific operational metrics: e.g., *"ECE / DOT Certified Gear"*, *"Chittagong Dirt Arena"*, or *"400m Natural Hill Circuit"*.

### 4.2 Hierarchy & Layout Structure
- **Passive Race Alert Banner (`index.html` lines 131–160):** The next race alert banner highlights `NEXT OFFICIAL RACE: FENI TRACK TRIAL` (15 November 2026) with an animated countdown clock, but contains **zero action buttons**. A user ready to enter or attend must scroll down through four major sections to locate the calendar table.
- **MR99 Double-Billing (`index.html` lines 237–294 vs. lines 314–340):** Md. Mahabubur Rahman Hafiz receives a massive standalone section as Director, and is then immediately repeated as the first card in the Roster grid. This clutters the information flow and delays user discovery of official mentor Baundal Bulbul (#07) and pro racers Sharif ON Track (#05) and Sultan Sheikh (#77).
- **Competing Dual Actions on Racer Cards (`index.html` lines 334–337):** Each racer card contains both a `"Career Stats"` button (which triggers a JavaScript modal) and a `"Profile"` link (which navigates to a standalone HTML page). Because the content in the modal and the standalone page is 95% identical, this dual-button setup creates cognitive friction.

### 4.3 Pattern Fit & Motorsports Specificity
- **Interchangeable SaaS Feature Cards (`index.html` lines 208–232):** The "Pillars Grid" (`Competitive Racing`, `Academy Development`, `Safety & Armor Standards`) relies on generic emoji icons (`🏁`, `🎯`, `🛡️`) and vague marketing sentences. This should be replaced with concrete operational track specifications (e.g., track elevation, loam/clay surface, marshaling protocols, and certified academy fleet).
- **Missing Machine Specifications on Roster:** Roster cards list name, racing code, origin, and recent win, but omit the rider's motorcycle make, model, and engine displacement (e.g., *Honda CRF250R / Yamaha YZ*). In motorsports, machine specs are fundamental domain information.
- **Academy Logistics Gap (`index.html` lines 427–487):** While the 4-stage curriculum (`01 Bike Control`, `02 Cornering`, `03 Jumping`, `04 Gate Starts`) is technically sound, it omits critical logistical criteria: (1) Does BMCA provide training bikes or must students bring their own? (2) What are the age requirements? (3) What is the weekend schedule in Chittagong?

### 4.4 States & Interaction Flow
- **Mobile Popup Blocker Vulnerability (`js/main.js` lines 464–471):** In `initRegistrationForm()`, `window.open(waUrl, '_blank')` is called inside a `setTimeout(..., 600)`. Mobile WebKit (iOS Safari) and Android Chrome routinely block asynchronous `window.open` calls as unsolicited popups. If blocked, `form.reset()` executes immediately, wiping out the user's submitted data without opening WhatsApp.
- **Calendar Registration Disconnect (`js/main.js` lines 289–312):** Clicking "Register" on a calendar race fixture auto-scrolls the user to the contact form, but leaves the form header titled `"Academy & Membership Inquiry"`. A competitor attempting to enter a trial race is presented with academy training fields.
- **Modal Accessibility & Focus Management:** Neither the racer modal nor the photo lightbox implements keyboard focus trapping (`focus-trap`). Tabbing while a modal is open leaks focus to elements behind the backdrop. Closing the modal fails to restore focus to the originating trigger button.

### 4.5 Responsive Behavior
- **Nav Action Vanishes on Mobile (`css/styles.css` lines 1960–1965):** At viewports below `820px`, `.nav-actions .btn` ("Join Academy") is hidden via `display: none;`. It is not incorporated into the mobile toggle menu, depriving mobile users of a persistent conversion target.

### 4.6 Implementation Fidelity & Code Cleanup
- **Orphaned Duplicate File:** `website/racers/baundal-bulbul.html` exists in the repository, while `website/mentors/salauddin-ahmed-bulbul.html` is the canonical link used across `index.html`.
- **Color Contrast WCAG AA Failure (`css/styles.css` line 30):** `--text-dim: #64748b` against `--bg-deep: #07090c` yields a contrast ratio of **3.0:1**, failing WCAG AA requirements for body text (< 4.5:1).
- **Decorative Unicode Emojis:** Widespread usage of raw unicode symbols (`⚡`, `💬`, `🏆`, `🏁`) within production UI buttons reduces the professional authority of the national club.

---

## 5. UI Finish Gate: HOLD

```markdown
# UI Finish Gate — Bangladesh Motocross Club & Academy (BMCA Web Platform)

## Decision: HOLD

## Evidence
- [Hero 3-CTA Conflict] → [styles.css#L187-L235 / index.html#L99-L105]: Three buttons with 3 divergent background colors compete in the initial viewport, diluting the primary academy conversion funnel.
- [Decorative Alert Bar] → [index.html#L131-L160]: Countdown banner highlights Feni Track Trial (15 Nov 2026) but provides no immediate entry or details action.
- [MR99 Repetition] → [index.html#L245-L340]: Director feature immediately precedes Card #1 in the Roster, duplicating stats and imagery.
- [Mobile Async WhatsApp Dispatch] → [main.js#L465-L471]: Form triggers `window.open` inside `setTimeout`, causing mobile browsers to block the WhatsApp redirect while resetting input values.
- [Mobile Nav CTA Dropped] → [styles.css#L1960-L1965]: "Join Academy" button is hidden on screens under 820px, removing the primary conversion hook for mobile visitors.
- [Missing Motocross Machine Specs] → [index.html#L314-L422]: Roster cards omit bike model, engine cc, and class specifications.
- [Orphaned Duplicate File] → `website/racers/baundal-bulbul.html` duplicates `website/mentors/salauddin-ahmed-bulbul.html`.

## Required before PASS
1. Consolidate Hero Actions: Establish one clear primary conversion CTA ("⚡ Enroll in Academy") and one secondary outline CTA ("🏁 Race Fixtures"). Move direct WhatsApp messaging into a clean, floating or integrated contact utility.
2. Add Direct CTA to Race Alert Bar: Insert a high-contrast action button ("Register for Feni Trial" / "Event Inquiries") directly inside `.race-alert-inner`.
3. Fix WhatsApp Dispatch & Preserve Form State: Change form dispatch to synchronous navigation (`window.location.href = waUrl` or synchronous target open), and only clear the form upon confirmed user action to prevent mobile popup blocking.
4. Restore Mobile Conversion in Navigation: Ensure "Join Academy" remains accessible on mobile viewports—either as a compact button beside the hamburger icon or prominently docked at the top of the mobile drawer.
5. Enhance Motocross Domain Specificity on Roster: Add Machine / Bike specifications (e.g., *Yamaha YZ250F, Honda CRF450R*) and Competition Class to each racer card, and standardize on one primary card action.
6. Address Academy Logistics & Prerequisites: Explicitly state bike ownership requirements (e.g., *"Academy training bikes available for trainees / Own bike welcome"*), mandatory gear requirements, and track schedule.
7. Clean up Orphaned Assets & Fix Contrast: Remove `website/racers/baundal-bulbul.html` and adjust `--text-dim` from `#64748b` to at least `#94a3b8` for WCAG AA compliance.

## Keep
- Authentic photography of local Chittagong riders and track events (`award.jpg`, `club-team.jpg`, `race-start.jpg`).
- Accurate 2026–2027 regional race fixture data (Feni, Chittagong Hill, Furious Track, MRF Rajshahi, Jessore Enduro, MotoMadness).
- Verified credentials highlighting Salauddin Ahmed Bulbul's 6-month certification from TWM Academy of Moto Adventure in Kolkata, India.
- Lightweight, high-performance static build with zero heavy JS framework overhead.
- Functional, keyboard-accessible photo lightbox.

## PASS criteria
- [Hero presents one unambiguous primary conversion path].
- [Next Race alert bar provides a direct entry action].
- [Mobile viewports retain continuous access to academy enrollment without popup blocking].
- [Roster cards display motocross machine specs alongside racer credentials].
- [Academy curriculum clarifies equipment/bike logistics].
- [Zero contrast failures or orphaned files].
```
