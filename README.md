# SIBOlytics

## What is SIBOlytics?

SIBOlytics is a web app for tracking breath tests, symptoms, and useful medical knowledge about SIBO.

I built this because I had this diagnosis myself and I know how exhausting, difficult, and painful it can be.
The goal is to help both people living with SIBO and doctors: reduce symptoms as much as possible and make learning about SIBO easier.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL (Neon)
- Deploy: Render
- AI/RAG: NIH-only retrieval with LLM API integration

## Run Locally

1. Install dependencies:

```bash
npm ci
```

2. Create `.env` from `.env.example` and set required values (database URL and API keys).

3. Run backend:

```bash
npm run dev:server
```

4. Run frontend:

```bash
npm run dev:client
```

5. Open:

```text
http://localhost:3000
```

## What I Learned

- How to use and integrate frameworks in a real full-stack project
- How to manage a cloud database with Neon
- How to publish/deploy a web app with Render
- How to implement RAG using verified sources with llama3.1 Groq LLM (like NIH)
- How API keys work and why they are important
