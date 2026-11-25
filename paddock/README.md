# BMCA Rider Paddock — Official Community Platform

> **Live Production URL:** [https://paddock.bdmotocross.com](https://paddock.bdmotocross.com)  
> **Parent Organization:** Bangladesh Motocross Club & Academy (BMCA)  
> **Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS  
> **Database & Backend:** Supabase (PostgreSQL, Row-Level Security, Storage, Auth)  
> **Hosting:** Vercel

The **BMCA Rider Paddock** is the official digital paddock and social networking platform for riders, coaches, cadets, and club executives of the Bangladesh Motocross Club & Academy.

---

## ⚡ Key Features

- **Public Rider Profiles (`/u/:username`):** High-speed vanity URLs with dynamic role badges (`[DIRECTOR]`, `[HEAD COACH]`, `[PRO RACER]`, `[CADET]`, `[RIDER]`).
- **Paddock Live Feed (`/feed`):** Trackside discussion board supporting rich commentary, user mentions, and YouTube facades.
- **Client-Side Compressed Media:** Native 1200px WebP photo uploads stored in Supabase's `paddock-media` bucket (zero broken Discord CDN links).
- **Trackside Mobile Roster Admin (`/admin/roster`):** Secure mobile provisioning for club officials to onboard riders trackside without database CLI tools.
- **WhatsApp Privacy Opt-in:** Separate `profile_contacts` table ensuring personal WhatsApp contact details remain private by default unless explicitly made public by the rider.
- **Hardened PostgreSQL Security:** Strict column-level write permissions, non-bypassable password reset policies, and SECURITY DEFINER search path pinning.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16.4+ (Turbopack, Server Actions, App Router)
- **Styling:** Tailwind CSS 4, Lucide React icons
- **State & Data Access:** Supabase SSR (`@supabase/ssr`), Supabase JS (`@supabase/supabase-js`)
- **Testing:** Vitest, Testing Library (`npm test`)

---

## 📦 Environment Variables

Configured in Vercel and locally in `.env.local`:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous Supabase key for client-side reads |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret key for admin operations (`/admin/roster`) |
| `NEXT_PUBLIC_APP_DOMAIN` | Canonical domain (`paddock.bdmotocross.com`) |

---

## 🗄️ Database Setup & Migrations

All SQL migrations are stored under `supabase/migrations/` and consolidated in `supabase/full_setup.sql`:

1. `20261115000001_initial_schema.sql` — Enums, `profiles`, `posts`, `comments`, `post_mentions`.
2. `20261115000002_triggers_and_functions.sql` — Auto-provisioning triggers, password change triggers, system field protection.
3. `20261115000003_rls_and_storage.sql` — Row-Level Security policies and `paddock-media` storage bucket.
4. `20261115000004_security_hardening.sql` — Security definer search_path pinning, app_metadata role protection, YouTube ID validation.
5. `20261115000005_whatsapp_opt_in.sql` — Standalone `profile_contacts` table with privacy opt-in RLS.

To apply migrations on a remote database:
```bash
supabase db push --db-url "<DATABASE_CONNECTION_STRING>"
```
*(Or execute `supabase/full_setup.sql` in the Supabase Dashboard SQL Editor).*

---

## 👥 Seed Accounts & Core Roster

Active member accounts provisioned in Supabase Auth and `public.profiles`:

| Username | Email | Role | Machine & Number | Profile URL |
| :--- | :--- | :--- | :--- | :--- |
| `abraar` | `abraar@members.bdmotocross.com` | `[DIRECTOR] [MEMBER]` | Hero XPulse 200 4V Pro (`#01`) | [/u/abraar](https://paddock.bdmotocross.com/u/abraar) |
| `mr99` | `mr99@members.bdmotocross.com` | `[DIRECTOR] [PRO RACER]` | Honda CRF450R (`MR99`) | [/u/mr99](https://paddock.bdmotocross.com/u/mr99) |
| `baundal_bulbul` | `baundal_bulbul@members.bdmotocross.com` | `[HEAD COACH]` | Yamaha YZ250F (`#07`) | [/u/baundal_bulbul](https://paddock.bdmotocross.com/u/baundal_bulbul) |
| `sharif_on_track` | `sharif_on_track@members.bdmotocross.com` | `[PRO RACER]` | Kawasaki KX250 (`#05`) | [/u/sharif_on_track](https://paddock.bdmotocross.com/u/sharif_on_track) |
| `demo_cadet` | `demo_cadet@members.bdmotocross.com` | `[CADET]` | Cadet Training (`#99C`) | [/u/demo_cadet](https://paddock.bdmotocross.com/u/demo_cadet) |

*Seed scripts are committed at `supabase/seed_demo_accounts.sql` and `supabase/seed_abraar_profile.sql`.*

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run test suite
npm test

# Run build check
npm run build
```

### RLS policy tests

Needs Docker and the Supabase CLI. Runs against the local stack only, never the hosted project:

```bash
supabase start      # applies supabase/migrations (no seed)
npm run test:rls    # pgTAP: supabase/tests/rls.test.sql, rolled back after the run
```

---

© 2026 Bangladesh Motocross Club & Academy
