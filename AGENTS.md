# AGENTS.md — Enzi

Location-aware discovery platform for Addis Ababa spots. Next.js 16 (App Router, Turbopack) + React 19 + MapLibre GL + Tailwind CSS v4.

## Developer commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build (also runs type checking)
- `npm run start` — serve the built app
- `npm run lint` — ESLint

No test framework is configured. There is no `typecheck` script; use `npx tsc --noEmit`.

## Environment variables
- `NEXT_PUBLIC_GEBETA_ACCESS_TOKEN` — required. The map renders a fallback notice without it. Browser-exposed, so scope the token accordingly.
- See `.env.example`. `.env` is gitignored; never commit real tokens.

## Project layout
- `app/layout.tsx` — root layout, `next/font` Fredoka + Nunito loaded as CSS variables
- `app/globals.css` — Tailwind v4 entry (`@import "tailwindcss"`) and the entire design theme via `@theme`
- `app/page.tsx` — landing page, category links into `/map?category=<key>`
- `app/map/page.tsx` — server component; reads `searchParams.category`, validates it, renders `MapExplorer` inside `Suspense`
- `components/map/GebetaMap.tsx` — MapLibre map (OSM raster tiles), owns its own lifecycle
- `components/map/MapExplorer.tsx` — client component: search, category filter, mock spot list, mock directions
- `public/brand/` — brand imagery
- `docs/landing-page-mockup.html` — original landing page design reference

There is no `lib/`, no `app/api/`, no database, and no auth. Do not assume better-auth, Prisma, or TanStack Query are present — they were removed. A backend spec lives outside the code; see git history if needed.

## Styling conventions
Tailwind v4 is CSS-first. There is no `tailwind.config.js` and adding one will be silently ignored unless referenced with `@config` in `globals.css`. Add new design tokens as CSS custom properties in the `@theme` block:

- Colors: `bg-clay`, `text-charcoal`, `text-orange`, plus `darkorange`, `green`, `purple`, `cyan`, `pink`, `gold`, `subtle`
- Fonts: `font-display` (Fredoka), `font-body` (Nunito)
- Radius: `rounded-btn` for pill buttons

## Path aliases
- `@/*` maps to `./*` (tsconfig.json). Use `import ... from "@/..."`.

## Conventions
- Route handlers and data fetching stay server-side; add `"use client"` only at interactive leaves
- Prefer `next/link` over `window.location.href` for internal navigation
- Prefer deriving state with `useMemo` over `useState` + `useEffect` sync
- Map camera changes are driven by `center`/`zoom` props; `GebetaMap` applies them imperatively so parent re-renders don't rebuild the map
- ESLint runs with `no-explicit-any` as an error — type your data instead

## Current limitations
Spot data, geocoding, and directions in `MapExplorer` are mocks pending a backend. `/spots/[id]`, profiles, and bookings do not exist yet.