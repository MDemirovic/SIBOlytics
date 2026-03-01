# SIBOlytics

SIBOlytics is a frontend-only preview app for tracking SIBO-related data: breath tests, food tolerance, and educational insights in one place.

## Features

- Preview signup and login (local, no backend)
- Onboarding flow with suspected trigger capture
- Breath test upload/manual entry and chart visualization
- Low FODMAP database browsing and filtering
- Personal food log (symptom/trigger tracking)
- NIH Evidence Bot with local retrieval and citations

## Current Data Model

- **Auth and account data**: stored in browser localStorage (per device)
- **Breath tests and food log**: stored in browser localStorage (per user)
- **NIH knowledge base**: static JSON cache bundled at build time

> Note: data is not synced across devices and can be cleared by the user at any time.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind, Recharts
- Local storage: browser localStorage
- Retrieval: simple local term matching against cached NIH sources

## Getting Started

### 1) Install
```bash
npm install
```

### 2) Run locally
```bash
npm run dev
```

## Deployment (GitHub Pages)

This project is configured to deploy with GitHub Actions. The base URL is set automatically for GitHub Pages builds.

Environment variables (optional):
```env
VITE_BASE_URL=/SIBOlytics/
```

If you change the repo name, the GitHub Actions workflow sets the correct base path automatically.
