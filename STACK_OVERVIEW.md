# SIBOlytics Stack Overview

Ovaj dokument ukratko objašnjava koje tehnologije koristi aplikacija i za šta tačno služe.

## Frontend

- **React + TypeScript**
  - Glavni UI (stranice, komponente, state, event logika).
  - TypeScript pomaže da se greške uhvate ranije kroz tipove.

- **Vite**
  - Development server i build alat.
  - Pokreće app lokalno i pravi production bundle.

- **Tailwind CSS**
  - Styling kroz utility klase.
  - Koristi se za layout, spacing, boje, responsive dizajn.

- **react-router-dom**
  - Routing između stranica (`/login`, `/signup`, `/home`, itd.).
  - Koristi se i za protected route logiku.

- **lucide-react**
  - Ikone kroz cijeli interfejs.

- **Recharts**
  - Renderovanje breath test grafova.

## Backend

- **Node.js + Express**
  - API server (`/api/*`) i auth logika.
  - Obrada signup/login/logout, verify email, reset password.

- **SQLite (`better-sqlite3`)**
  - Lokalna baza podataka za:
    - korisnike
    - sesije
    - onboarding podatke
  - Fajl baze: `server/data/auth.sqlite`

- **Node `crypto`**
  - `scrypt` za hash lozinki.
  - `sha256` za hash tokena/sesija.

- **HTTP-only cookie session**
  - Sigurniji auth session model (token nije dostupan JS-u u browseru).

## Email sistem

- **Resend (opcionalno)**
  - Za pravi delivery verification/reset emailova.
  - Potrebni env varovi:
    - `RESEND_API_KEY`
    - `RESEND_FROM_EMAIL`

- **Dev fallback**
  - Ako Resend nije konfigurisan, linkovi se ispisuju u backend terminal kao `[email-dev] ...`.

## Data/Feature specifično

- **Breath tests**
  - UI i grafovi su u Reactu.
  - Trenutno se test podaci čuvaju u `localStorage` po korisniku/browseru.

- **Low FODMAP baza**
  - Statični dataset iz `src/data/foods_from_pdf.ts`.
  - Prikaz i filteri su frontend logika.

- **Personal Food Log**
  - Trenutno `localStorage` po korisniku/browseru.

- **NIH Evidence Bot**
  - Frontend chat komponenta + lokalna retrieval logika.
  - Koristi lokalnu NIH bazu fajlova i helper utilse.

## Ukratko arhitektura

1. Browser (React app) zove `/api/*`.
2. Vite proxy u dev-u šalje te pozive na Express server.
3. Express obrađuje auth i čita/piše SQLite.
4. Session cookie drži login stanje korisnika.
