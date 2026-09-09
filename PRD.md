# Product Requirements Document (PRD)

**Project Name:** Gym Management Engine & Athlete Self-Service Portal  
**Target Execution:** Autonomous AI Agents (Full-Stack / Supabase & Next.js App Router)  
**Tech Stack:** Next.js 15 (App Router, Server Actions, RSC), TypeScript (`strict: true`), Tailwind CSS (v3/v4 Dark Palette), Supabase (PostgreSQL, Auth, Storage, RLS), Lucide React.

---

## 1. System Overview & Core Objectives
Build a production-grade gym operating system composed of two integrated interfaces:
1. **Coach / Admin Control Center (`/admin`):** Athlete directory, subscription lifecycle manager, centralized exercise catalog with video assets, and multi-day workout plan architect.
2. **Athlete Member Portal (`/portal`):** Mobile-first progressive client app where authenticated members track subscription runway, view weekly assigned routines, inspect targeted muscle groups, and stream instructional workout demonstration videos.

---

## 2. Authentication & Authorization (RBAC Model)

### 2.1 Identity Flow
* Single shared Supabase Auth engine backing coaches and athletes.
* Role-based dispatch routed at middleware:
  * Role `admin` or `coach` $\rightarrow$ Allowed under `/admin/*`.
  * Role `athlete` $\rightarrow$ Allowed under `/portal/*` (Blocked from `/admin/*`).
* Unauthenticated requests are immediately routed to `/login`.

### 2.2 Next.js Route Architecture & Middleware Configuration
* Path protection implemented via `@supabase/ssr` inside `src/middleware.ts`.
* Session validation extracts role assertions directly from `auth.users` metadata or via an internal join with `profiles`.

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx              # Unified Email/Password entry point
│   ├── admin/
│   │   ├── layout.tsx                # Admin sidebar, topbar stats, role guard
│   │   ├── dashboard/page.tsx        # High-level KPIs & subscription tracker
│   │   ├── athletes/
│   │   │   ├── page.tsx              # Paginated athlete roster & search
│   │   │   └── [id]/page.tsx         # Athlete detail, plan assigner, timeline
│   │   └── exercises/page.tsx        # Exercise database & video uploader
│   └── portal/
│       ├── layout.tsx                # Mobile-first navigation shell for athletes
│       ├── dashboard/page.tsx        # Days left, quick routine launcher
│       └── workout/page.tsx          # Interactive day-by-day workout viewer