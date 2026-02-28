# SIBOlytics

SIBOlytics is a web app for people tracking SIBO-related data: breath tests, food tolerance, and educational insights in one place.

## Features

- Secure authentication backend (Express + SQLite)
- Signup and login with hashed passwords
- Email verification flow
- Forgot/reset password flow
- Login rate limiting protection
- Breath test upload/manual entry and chart visualization
- Educational interpretation for selected breath tests
- Low FODMAP database browsing and filtering
- Personal food log (symptom/trigger tracking)

## Current Data Model

- **Auth and account data**: stored in backend SQLite (`server/data/auth.sqlite`)
- **Breath tests and food log**: currently stored in browser localStorage per user session/device

> Note: breath test and food log data are not yet synced across devices.  
> Planned next step is full backend storage for these modules.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind, Recharts
- Backend: Node.js, Express
- Database: SQLite (`better-sqlite3`)
- Email: Resend (optional, with dev fallback logs)

## Getting Started

### 1) Install
```bash
npm install
