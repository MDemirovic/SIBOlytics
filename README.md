# SIBOlytics

## What is SIBOlytics?

SIBOlytics is a web app for tracking breath tests, symptoms, and useful medical knowledge about SIBO.

I built this because I had this diagnosis myself and I know how exhausting, difficult, and painful it can be.
The goal is to help both people living with SIBO and doctors: reduce symptoms as much as possible and make learning about SIBO easier.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- Containerization: Docker, Docker Compose
- Deploy: Render
- AI/RAG: NIH-only retrieval with LLM API integration

## Key Features

- Symptom tracking and daily gut health logging
- Breath test entry, storage, and interpretation support
- NIH-based evidence retrieval for more trustworthy health information
- OCR-assisted breath test extraction from JPG and PNG images
- User authentication, onboarding, and account-specific dashboards
- PostgreSQL-to-MongoDB migration support for older project data

## Why This Project Matters To Me

This project is personal. I did not build it as a generic CRUD demo, but as something directly connected to a real health experience that affected my life.

Because of that, I wanted the app to be useful in two ways:

- for patients, by making symptom tracking and test organization less overwhelming
- for doctors, by making relevant SIBO-related information easier to access and review

## Run Locally

1. Install dependencies:

```bash
npm ci
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Set at least the required variables in `.env`:

- `MONGODB_URI` for your MongoDB connection
- one NIH provider key:
  `GROQ_API_KEY` if `NIH_LLM_PROVIDER=groq`
  or `GEMINI_API_KEY` if `NIH_LLM_PROVIDER=gemini`
- `MISTRAL_API_KEY` only if you want OCR for breath test images

4. Run backend:

```bash
npm run dev:server
```

5. Run frontend:

```bash
npm run dev:client
```

6. Open:

```text
http://localhost:3000
```

The Vite dev server runs on port `3000`, while the API runs on port `3001`.

## Environment Variables

Create `.env` from `.env.example` and configure what you need for your setup.

### Required

- `MONGODB_URI`: MongoDB connection string used by the backend

### Recommended For Full Functionality

- `NIH_LLM_PROVIDER`: `groq` or `gemini`
- `GROQ_API_KEY`: required when using Groq for NIH chat
- `GEMINI_API_KEY`: required when using Gemini for NIH chat
- `MISTRAL_API_KEY`: required for OCR-based breath test extraction

### Optional

- `API_PORT`: backend port, defaults to `3001`
- `MONGODB_DB_NAME`: database name, defaults to `sibolytics`
- `API_JSON_LIMIT`: request size limit for larger OCR payloads
- `NIH_TOP_K`, `NIH_MAX_CONTEXT_CHARS`, `NIH_MAX_QPS_PER_USER`, `NIH_MAX_REQ_PER_HOUR`: tuning values for NIH retrieval
- `BREATH_OCR_MODEL`, `BREATH_OCR_TIMEOUT_MS`, `BREATH_OCR_MAX_IMAGE_MB`, `BREATH_OCR_MAX_REQ_PER_HOUR`: OCR tuning
- `LEGACY_DATABASE_URL`: old PostgreSQL connection for one-time migration
- `NODE_ENV`: production flag used in deployment
- `VITE_BASE_URL`: frontend base path for deployed builds

## Run With Docker

Build and run only the application container:

```bash
docker build -t sibolytics .
docker run --env-file .env -p 3001:3001 sibolytics
```

Then open:

```text
http://localhost:3001
```

## Run With Docker Compose

If you want to run the full local stack with the app and a MongoDB container together:

```bash
docker compose up --build
```

This starts:

- `sibolytics-app`
- `sibolytics-mongo`

To stop everything:

```bash
docker compose down
```

## Migrate Existing PostgreSQL Data To MongoDB

If you already have existing data in PostgreSQL, run the migration script once.

1. Keep your old PostgreSQL connection in `LEGACY_DATABASE_URL` (or `DATABASE_URL`).
2. Set MongoDB target in `MONGODB_URI` (and optional `MONGODB_DB_NAME`).
3. Run:

```bash
npm run migrate:postgres-to-mongo
```

4. Start backend normally:

```bash
npm run dev:server
```

## What I Learned

- How to use and integrate frameworks in a real full-stack project
- How to manage a cloud database with Neon and MongoDB
- How to publish/deploy a web app with Render
- How to implement RAG using verified sources with llama3.1 Groq LLM (like NIH)
- How API works and why it is important
- How to switch and translate data/databases
- Docker basics
