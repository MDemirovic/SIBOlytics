# SIBOlytics

SIBOlytics is a full-stack app (React + Express + Postgres) for SIBO tracking.

## Stack
- Frontend: React, TypeScript, Vite, Tailwind
- Backend: Express, TypeScript
- Database: Postgres (Neon for free launch)
- NIH RAG LLM: Gemini or Groq API (free-tier options)

## Local Setup

### 1) Install
```bash
npm ci
```

### 2) Create env file
Copy `.env.example` to `.env` and set:
- `DATABASE_URL`
- `API_PORT` (optional, default backend port is `3001`)
- `NIH_LLM_PROVIDER` (`gemini` or `groq`)

Provider keys/models:
- Gemini: `GEMINI_API_KEY`, optional `NIH_LLM_MODEL` (default `gemini-2.0-flash`)
- Groq: `GROQ_API_KEY`, optional `NIH_GROQ_MODEL` (default `llama-3.1-8b-instant`)

Optional NIH settings:
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
- `NIH_LLM_PROVIDER=gemini` or `NIH_LLM_PROVIDER=groq`
- if Gemini: `GEMINI_API_KEY=<your_google_ai_studio_key>`
- if Groq: `GROQ_API_KEY=<your_groq_api_key>`

### Recommended NIH env on Render
- Gemini model: `NIH_LLM_MODEL=gemini-2.0-flash`
- Groq model (if provider=groq): `NIH_GROQ_MODEL=llama-3.1-8b-instant`
- `NIH_TOP_K=6`
- `NIH_MAX_CONTEXT_CHARS=10000` to `12000`
- `NIH_MAX_QPS_PER_USER=1`
- `NIH_MAX_REQ_PER_HOUR=30` to `50`

In production mode, backend serves both:
- API (`/api/*`)
- frontend static build from `dist`

This keeps frontend + API on one URL and avoids CORS/cookie issues.

## NIH Knowledge Base Ingestion

This project includes a custom ingestion script:
- script: `scripts/ingest_nih_kb.ts`
- command: `npm run ingest:nih`

What it does:
- Reads sources from `src/nih_kb/sources.json`
- Fetches each NIH URL
- Extracts readable page text
- Splits text into chunks (~150 words each)
- Writes JSON cache files into `src/nih_kb/cache/`

### Add a new NIH source
1. Add a new item to `src/nih_kb/sources.json` with `url`, `title`, `category`.
2. Run:
```bash
npm run ingest:nih
```
3. Confirm a new JSON file appears in `src/nih_kb/cache/`.
4. Deploy.

Note:
- Current ingest script accepts URLs containing `.nih.gov`.
- Markdown files in `src/nih_kb/*.md` are not used by server RAG retrieval.
- Server retrieval currently reads only `src/nih_kb/cache/*.json`.

### Expected cache JSON format
```json
{
  "url": "https://...",
  "title": "Source title",
  "dateFetched": "2026-03-11T10:00:00.000Z",
  "chunks": [
    "chunk text 1",
    "chunk text 2"
  ]
}
```

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

## Limits and Quota (How to Know Remaining Messages)

There are two separate limits:
- Local app limit (your backend): controlled by `NIH_MAX_QPS_PER_USER` and `NIH_MAX_REQ_PER_HOUR`.
- Provider limit (Gemini/Groq): controlled by provider quota and account tier.

How to tell which one you hit:
- `429` + `LOCAL_RATE_LIMIT` -> your app-side limit.
- `429` + `UPSTREAM_QUOTA_EXCEEDED` -> provider-side quota/credits limit.

Where to monitor provider usage:
- Gemini: AI Studio usage/limits dashboard.
- Groq: Groq Console usage/rate limits dashboard.

Practical message estimate:
- Minimum guaranteed per user per hour = `NIH_MAX_REQ_PER_HOUR`.
- Real maximum can be lower if provider quota is exhausted.

## What I Learned (Template)

Use this section after each feature or incident.

```md
## What I Learned - <date>

### Goal
What I wanted to achieve in one sentence.

### What worked
- ...
- ...

### What broke
- ...
- ...

### Root cause
The actual technical reason the issue happened.

### Fix
What changed in code/config and why it solved it.

### Guardrails for next time
- ...
- ...

### Next improvement
One concrete follow-up improvement.
```

Writing tips:
- Be specific about exact env vars, endpoint names, and error codes.
- Prefer "cause -> effect -> fix" over long story format.
- Keep each bullet short and action-oriented.

## GitHub Pages

`.github/workflows/deploy-pages.yml` is manual-only (`workflow_dispatch`) so Pages deploy does not run on every push.
