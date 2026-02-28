import express from 'express';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'auth.sqlite');
const SESSION_COOKIE_NAME = 'sibolytics_session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const isProduction = process.env.NODE_ENV === 'production';
const scryptAsync = promisify(crypto.scrypt);
const loginAttempts = new Map();
const crossSiteCookies = process.env.CROSS_SITE_COOKIES === 'true';

// Load backend env vars from local files when available.
dotenv.config({ path: path.join(ROOT_DIR, '.env.local') });
dotenv.config({ path: path.join(ROOT_DIR, '.env') });

function isEmailVerificationRequired() {
  if (process.env.EMAIL_VERIFICATION_REQUIRED === 'true') return true;
  if (process.env.EMAIL_VERIFICATION_REQUIRED === 'false') return false;
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

const emailVerificationRequired = isEmailVerificationRequired();

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    has_completed_onboarding INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS onboarding_data (
    user_id INTEGER PRIMARY KEY,
    data_json TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
`);

function ensureUserColumn(columnName, definitionSql) {
  const existing = db.prepare(`PRAGMA table_info(users)`).all();
  const hasColumn = existing.some((column) => column.name === columnName);
  if (!hasColumn) {
    db.exec(`ALTER TABLE users ADD COLUMN ${columnName} ${definitionSql}`);
  }
}

ensureUserColumn('email_verified', 'INTEGER NOT NULL DEFAULT 1');
ensureUserColumn('email_verify_token_hash', 'TEXT');
ensureUserColumn('email_verify_expires_at', 'INTEGER');
ensureUserColumn('password_reset_token_hash', 'TEXT');
ensureUserColumn('password_reset_expires_at', 'INTEGER');

const statements = {
  getUserByEmail: db.prepare(`
    SELECT id, email, name, password_hash, has_completed_onboarding, email_verified
    FROM users
    WHERE email = ?
  `),
  getUserById: db.prepare(`
    SELECT id, email, name, has_completed_onboarding, email_verified
    FROM users
    WHERE id = ?
  `),
  insertUser: db.prepare(`
    INSERT INTO users (
      email,
      name,
      password_hash,
      has_completed_onboarding,
      email_verified,
      email_verify_token_hash,
      email_verify_expires_at,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?)
  `),
  setEmailVerifyToken: db.prepare(`
    UPDATE users
    SET email_verify_token_hash = ?, email_verify_expires_at = ?, updated_at = ?
    WHERE id = ?
  `),
  getUserByEmailVerifyToken: db.prepare(`
    SELECT id, email, name, has_completed_onboarding, email_verified
    FROM users
    WHERE email_verify_token_hash = ? AND email_verify_expires_at > ?
  `),
  markEmailVerified: db.prepare(`
    UPDATE users
    SET email_verified = 1, email_verify_token_hash = NULL, email_verify_expires_at = NULL, updated_at = ?
    WHERE id = ?
  `),
  setPasswordResetToken: db.prepare(`
    UPDATE users
    SET password_reset_token_hash = ?, password_reset_expires_at = ?, updated_at = ?
    WHERE id = ?
  `),
  getUserByPasswordResetToken: db.prepare(`
    SELECT id, email
    FROM users
    WHERE password_reset_token_hash = ? AND password_reset_expires_at > ?
  `),
  updatePasswordWithReset: db.prepare(`
    UPDATE users
    SET password_hash = ?, password_reset_token_hash = NULL, password_reset_expires_at = NULL, updated_at = ?
    WHERE id = ?
  `),
  updateOnboarding: db.prepare(`
    UPDATE users
    SET has_completed_onboarding = 1, updated_at = ?
    WHERE id = ?
  `),
  upsertOnboardingData: db.prepare(`
    INSERT INTO onboarding_data (user_id, data_json, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      data_json = excluded.data_json,
      updated_at = excluded.updated_at
  `),
  insertSession: db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `),
  getSessionWithUser: db.prepare(`
    SELECT
      s.id AS session_id,
      s.user_id AS session_user_id,
      s.expires_at AS session_expires_at,
      u.id AS id,
      u.email AS email,
      u.name AS name,
      u.has_completed_onboarding AS has_completed_onboarding,
      u.email_verified AS email_verified
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.id = ? AND s.expires_at > ?
  `),
  deleteSession: db.prepare(`DELETE FROM sessions WHERE id = ?`),
  deleteAllUserSessions: db.prepare(`DELETE FROM sessions WHERE user_id = ?`),
  cleanupExpiredSessions: db.prepare(`DELETE FROM sessions WHERE expires_at <= ?`),
  deleteUser: db.prepare(`DELETE FROM users WHERE id = ?`),
};

function mapUser(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    email: row.email,
    name: row.name,
    hasCompletedOnboarding: Boolean(row.has_completed_onboarding),
    emailVerified: Boolean(row.email_verified),
  };
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isStrongEnoughPassword(value) {
  return typeof value === 'string' && value.length >= 8 && value.length <= 128;
}

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, pair) => {
    const index = pair.indexOf('=');
    if (index === -1) return acc;
    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (key) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scryptAsync(password, salt, 64);
  return `${salt}:${Buffer.from(derived).toString('hex')}`;
}

