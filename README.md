<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d2de5e51-5227-4297-afe6-4a644f8673fd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the full app (frontend + auth API server):
   `npm run dev`

## Auth Notes

- The app now uses a real auth backend with:
  - SQLite user storage (`server/data/auth.sqlite`)
  - password hashing via Node `crypto.scrypt`
  - HTTP-only session cookies
  - email verification and password reset token flow
  - login rate limiting (5 attempts / 15 min per IP+email)
- API server runs on `http://127.0.0.1:3001`
- Vite proxies `/api/*` to the auth server in development

### Email Delivery

- For real email sending, set:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
- Without these vars, verification/reset links are logged to server console (`[email-dev] ...`).

### Useful Scripts

- `npm run dev`: starts frontend and auth server together
- `npm run dev:client`: starts only Vite frontend
- `npm run dev:server`: starts only auth API server
- `npm run build`: builds frontend
- `npm run start`: runs auth server (serves `dist` only in production mode)
