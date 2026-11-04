# BMCA Platform Enhancement & Brand Evolution: Implementation Guide
# For Product Managers & Frontend Engineers

> **Source Documents:**  
> - Master Brand Identity: `BRAND_IDENTITY.md`  
> - Global Benchmark Research: `builder/research_results/international-benchmarks-and-brand-evolution.md`  
> - Author: ArchitectUX Agent  
> - Target Surfaces: `website/index.html`, `website/css/styles.css`, `website/js/main.js`  

---

## 1. Overview & Objective

To transition **Bangladesh Motocross Club & Academy (BMCA)** from an informational landing page to a high-converting, authority-grade motorsports platform, the product and frontend teams will implement key structural enhancements benchmarked from top US motocross facilities (Millsaps Training Facility, ClubMX) and European enduro academies (Jarvis Signature Tours, Fast Eddy Racing, FIM MXGP Academy).

---

## 2. Product Specifications (For Product Team)

### Task 1: Academy "Arrive & Ride" Package Tiers
**Problem:** Prospective riders currently see a 4-stage curriculum but do not know how coaching is packaged, whether equipment is supplied, or how to book.  
**Solution:** Introduce 3 structured package cards under `#academy`:

1. **Card 1: Weekend Starter Clinic (Arrive & Ride)**
   - *Target:* Beginners and curious enthusiasts trying motocross for the first time.
   - *Included:* BMCA fleet 150cc–250cc dirt bike + sanitized DOT/ECE helmet & full armor + 1-on-1 coach + fuel and track access.
   - *Duration:* 2-Day Weekend Intensive (Saturday & Sunday).
   - *CTA:* "Book Starter Clinic" $\rightarrow$ Direct WhatsApp pre-filled with Starter Clinic inquiry.

2. **Card 2: Monthly Academy Cadet (Ages 12+ & Adult)**
   - *Target:* Riders committed to learning proper racing technique and physical fitness.
   - *Included:* 4 progressive weekend sessions + bike & stance progression + suspension basics + skill certificate.
   - *Duration:* 1-Month Training Block.
   - *CTA:* "Enroll as Cadet" $\rightarrow$ Direct WhatsApp pre-filled with Cadet program.

3. **Card 3: Open Paddock Practice Pass**
   - *Target:* Active riders who own a dirt bike / dual-sport machine.
   - *Included:* Track access to Chittagong Dirt Arena + flag marshal safety + paddock pit space + trackside sag tuning.
   - *Duration:* Day Pass / Weekend Pass.
   - *CTA:* "Get Track Pass" $\rightarrow$ Direct WhatsApp pre-filled with Track Pass request.

---

### Task 2: Guardians' Safety & Protocol Dossier ("Entourage Hub")
**Problem:** In Bangladesh, the primary barrier to enrollment is parental fear of injury and the social stigma of reckless street riding.  
**Solution:** Add an authoritative, reassuring "Parents & Guardians Safety Guide" module directly beside the curriculum:
- **Zero-Tolerance Armor Standard:** Explaining mandatory DOT/ECE full-face helmets, chest/roost armor, knee guards, and rigid motocross boots.
- **Trackside Flag Protocols:** Educating parents that track riding is controlled (Yellow flag = slow down/no passing; Red flag = emergency halt; Chequered flag = session complete).
- **Controlled Machinery:** Low-speed throttle governor stops for younger riders on training bikes until fundamentals are mastered.
- **On-Site Medical & Marshalling:** Trained corner marshals at blind turns and first-aid medical standby at the paddock.

---

### Task 3: Interactive Equipment Selector ("Do I Need Gear?")
**Problem:** Users drop off when unsure what to select on the form.  
**Solution:** Add a simple 2-option interactive selector to the registration form:
- Option A: *"I need a training bike & protective gear"* (pre-selects loaner package).
- Option B: *"I have my own motorcycle & gear"* (pre-selects track tuning / personal pass).

---

## 3. Frontend Implementation Guide (For Frontend Engineers)

### 3.1 Markup Structure (`website/index.html`)

Insert the package grid inside `#academy` right after the `.logistics-section` or curriculum overview:

