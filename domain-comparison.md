# Domain Selection & Strategic Pricing Comparison
**Project:** Bangladesh Motocross Club Academy (`bdmotocross`)  
**Date:** November 2026  
**Status:** Decided — Dual Strategy (`bdmotocross.com` + `motocrossacademy.bd`)

---

## 1. Executive Summary

Selecting the primary web domain for the Bangladesh Motocross Club Academy balances three key priorities:
1. **Brand Authority & Recognition:** Global credibility of `.com` vs. local legitimacy of `.bd`.
2. **Total Cost of Ownership (TCO):** Initial registration fee vs. recurring multi-year renewal price spikes.
3. **Brand Scope:** Future-proofing the domain to support an entire ecosystem (Academy, Racing Club, Events, Rider Licensing, Merchandise) rather than an academy alone.

### Recommended Direction: **Dual Domain Architecture**
* **Primary Hub:** `bdmotocross.com` (Main web platform, admissions, events, email).
* **National Anchor:** `motocrossacademy.bd` (Defensive brand lock via Hostever/BTCL, permanent 301 redirect to primary site).

```
                  ┌──────────────────────────────────────────────────────────────┐
                  │                 DUAL DOMAIN ARCHITECTURE                     │
                  └──────────────────────────────┬───────────────────────────────┘
                                                 │
                  ┌──────────────────────────────┴──────────────────────────────┐
                  ▼                                                             ▼
     [ PRIMARY HUB: GLOBAL & MODERN ]                             [ LOCAL ANCHOR: DEFENSIVE & OFFICIAL ]
            bdmotocross.com                                                motocrossacademy.bd
    • Global .com credibility                                     • National institutional recognition (.bd)
    • Zero setup bureaucracy                                      • Blocks brand squatters / competitors
    • Serves Club, Events, Merch & Academy                        • 301 Permanent Redirect to bdmotocross.com
    • Instant DNS updates & SSL automation                        • Registered via Hostever (BTCL)
```

---

## 2. The Renewal Pricing Trap (TCO Analysis)

Many specialized new TLDs (nTLDs) like `.academy` and `.bike` offer cheap introductory prices on Namecheap, but feature steep annual price increases upon renewal:

| Domain | Registrar | Year 1 Promo | Annual Renewal | 5-Year Total Cost | Risk & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`motocross.academy`** | Namecheap | $8.48 | **$69.98 / yr** | ~$288.40 | ⚠️ Extreme 8x renewal jump; lacks local affiliation |
| **`motocrossacademy.bike`** | Namecheap | $5.98 | **$55.48 / yr** | ~$227.90 | ⚠️ 9x renewal jump; "bike" sounds like bicycle/cycling |
| **`motocrossacademy.club`** | Namecheap | $5.00 | **$24.98 / yr** | ~$104.92 | Good club feel, but 5x renewal price jump |
| **`bdmotocrossacademy.club`**| Namecheap | $5.00 | **$24.98 / yr** | ~$104.92 | 21 characters long; awkward to print on jerseys/stickers |
| **`motocrossacademy.bd`** | Hostever | 1,500 BDT (~$12.50) | **$23.00 / yr** (~2,750 BDT) | ~$104.50 | Official BTCL domain; requires National ID / documents |
| **`bdmotocross.com`** | Namecheap / Porkbun | **$10.48** | **$10.37 – $19.98 / yr** | **~$70 – $90** | Gold standard; stable wholesale pricing; zero surprises |

---

## 3. Detailed Option Comparison

### Option 1: `bdmotocross.com`
* **Status:** Verified Available (Live WHOIS lookup confirmed unregistered).
* **Pros:**
  * **Umbrella Brand:** Covers the Academy, Club, Race events, Rider memberships, and Shop.
  * **Frictionless Setup:** Unlocks in 60 seconds. Instant integration with GitHub, Vercel, Cloudflare, and automated SSL.
  * **Short & Punchy:** Easy to pronounce, type, and remember. Fits cleanly on racing bikes, gear, and banners.
* **Cons:** Does not contain the word "academy" directly in the root domain (resolved via URL path: `bdmotocross.com/academy`).

### Option 2: `motocrossacademy.bd`
* **Status:** Available via Hostever (1,500 BDT).
* **Pros:**
  * **Institutional Legitimacy:** High domestic authority in Bangladesh. Reassures parents, sponsors, and sports federations of official status.
  * **Local SEO Signal:** Strong geographical signal for Bangladeshi search traffic.
* **Cons:**
  * **Bureaucratic Overhead:** Governed by BTCL; requires NID/Trade License/organization paperwork.
  * **Technical Lag:** BTCL DNS record changes take 24–48 hours to propagate.
  * **Scope Limitation:** Restricts the brand identity strictly to an academy.

---

## 4. Better Alternatives Evaluated (WHOIS Verified)

| Domain | WHOIS Status | Est. Reg / Renewal | Brand Positioning |
| :--- | :--- | :--- | :--- |
| **`bdmotocross.com`** | **Available** | **~$10.48 / $19.98** | **Best Overall:** Clean, universal, matches organization name. |
| **`motocrossbd.com`** | **Available** | **~$10.48 / $19.98** | Natural phrasing ("Motocross Bangladesh"). |
| **`bdmxacademy.com`** | **Available** | **~$10.48 / $19.98** | **Best for Riders:** "MX" is the global shorthand for motocross. |
| **`bdmotocrossacademy.com`** | **Available** | **~$10.48 / $19.98** | Complete organizational name under `.com`. |
| **`bdmotocross.org`** | **Available** | **~$9.98 / $17.98** | Non-profit / National sporting club presence. |

---

## 5. Implementation Roadmap for the Dual Strategy

1. **Phase 1: Secure Canonical Domain (`bdmotocross.com`)**
   * Register on Namecheap or Porkbun.
   * Connect to Cloudflare DNS for Anycast routing, DDoS protection, and SSL termination.
2. **Phase 2: Secure National Trademark Anchor (`motocrossacademy.bd`)**
   * Register via Hostever (1,500 BDT) submitting required NID / Club paperwork.
3. **Phase 3: Routing & Forwarding**
   * Configure a permanent HTTP 301 redirect from `motocrossacademy.bd` to `https://bdmotocross.com/` (or `https://bdmotocross.com/academy`).
   * Ensures zero traffic loss while preserving brand protection across Bangladesh.
