# SIBOlytics

SIBOlytics is a full-stack app (React + Express + Postgres) for SIBO tracking.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind
- Backend: Express, TypeScript
- Database: Postgres (Neon for free launch)
- NIH RAG LLM: Gemini or Groq API (free-tier options)

## Dual Provider Support (Gemini + Groq)

This project supports both providers in the same backend code path.

- Set `NIH_LLM_PROVIDER=gemini` to use Gemini.
- Set `NIH_LLM_PROVIDER=groq` to use Groq.
- If `NIH_LLM_PROVIDER` is missing/invalid, backend defaults to `gemini`.

Provider-specific env:

- Gemini: `GEMINI_API_KEY`, optional `NIH_LLM_MODEL`
- Groq: `GROQ_API_KEY`, optional `NIH_GROQ_MODEL`

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
- Server retrieval currently reads only `src/nih_kb/cache/*.json`.

### Expected cache JSON format

```json
{
  "url": "https://...",
  "title": "Source title",
  "dateFetched": "2026-03-11T10:00:00.000Z",
  "chunks": ["chunk text 1", "chunk text 2"]
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

## What I Learned

### Goal

Get NIH bot running reliably as RAG + LLM on free-tier limits.

### What worked

- RAG retrieval layer stayed stable while changing only LLM provider.
- Keeping provider selection in env (`NIH_LLM_PROVIDER`) made switching fast.
- Existing error codes (`LOCAL_RATE_LIMIT`, `UPSTREAM_QUOTA_EXCEEDED`) made debugging much easier.

### What broke

- New Gemini key still returned quota errors in production.
- Model name/provider mismatch caused 502-style failures before better error clarity.

### Root cause

Provider quota and model availability are external constraints and can fail even when app code is correct.

### Fix

- Added provider-aware backend flow (Gemini or Groq) with env-driven switch.
- Added clearer upstream diagnostics and provider/model auth messaging.
- Added ingestion and KB workflow documentation so source updates are predictable.

### Guardrails for next time

- Always verify `Network -> /api/nih/chat -> Response.code` before changing code.
- Treat `UPSTREAM_QUOTA_EXCEEDED` as provider issue first, not frontend issue.

### Next improvement

Add `/api/nih/limits` endpoint so UI can show local rate-limit remaining per hour.

## What I Learned (Template)

## What I Learned - <date>

### Goal

What I wanted to achieve in one sentence.
