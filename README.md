# Enzi

Location-aware discovery platform for Addis Ababa spots. Browse nearby parks, museums, game zones, galleries, and hidden gems on an interactive map.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · MapLibre GL · Tailwind CSS v4

## Getting started

Requires Node.js >= 22.12.0 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then add your Gebeta token
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_GEBETA_ACCESS_TOKEN` | yes | Gebeta Maps access token. Browser-exposed, so scope it accordingly. The map page renders a fallback notice without it. |

`.env` and `.env*.local` are gitignored. Never commit real tokens.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build (includes type checking) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Standalone type check |

## Routes

- `/` — landing page, category links into `/map?category=<key>`
- `/map` — map explorer with search, category filters, and a spot list

## Status

Spot data, geocoding, and directions are mocked pending a backend. Spot detail pages, profiles, and bookings are not built yet.

## License

MIT — see [LICENSE](./LICENSE).