async function verifyPassword(password, passwordHash) {
  const [salt, storedHash] = String(passwordHash || '').split(':');
  if (!salt || !storedHash) return false;
  const derived = await scryptAsync(password, salt, 64);
  const derivedBuffer = Buffer.from(derived);
  const storedBuffer = Buffer.from(storedHash, 'hex');
  if (derivedBuffer.length !== storedBuffer.length) return false;
  return crypto.timingSafeEqual(derivedBuffer, storedBuffer);
}

function buildAppBaseUrl(req) {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  const origin = req?.headers?.origin;
  if (origin) return String(origin).replace(/\/$/, '');
  return 'http://127.0.0.1:3000';
}

function buildAllowedOrigins() {
  const defaults = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const fromEnv = String(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const appUrl = String(process.env.APP_URL || '').trim();
  const allOrigins = [...defaults, ...fromEnv, appUrl]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ''));
  return new Set(allOrigins);
}

function isLoginRateLimited(key) {
  const state = loginAttempts.get(key);
  if (!state) return { limited: false, retryAfterMs: 0 };
  const now = Date.now();
  if (now > state.windowStart + LOGIN_WINDOW_MS) {
    loginAttempts.delete(key);
    return { limited: false, retryAfterMs: 0 };
  }
  if (state.count >= LOGIN_MAX_ATTEMPTS) {
    return {
      limited: true,
      retryAfterMs: state.windowStart + LOGIN_WINDOW_MS - now,
    };
  }
  return { limited: false, retryAfterMs: 0 };
}

function registerLoginFailure(key) {
  const now = Date.now();
  const state = loginAttempts.get(key);
  if (!state || now > state.windowStart + LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, windowStart: now });
    return;
  }
  state.count += 1;
  loginAttempts.set(key, state);
}

function clearLoginFailures(key) {
  loginAttempts.delete(key);
}

async function sendEmail({ to, subject, html, text }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (resendApiKey && fromEmail) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html,
        text,
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Resend API failed: ${response.status} ${body}`);
    }
    return;
  }

  console.log(`[email-dev] To: ${to}`);
  console.log(`[email-dev] Subject: ${subject}`);
  console.log(`[email-dev] Body: ${text}`);
}

function createVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function issueEmailVerification(user, req) {
  const token = createVerificationToken();
  const tokenHash = hashToken(token);
  const now = Date.now();
  const expiresAt = now + EMAIL_VERIFY_TTL_MS;
  statements.setEmailVerifyToken.run(tokenHash, expiresAt, now, Number(user.id));

  const verifyUrl = `${buildAppBaseUrl(req)}/verify-email?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your SIBOlytics account',
    text: `Verify your account by opening this link: ${verifyUrl}`,
    html: `<p>Verify your account by clicking <a href="${verifyUrl}">this link</a>.</p>`,
  });
}

