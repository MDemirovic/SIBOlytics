# SIBOlytics

SIBOlytics is a full-stack app (React + Express + Postgres) for SIBO tracking.

## Stack
- Frontend: React, TypeScript, Vite, Tailwind
- Backend: Express, TypeScript
- Database: Postgres (Neon for free launch)

## Local Setup

### 1) Install
```bash
npm ci
```

### 2) Create env file
Copy `.env.example` to `.env` and set:
- `DATABASE_URL`
- `API_PORT` (optional, default backend port is `3001`)

### 3) Run backend
```bash
npm run dev:server
```

### 4) Run frontend
```bash
npm run dev:client
```

Open `http://localhost:3000`.

## Production Launch (Render + Neon)

### Render commands
- Build command: `npm ci && npm run build`
- Start command: `npm run start`

### Required env on Render
- `DATABASE_URL=<your_neon_connection_string>`
- `NODE_ENV=production`
- `VITE_BASE_URL=/`

In production mode, backend serves both:
- API (`/api/*`)
- frontend static build from `dist`

This keeps frontend + API on one URL and avoids CORS/cookie issues.

## GitHub Pages

`.github/workflows/deploy-pages.yml` is now manual-only (`workflow_dispatch`) so Pages deploy does not run on every push.