```html
<!-- Academy Package Tiers -->
<div class="packages-section" style="margin-block-start: 48px;">
  <div class="section-header">
    <span class="eyebrow eyebrow-green">Academy Enrollment Tiers</span>
    <h3 class="section-title" style="font-size: 2rem;">Choose Your Training Pathway</h3>
    <p class="section-desc">Transparent options whether you need a full academy bike and gear, or want to bring your own machine.</p>
  </div>

  <div class="packages-grid">
    <!-- Tier 1: Arrive & Ride -->
    <div class="package-card featured">
      <div class="package-badge">Most Popular for Beginners</div>
      <div class="package-header">
        <h4 class="package-name">Weekend Starter Clinic</h4>
        <div class="package-type">Turnkey Arrive &amp; Ride</div>
      </div>
      <p class="package-summary">Ideal for first-time riders. Full training motorcycle and protective armor provided.</p>
      <ul class="package-features">
        <li>✓ BMCA Fleet 150cc–250cc Dirt Bike Included</li>
        <li>✓ Sanitized DOT/ECE Helmet &amp; Full Body Armor</li>
        <li>✓ 1-on-1 Certified Coach (Clutch, Posture, Pegs)</li>
        <li>✓ Track Fuel &amp; Chittagong Dirt Arena Access</li>
      </ul>
      <a href="https://wa.me/8801975376114?text=Hello%20BMCA,%20I%20would%20like%20to%20book%20the%20Weekend%20Starter%20Clinic" class="btn btn-green btn-full">Book Starter Clinic →</a>
    </div>

    <!-- Tier 2: Monthly Cadet -->
    <div class="package-card">
      <div class="package-header">
        <h4 class="package-name">Monthly Academy Cadet</h4>
        <div class="package-type">Junior (12+) &amp; Senior Division</div>
      </div>
      <p class="package-summary">Comprehensive 4-week progression from cornering ruts to race gate starts.</p>
      <ul class="package-features">
        <li>✓ 4 Weekend Training Blocks (8 Track Sessions)</li>
        <li>✓ 4-Stage Progressive Curriculum &amp; Assessment</li>
        <li>✓ Off-the-Bike Physical Conditioning Guidance</li>
        <li>✓ BMCA Skill Certificate upon Completion</li>
      </ul>
      <a href="https://wa.me/8801975376114?text=Hello%20BMCA,%20I%20am%20interested%20in%20the%20Monthly%20Academy%20Cadet%20Program" class="btn btn-primary btn-full">Enroll as Cadet →</a>
    </div>

    <!-- Tier 3: Open Paddock Pass -->
    <div class="package-card">
      <div class="package-header">
        <h4 class="package-name">Open Paddock Pass</h4>
        <div class="package-type">Bring Your Own Machine</div>
      </div>
      <p class="package-summary">For licensed off-road and dual-sport owners wanting sanctioned track practice.</p>
      <ul class="package-features">
        <li>✓ Full Day Chittagong Dirt Arena Track Access</li>
        <li>✓ Marshaled Corners &amp; Safety Flag Protocols</li>
        <li>✓ Paddock Shade Pit Bay &amp; Wash Bay Access</li>
        <li>✓ Suspension Sag Tuning by Moto Freak Lab</li>
      </ul>
      <a href="https://wa.me/8801975376114?text=Hello%20BMCA,%20I%20want%20to%20register%20for%20an%20Open%20Paddock%20Practice%20Pass" class="btn btn-outline btn-full">Get Track Pass →</a>
    </div>
  </div>
</div>
```

---

### 3.2 CSS Specifications (`website/css/styles.css`)

Ensure new components reuse design tokens defined in `BRAND_IDENTITY.md`:

```css
/* Package Grid */
.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-block-start: 32px;
}

.package-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform var(--transition-fast), border-color var(--transition-fast);
}

.package-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-hover);
}

.package-card.featured {
  border-color: var(--green-track);
  box-shadow: 0 0 24px rgba(34, 197, 94, 0.12);
}

.package-badge {
  position: absolute;
  top: -12px;
  left: 24px;
  background: var(--green-track);
  color: #07090c;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.package-name {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--text-main);
  text-transform: uppercase;
  margin-block-end: 4px;
}

.package-type {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--yellow-trophy);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-block-end: 16px;
}

.package-summary {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-block-end: 20px;
}

.package-features {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
  flex-grow: 1;
}

.package-features li {
  font-size: 0.9rem;
  color: var(--text-muted);
  padding-block: 8px;
  border-bottom: 1px solid var(--border-subtle);
}

.btn-full {
  width: 100%;
  text-align: center;
  justify-content: center;
}
```

---

### 3.3 Critical JavaScript & Conversion Directives (`website/js/main.js`)

1. **Synchronous WhatsApp Dispatch:**  
   Always perform direct synchronous redirects (`window.location.href = waUrl`). **Never** wrap `window.open` in a delayed `setTimeout`, as iOS Safari and Android Chrome will treat it as an unsolicited popup and block it.
2. **Accessible Keyboard Navigation:**  
   If implementing tabs or accordions for the Guardians' Safety Hub, ensure buttons carry `aria-expanded="false"`, `aria-controls="panel-id"`, and have visible focus states (`:focus-visible`).
3. **Mobile Viewports (390px):**  
   Cards must collapse into a clean single column on mobile screens without causing horizontal overflow (`overflow-x: hidden`).
