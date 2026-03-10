# SIBOlytics

SIBOlytics is a full-stack app (React + Express + Postgres) for SIBO tracking.

## Stack
- Frontend: React, TypeScript, Vite, Tailwind
- Backend: Express, TypeScript
- Database: Postgres (Neon for free launch)
- NIH RAG LLM: Gemini API (free-tier supported)

## Local Setup

### 1) Install
```bash
npm ci
```

### 2) Create env file
Copy `.env.example` to `.env` and set:
- `DATABASE_URL`
- `API_PORT` (optional, default backend port is `3001`)
- `GEMINI_API_KEY` (required if you want `/api/nih/chat` to work)

Optional NIH settings:
- `NIH_LLM_MODEL` (default `gemini-2.0-flash`)
- `NIH_TOP_K` (default `6`)
- `NIH_MAX_CONTEXT_CHARS` (default `12000`)
- `NIH_MAX_QPS_PER_USER` (default `1`)
- `NIH_MAX_REQ_PER_HOUR` (default `30`)

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
- `GEMINI_API_KEY=<your_google_ai_studio_key>`

### Recommended NIH env on Render
- `NIH_LLM_MODEL=gemini-2.0-flash`
- `NIH_TOP_K=6`
- `NIH_MAX_CONTEXT_CHARS=12000`
- `NIH_MAX_QPS_PER_USER=1`
- `NIH_MAX_REQ_PER_HOUR=30`

In production mode, backend serves both:
- API (`/api/*`)
- frontend static build from `dist`

This keeps frontend + API on one URL and avoids CORS/cookie issues.

## NIH Bot API

### Endpoint
- `POST /api/nih/chat` (auth required)

### Request body
```json
{
  "question": "What is a positive hydrogen breath test?",
  "language": "en"
}
```

### Success payload
```json
{
  "success": true,
  "data": {
    "answer": "... [C1] ...",
    "citations": [
      {
        "id": "C1",
        "title": "...",
        "url": "https://...nih...",
        "snippet": "..."
      }
    ],
    "model": "gemini-2.0-flash"
  }
}
```

### Error codes
- `INVALID_INPUT`
- `LOCAL_RATE_LIMIT`
- `UPSTREAM_QUOTA_EXCEEDED`
- `UPSTREAM_ERROR`
- `NO_VALID_CITATIONS`

## GitHub Pages

`.github/workflows/deploy-pages.yml` is manual-only (`workflow_dispatch`) so Pages deploy does not run on every push.
