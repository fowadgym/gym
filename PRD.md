# Product Requirements Document (PRD)

**Project Name:** High-Converting Gym Landing Page

**Target Execution:** Autonomous AI Agents (Full-Stack / Frontend Architecture)

**Tech Stack:** Next.js (App Router) / React 19 / TypeScript / Tailwind CSS / Lucide React

---

## 1. Project Overview & Objectives

Build a production-grade, highly performant single-page landing application for a modern gym facility. The system must maximize lead conversion (free trial scheduling and membership checkout) through structured visual hierarchy, zero layout shift, accessibility, and frictionless WhatsApp lead generation.

---

## 2. Technical Stack & Architecture

* **Framework:** Next.js (App Router, Server Components by default; `"use client"` restricted to interactive UI boundaries).
* **Language:** TypeScript (`strict: true`, exhaustive type coverage).
* **Styling:** Tailwind CSS v3/v4 with CSS variables for dynamic theming and utility-first styling.
* **Icons:** `lucide-react`.
* **Image Optimization:** `next/image` with explicit dimensions, aspect ratios, responsive `sizes`, and WebP/AVIF output.
* **Fonts:** `next/font/google` (`Inter` for LTR, `Cairo` for Arabic RTL) with `display: 'swap'`.
* **Direction:** Bi-directional layout architecture (`dir="rtl"` or `dir="ltr"`) utilizing Tailwind logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`).

---

## 3. Directory Layout

```text
src/
├── app/
│   ├── layout.tsx             # Root layout with fonts, metadata, and HTML dir configuration
│   ├── page.tsx               # Main landing page assembling server & client sections
│   └── globals.css            # Tailwind directives, CSS variables, custom scrollbar utilities
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx          # RSC with dynamic background & CTA
│   │   ├── Accreditations.tsx       # Horizontal snap-scroll / carousel
│   │   ├── FacilityGallery.tsx      # Client component (Interactive Lightbox)
│   │   ├── TrainerGrid.tsx          # RSC displaying trainer profile cards
│   │   ├── PricingTable.tsx         # Client component (Billing toggle & tier CTA triggers)
│   │   ├── Testimonials.tsx         # RSC with transformation cards & verified badges
│   │   └── ContactLocation.tsx      # RSC schedule table + embed map iframe
│   ├── ui/
│   │   ├── Button.tsx               # Reusable variant button component
│   │   ├── LightboxModal.tsx        # Accessible dialog for image zoom
│   │   └── FloatingWhatsApp.tsx     # Client component fixed button with scroll visibility
│   └── icons/                       # Custom SVG wrappers if required
├── data/
│   ├── accreditations.ts      # Static data array with typed interfaces
│   ├── trainers.ts
│   ├── pricing.ts
│   └── gallery.ts
└── types/
    └── index.ts               # Shared TypeScript schemas

```

---

## 4. Component Specifications

### Section 1: Hero (`HeroSection.tsx`)

* **Component Type:** React Server Component.
* **Visuals:** Full-viewport or min-h-[90vh] container. Background using `next/image` with `priority`, `fill`, and `object-cover`, overlaid with a dark gradient (`bg-neutral-950/80 backdrop-blur-[2px]`).
* **Content:**
* Centered logo with prioritized asset loading.
* `H1`: Headline highlighting transformation, discipline, and performance.
* `P`: High-impact supporting copy.


* **Action:** Primary CTA (`<Button asChild>`) linking smoothly to `#pricing` or opening an assessment modal.

### Section 2: Certifications & Accreditations (`Accreditations.tsx`)

* **Component Type:** React Server Component or Client Component (for touch-drag support).
* **Layout:** Scrollable horizontal container (`flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4`).
* **Data Node:**
```typescript
export interface Accreditation {
  id: string;
  badgeUrl: string;
  title: string;
  issuingOrganization: string;
  year: number;
}

```


* **Styling:** Compact card (`snap-center shrink-0 w-64 bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-3`).

### Section 3: Facility Gallery (`FacilityGallery.tsx` + `LightboxModal.tsx`)

* **Component Type:** Interactive Client Component (`"use client"`).
* **Layout:** Grid layout (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`).
* **Interactivity:**
* Click triggers state `activeImage: GalleryImage | null`.
* Renders a focus-trapped `<LightboxModal/>` using standard keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`).


* **Assets:** Next.js optimized images with hover zoom (`group-hover:scale-105 transition-transform duration-300`).

