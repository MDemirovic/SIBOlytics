import 'dotenv/config';
import crypto from 'node:crypto';
import express, {NextFunction, Request, Response} from 'express';
import {Pool} from 'pg';

type SafeUser = {
  id: string;
  email: string;
  name: string;
  hasCompletedOnboarding: boolean;
  emailVerified: boolean;
};

type AuthenticatedRequest = Request & {
  user?: SafeUser;
};

const app = express();
app.use(express.json({limit: '1mb'}));

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);
const databaseUrl = process.env.DATABASE_URL;
const sessionCookieName = 'sibolytics_session';
const sessionDurationDays = 7;
const isProduction = process.env.NODE_ENV === 'production';

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL in environment variables.');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const initSql = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE,
  email_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function mapUser(row: any): SafeUser {
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    hasCompletedOnboarding: Boolean(row.has_completed_onboarding),
    emailVerified: Boolean(row.email_verified),
  };
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function createSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getCookieValue(req: Request, cookieName: string): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;

  const parts = raw.split(';');
  for (const part of parts) {
    const [name, ...valueParts] = part.trim().split('=');
    if (name !== cookieName) continue;
    return decodeURIComponent(valueParts.join('='));
  }
  return null;
}

function setSessionCookie(res: Response, token: string) {
  res.cookie(sessionCookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: sessionDurationDays * 24 * 60 * 60 * 1000,
  });
}

function clearSessionCookie(res: Response) {
  res.cookie(sessionCookieName, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

function validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

async function loadUserBySessionToken(token: string): Promise<SafeUser | null> {
  const tokenHash = hashSessionToken(token);
  const result = await pool.query(
    `
    SELECT u.id, u.email, u.name, u.has_completed_onboarding, u.email_verified
    FROM sessions s
    INNER JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = $1 AND s.expires_at > NOW()
    `,
    [tokenHash]
  );

  if (result.rowCount === 0) return null;
  return mapUser(result.rows[0]);
}

async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionToken = getCookieValue(req, sessionCookieName);
  if (!sessionToken) {
    res.status(401).json({success: false, error: 'Not authenticated.'});
    return;
  }

  const user = await loadUserBySessionToken(sessionToken);
  if (!user) {
    clearSessionCookie(res);
    res.status(401).json({success: false, error: 'Session expired.'});
    return;
  }

  req.user = user;
  next();
}

app.get('/api/health', (_req, res) => {
  res.json({ok: true});
});

app.post('/api/auth/signup', async (req, res) => {
  const emailInput = String(req.body?.email ?? '');
  const name = String(req.body?.name ?? '').trim();
  const password = String(req.body?.password ?? '');
  const email = normalizeEmail(emailInput);

  if (!validateEmail(email)) {
    res.status(400).json({success: false, error: 'Please enter a valid email.'});
    return;
  }

  if (!name) {
    res.status(400).json({success: false, error: 'Name is required.'});
    return;
  }

  if (password.length < 8) {
    res.status(400).json({success: false, error: 'Password must be at least 8 characters.'});
    return;
  }

  const existing = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existing.rowCount && existing.rowCount > 0) {
    res.status(409).json({success: false, error: 'An account with this email already exists.'});
    return;
  }

  const passwordHash = hashPassword(password);

  await pool.query(
    `
    INSERT INTO users (email, name, password_hash)
    VALUES ($1, $2, $3)
    `,
    [email, name, passwordHash]
  );

  res.status(201).json({success: true, requiresEmailVerification: false});
});

app.post('/api/auth/login', async (req, res) => {
  const email = normalizeEmail(String(req.body?.email ?? ''));
  const password = String(req.body?.password ?? '');

  const result = await pool.query(
    `
    SELECT id, email, name, password_hash, has_completed_onboarding, email_verified
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (!result.rowCount || result.rowCount === 0) {
    res.status(401).json({success: false, error: 'Invalid email or password.'});
    return;
  }

  const row = result.rows[0];
  const validPassword = verifyPassword(password, String(row.password_hash));

  if (!validPassword) {
    res.status(401).json({success: false, error: 'Invalid email or password.'});
    return;
  }

  const sessionToken = createSessionToken();
  const tokenHash = hashSessionToken(sessionToken);

  await pool.query(
    `
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '${sessionDurationDays} days')
    `,
    [tokenHash, row.id]
  );

  setSessionCookie(res, sessionToken);
  res.json({success: true, user: mapUser(row)});
});

app.get('/api/auth/me', async (req, res) => {
  const sessionToken = getCookieValue(req, sessionCookieName);
  if (!sessionToken) {
    res.status(401).json({success: false});
    return;
  }

  const user = await loadUserBySessionToken(sessionToken);
  if (!user) {
    clearSessionCookie(res);
    res.status(401).json({success: false});
    return;
  }

  res.json({success: true, user});
});

app.post('/api/auth/logout', async (req, res) => {
  const sessionToken = getCookieValue(req, sessionCookieName);
  if (sessionToken) {
    const tokenHash = hashSessionToken(sessionToken);
    await pool.query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash]);
  }

  clearSessionCookie(res);
  res.json({success: true});
});

app.post('/api/auth/complete-onboarding', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({success: false, error: 'Not authenticated.'});
    return;
  }

  const data = req.body ?? {};
  await pool.query(
    `
    UPDATE users
    SET has_completed_onboarding = TRUE, updated_at = NOW()
    WHERE id = $1
    `,
    [req.user.id]
  );

  await pool.query(
    `
    INSERT INTO onboarding_profiles (user_id, data, updated_at)
    VALUES ($1, $2::jsonb, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `,
    [req.user.id, JSON.stringify(data)]
  );

  const refreshed = await pool.query(
    `
    SELECT id, email, name, has_completed_onboarding, email_verified
    FROM users
    WHERE id = $1
    `,
    [req.user.id]
  );

  res.json({success: true, user: mapUser(refreshed.rows[0])});
});

app.delete('/api/auth/account', requireAuth, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({success: false, error: 'Not authenticated.'});
    return;
  }

  await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
  clearSessionCookie(res);
  res.json({success: true});
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({success: false, error: 'Server error.'});
});

async function startServer() {
  await pool.query(initSql);
  app.listen(port, () => {
    console.log(`API listening on http://127.0.0.1:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start API server:', error);
  process.exit(1);
});