async function issuePasswordReset(user, req) {
  const token = createVerificationToken();
  const tokenHash = hashToken(token);
  const now = Date.now();
  const expiresAt = now + PASSWORD_RESET_TTL_MS;
  statements.setPasswordResetToken.run(tokenHash, expiresAt, now, Number(user.id));

  const resetUrl = `${buildAppBaseUrl(req)}/reset-password?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your SIBOlytics password',
    text: `Reset your password by opening this link: ${resetUrl}`,
    html: `<p>Reset your password by clicking <a href="${resetUrl}">this link</a>.</p>`,
  });
}

function createSession(res, userId) {
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = hashToken(token);

  statements.insertSession.run(sessionId, userId, expiresAt, now);
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction || crossSiteCookies,
    sameSite: crossSiteCookies ? 'none' : 'lax',
    path: '/',
    expires: new Date(expiresAt),
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction || crossSiteCookies,
    sameSite: crossSiteCookies ? 'none' : 'lax',
    path: '/',
  });
}

function resolveAuthUser(req) {
  const cookies = parseCookies(req.headers.cookie);
  const rawToken = cookies[SESSION_COOKIE_NAME];
  if (!rawToken) return null;

  const hashed = hashToken(rawToken);
  const row = statements.getSessionWithUser.get(hashed, Date.now());
  if (!row) return null;

  return {
    sessionId: row.session_id,
    userId: row.session_user_id,
    user: mapUser(row),
  };
}

function requireAuth(req, res, next) {
  const auth = resolveAuthUser(req);
  if (!auth) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.auth = auth;
  next();
}

const app = express();
app.use(express.json({ limit: '1mb' }));

const allowedOrigins = buildAllowedOrigins();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const normalizedOrigin = origin ? String(origin).replace(/\/$/, '') : '';
  if (normalizedOrigin && allowedOrigins.has(normalizedOrigin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.header('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/auth/me', (req, res) => {
  statements.cleanupExpiredSessions.run(Date.now());
  const auth = resolveAuthUser(req);
  res.json({ user: auth?.user ?? null });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const name = String(req.body?.name || '').trim();
    const password = String(req.body?.password || '');

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Enter a valid email address.' });
      return;
    }
    if (name.length < 2 || name.length > 80) {
      res.status(400).json({ error: 'Name must be between 2 and 80 characters.' });
      return;
    }
    if (!isStrongEnoughPassword(password)) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }

    const existing = statements.getUserByEmail.get(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const now = Date.now();
    const passwordHash = await hashPassword(password);
    const verificationToken = emailVerificationRequired ? createVerificationToken() : null;
    const verificationTokenHash = verificationToken ? hashToken(verificationToken) : null;
    const verificationExpiresAt = verificationToken ? now + EMAIL_VERIFY_TTL_MS : null;

    const result = statements.insertUser.run(
      email,
      name,
      passwordHash,
      emailVerificationRequired ? 0 : 1,
      verificationTokenHash,
      verificationExpiresAt,
      now,
      now
    );
    const userRow = statements.getUserById.get(result.lastInsertRowid);
    const user = mapUser(userRow);

    if (verificationToken) {
      const verifyUrl = `${buildAppBaseUrl(req)}/verify-email?token=${encodeURIComponent(verificationToken)}`;
      await sendEmail({
        to: email,
        subject: 'Verify your SIBOlytics account',
        text: `Verify your account by opening this link: ${verifyUrl}`,
        html: `<p>Verify your account by clicking <a href="${verifyUrl}">this link</a>.</p>`,
      });
    }

    res.status(201).json({
      user,
      requiresEmailVerification: emailVerificationRequired,
      message: emailVerificationRequired
        ? 'Account created. Check your email to verify your account.'
        : 'Account created. You can now log in.',
    });
  } catch (error) {
    console.error('Signup failed:', error);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    if (!emailVerificationRequired) {
      res.json({ message: 'Email verification is disabled for this environment.' });
      return;
    }

    const email = normalizeEmail(req.body?.email);
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Enter a valid email address.' });
      return;
    }

    const row = statements.getUserByEmail.get(email);
    if (row && !row.email_verified) {
      await issueEmailVerification(row, req);
    }

    res.json({ message: 'If this email exists, a verification link was sent.' });
  } catch (error) {
    console.error('Resend verification failed:', error);
    res.status(500).json({ error: 'Could not resend verification email right now.' });
  }
});

app.post('/api/auth/verify-email', (req, res) => {
  try {
    if (!emailVerificationRequired) {
      res.json({ message: 'Email verification is disabled for this environment.' });
      return;
    }

    const token = String(req.body?.token || '').trim();
    if (!token) {
      res.status(400).json({ error: 'Verification token is missing.' });
      return;
    }

    const tokenHash = hashToken(token);
    const user = statements.getUserByEmailVerifyToken.get(tokenHash, Date.now());
    if (!user) {
      res.status(400).json({ error: 'Verification link is invalid or expired.' });
      return;
    }

    statements.markEmailVerified.run(Date.now(), user.id);
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Email verification failed:', error);
    res.status(500).json({ error: 'Email verification failed. Please try again.' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Enter a valid email address.' });
      return;
    }

    const row = statements.getUserByEmail.get(email);
    if (row) {
      await issuePasswordReset(row, req);
    }

    res.json({ message: 'If this email exists, a reset link was sent.' });
  } catch (error) {
    console.error('Forgot password failed:', error);
    res.status(500).json({ error: 'Could not start password reset right now.' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const token = String(req.body?.token || '').trim();
    const password = String(req.body?.password || '');
    if (!token) {
      res.status(400).json({ error: 'Reset token is missing.' });
      return;
    }
    if (!isStrongEnoughPassword(password)) {
      res.status(400).json({ error: 'Password must be at least 8 characters.' });
      return;
    }

    const tokenHash = hashToken(token);
    const row = statements.getUserByPasswordResetToken.get(tokenHash, Date.now());
    if (!row) {
      res.status(400).json({ error: 'Reset link is invalid or expired.' });
      return;
    }

    const nextHash = await hashPassword(password);
    statements.updatePasswordWithReset.run(nextHash, Date.now(), row.id);
    statements.deleteAllUserSessions.run(row.id);
    clearSessionCookie(res);

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password failed:', error);
    res.status(500).json({ error: 'Could not reset password right now.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');
    const limiterKey = `${req.ip || 'unknown'}:${email}`;

    if (!isValidEmail(email) || !password) {
      res.status(400).json({ error: 'Enter email and password.' });
      return;
    }

    const limitState = isLoginRateLimited(limiterKey);
    if (limitState.limited) {
      const retryAfterSeconds = Math.max(1, Math.ceil(limitState.retryAfterMs / 1000));
      res.setHeader('Retry-After', String(retryAfterSeconds));
      res.status(429).json({
        error: `Too many login attempts. Try again in ${retryAfterSeconds} seconds.`,
        code: 'RATE_LIMITED',
      });
      return;
    }

    const row = statements.getUserByEmail.get(email);
    if (!row) {
      registerLoginFailure(limiterKey);
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    if (emailVerificationRequired && !row.email_verified) {
      res.status(403).json({
        error: 'Please verify your email before logging in.',
        code: 'EMAIL_NOT_VERIFIED',
      });
      return;
    }

    const isValid = await verifyPassword(password, row.password_hash);
    if (!isValid) {
      registerLoginFailure(limiterKey);
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    clearLoginFailures(limiterKey);
    statements.deleteAllUserSessions.run(row.id);
    createSession(res, row.id);
    res.json({ user: mapUser(row) });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const auth = resolveAuthUser(req);
  if (auth) {
    statements.deleteSession.run(auth.sessionId);
  }
  clearSessionCookie(res);
  res.sendStatus(204);
});

app.post('/api/auth/onboarding', requireAuth, (req, res) => {
  const now = Date.now();
  const userId = Number(req.auth.userId);
  const payload = req.body?.data ?? null;

  statements.updateOnboarding.run(now, userId);
  statements.upsertOnboardingData.run(userId, JSON.stringify(payload), now);
  const updatedUser = mapUser(statements.getUserById.get(userId));
  res.json({ user: updatedUser });
});

app.delete('/api/auth/account', requireAuth, (req, res) => {
  statements.deleteUser.run(Number(req.auth.userId));
  clearSessionCookie(res);
  res.sendStatus(204);
});

if (isProduction) {
  const distDir = path.join(ROOT_DIR, 'dist');
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }
}

export function startAuthServer(port = Number(process.env.API_PORT || 3001)) {
  return app.listen(port, () => {
    console.log(`Auth server running on http://127.0.0.1:${port}`);
    const usingResend = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
    console.log(usingResend ? 'Email mode: Resend delivery enabled' : 'Email mode: dev console logs ([email-dev])');
  });
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);

if (isDirectRun) {
  startAuthServer();
}