### Section 4: Certified Coaching Staff (`TrainerGrid.tsx`)

* **Component Type:** React Server Component.
* **Layout:** Responsive grid (`grid grid-cols-1 md:grid-cols-3 gap-6`).
* **Card Anatomy:**
* Image container with `aspect-[4/5]` relative wrapper.
* Trainer name (`H3`) and certification status badge.
* Specialization pills: Flex container with badges (e.g., `Powerlifting`, `Kinematics`, `Dietetics`).
* Short bio snippet.



### Section 5: Membership Tiers (`PricingTable.tsx`)

* **Component Type:** Client Component (`"use client"`).
* **Features:**
* Optional billing interval switch (Monthly vs Annual with discount badge).
* 3 Tiers:
1. **Basic:** Gym floor access, standard locker.
2. **Pro (Featured):** Highlighted with accent border (`border-amber-500 shadow-lg shadow-amber-500/10`), floor access, sauna/spa, free fitness evaluation.
3. **VIP:** Full facility, 1-on-1 personal trainer sessions, bespoke nutrition coaching.


* Direct WhatsApp integration link generator attaching plan metadata:
```typescript
const generateWhatsAppUrl = (phone: string, planName: string) => {
  const message = encodeURIComponent(`Hi, I would like to subscribe to the ${planName} membership.`);
  return `https://wa.me/${phone}?text=${message}`;
};

```





### Section 6: Social Proof & Transformations (`Testimonials.tsx`)

* **Component Type:** React Server Component.
* **Layout:** Responsive cards (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
* **Card Anatomy:**
* Split before/after thumbnail comparison or single high-impact result shot.
* Numeric callout (e.g., `"-14 kg Fat / +5 kg Muscle in 16 Weeks"`).
* Verified client label and quote.



### Section 7: Schedule, Location & Footer (`ContactLocation.tsx`)

* **Component Type:** React Server Component.
* **Elements:**
* Hours Table: Clean key-value schedule (Men's / Women's slots if applicable, regular 24/7 or daily windows).
* Map: Lazy-loaded Google Maps `iframe` with `loading="lazy"` wrapped in a responsive ratio (`aspect-video rounded-xl overflow-hidden border border-neutral-800`).
* Clickable contact badges (Phone, WhatsApp, Location coordinate link).



### Global Sticky Action (`FloatingWhatsApp.tsx`)

* **Component Type:** Client Component (`"use client"`).
* **Behavior:** Appears fixed at `bottom-6 end-6` (utilizing logical position). Reveals only after user scrolls past 300px via a scroll event listener or `IntersectionObserver`.

---

## 5. Non-Functional Requirements & Design Tokens

### Design System Configuration (`tailwind.config.ts` or CSS variables)

* **Background:** Dark-mode centric.
* Primary: `#09090b` (`zinc-950`)
* Surface/Card: `#18181b` (`zinc-900`)
* Surface Border: `#27272a` (`zinc-800`)


* **Accent / Brand Color:**
* Primary: Electric Gold (`#F59E0B` / `amber-500`) or Neon Lime (`#84CC16` / `lime-500`).


* **Typography:**
* English: `font-sans` mapped to `Inter`.
* Arabic: `font-arabic` mapped to `Cairo`.



### SEO & Performance Criteria

* Dynamic metadata configuration in `app/page.tsx` via `export const metadata: Metadata`.
* All offscreen images configured with `loading="lazy"`. Hero visual set to `priority={true}`.
* Bundle size control: Zero heavy external slider or modal libraries; rely on native CSS scroll snap and React state.

---

## 6. Execution Instructions for AI Agent

1. **Type Definitions:** Scaffold `src/types/index.ts` with strict interfaces for `Accreditation`, `Trainer`, `PricingTier`, `Testimonial`, and `GalleryImage`.
2. **Mock Datasets:** Populate `src/data/` files with realistic gym data matching the types.
3. **Build Core Components:** Create sections in `src/components/sections/` ensuring proper division of Server Components and Client Components.
4. **Assemble Main View:** Render components sequentially inside `src/app/page.tsx` inside a `<main>` container with semantic layout tags.
5. **Add Client Interactions:** Implement the gallery lightbox modal and floating WhatsApp trigger with clean event listener cleanup inside `useEffect`.
6. **Lint & Verify:** Check for valid accessibility attributes (`aria-expanded`, `aria-label`, `role="dialog"`) and zero hydration mismatches.