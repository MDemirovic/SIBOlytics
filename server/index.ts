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

type SymptomScores = {
  pain: number;
  stress: number;
  sleep: number;
  stool: number;
  bloating: number;
  diarrhea: number;
  energy: number;
};

type FoodStatus = 'safe' | 'caution' | 'trigger';
type BreathSubstrate = 'glucose' | 'lactulose' | 'unknown';
type BreathUnits = 'ppm';
type BreathPointInput = {
  minute: number;
  h2: number;
  ch4: number;
  h2s?: number;
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

CREATE TABLE IF NOT EXISTS symptom_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  pain SMALLINT NOT NULL,
  stress SMALLINT NOT NULL,
  sleep SMALLINT NOT NULL,
  stool SMALLINT NOT NULL,
  bloating SMALLINT NOT NULL,
  diarrhea SMALLINT NOT NULL,
  energy SMALLINT NOT NULL,
  overall_gut SMALLINT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, entry_date)
);

CREATE TABLE IF NOT EXISTS food_log_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('safe', 'caution', 'trigger')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS breath_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_date DATE,
  substrate TEXT NOT NULL CHECK (substrate IN ('glucose', 'lactulose', 'unknown')),
  units TEXT NOT NULL CHECK (units IN ('ppm')),
  notes TEXT NOT NULL DEFAULT '',
  file_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS breath_test_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES breath_tests(id) ON DELETE CASCADE,
  minute INTEGER NOT NULL,
  h2 NUMERIC NOT NULL,
  ch4 NUMERIC NOT NULL,
  h2s NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_symptom_entries_user_date
ON symptom_entries (user_id, entry_date DESC);

CREATE INDEX IF NOT EXISTS idx_food_log_entries_user_created
ON food_log_entries (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_breath_tests_user_created
ON breath_tests (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_breath_test_points_test_minute
ON breath_test_points (test_id, minute ASC);
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

function isDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function clampScore(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const rounded = Math.round(parsed);
  if (rounded < 1 || rounded > 10) return null;
  return rounded;
}

function clampNonNegative(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 0) return null;
  return parsed;
}

function normalizeNotes(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, 4000);
}

function parseSymptomScores(payload: any): SymptomScores | null {
  const pain = clampScore(payload?.pain);
  const stress = clampScore(payload?.stress);
  const sleep = clampScore(payload?.sleep);
  const stool = clampScore(payload?.stool);
  const bloating = clampScore(payload?.bloating);
  const diarrhea = clampScore(payload?.diarrhea);
  const energy = clampScore(payload?.energy);

  if (
    pain === null ||
    stress === null ||
    sleep === null ||
    stool === null ||
    bloating === null ||
    diarrhea === null ||
    energy === null
  ) {
    return null;
  }

  return {pain, stress, sleep, stool, bloating, diarrhea, energy};
}

function calculateOverallGut(scores: SymptomScores): number {
  const total =
    scores.pain +
    scores.stress +
    scores.sleep +
    scores.stool +
    scores.bloating +
    scores.diarrhea +
    scores.energy;
  return Math.round(total / 7);
}

function parseFoodStatus(value: unknown): FoodStatus | null {
  if (value === 'safe' || value === 'caution' || value === 'trigger') {
    return value;
  }
  return null;
}

function parseSubstrate(value: unknown): BreathSubstrate | null {
  if (value === 'glucose' || value === 'lactulose' || value === 'unknown') {
    return value;
  }
  return null;
}

function parseUnits(value: unknown): BreathUnits | null {
  if (value === 'ppm') return value;
  return null;
}

function parseBreathPoints(input: unknown): BreathPointInput[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const points: BreathPointInput[] = [];

  for (const item of input) {
    const minute = clampNonNegative((item as any)?.minute);
    const h2 = clampNonNegative((item as any)?.h2);
    const ch4 = clampNonNegative((item as any)?.ch4);
    const rawH2s = (item as any)?.h2s;
    const h2s = rawH2s === undefined || rawH2s === null ? undefined : clampNonNegative(rawH2s);

    if (minute === null || h2 === null || ch4 === null || h2s === null) {
      return null;
    }

    points.push({minute, h2, ch4, h2s});
  }

  points.sort((a, b) => a.minute - b.minute);
  return points;
}

function requireUser(req: AuthenticatedRequest, res: Response): SafeUser | null {
  if (!req.user) {
    res.status(401).json({success: false, error: 'Not authenticated.'});
    return null;
  }
  return req.user;
}

function toDateKey(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (isDateKey(trimmed)) return trimmed;
    if (trimmed.length >= 10 && isDateKey(trimmed.slice(0, 10))) return trimmed.slice(0, 10);
    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) return null;
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }

  return null;
}

function mapSymptomRow(row: any) {
  const dateKey = toDateKey(row.entry_date) ?? toDateKey(row.date) ?? toDateKey(new Date())!;

  return {
    id: String(row.id),
    userId: String(row.user_id),
    date: dateKey,
    pain: Number(row.pain),
    stress: Number(row.stress),
    sleep: Number(row.sleep),
    stool: Number(row.stool),
    bloating: Number(row.bloating),
    diarrhea: Number(row.diarrhea),
    energy: Number(row.energy),
    overallGut: Number(row.overall_gut),
    notes: String(row.notes ?? ''),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function mapFoodRow(row: any) {
  return {
    id: String(row.id),
    name: String(row.name),
    amount: String(row.amount),
    status: String(row.status) as FoodStatus,
    notes: String(row.notes ?? ''),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapBreathTestRow(row: any, points: BreathPointInput[]) {
  const testDate = toDateKey(row.test_date) ?? undefined;

  return {
    id: String(row.id),
    createdAt: new Date(row.created_at).toISOString(),
    testDate,
    substrate: String(row.substrate) as BreathSubstrate,
    units: String(row.units) as BreathUnits,
    notes: String(row.notes ?? ''),
    fileName: String(row.file_name ?? ''),
    data: points.map((point) => ({
      minute: Number(point.minute),
      h2: Number(point.h2),
      ch4: Number(point.ch4),
      ...(point.h2s !== undefined ? {h2s: Number(point.h2s)} : {}),
    })),
  };
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
  const user = requireUser(req, res);
  if (!user) return;

  const data = req.body ?? {};
  await pool.query(
    `
    UPDATE users
    SET has_completed_onboarding = TRUE, updated_at = NOW()
    WHERE id = $1
    `,
    [user.id]
  );

  await pool.query(
    `
    INSERT INTO onboarding_profiles (user_id, data, updated_at)
    VALUES ($1, $2::jsonb, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `,
    [user.id, JSON.stringify(data)]
  );

  const refreshed = await pool.query(
    `
    SELECT id, email, name, has_completed_onboarding, email_verified
    FROM users
    WHERE id = $1
    `,
    [user.id]
  );

  res.json({success: true, user: mapUser(refreshed.rows[0])});
});

app.get('/api/onboarding', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const result = await pool.query(
    `
    SELECT data
    FROM onboarding_profiles
    WHERE user_id = $1
    `,
    [user.id]
  );

  const data = result.rowCount && result.rows[0]?.data ? result.rows[0].data : {};
  res.json({success: true, data});
});

app.get('/api/symptoms', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const result = await pool.query(
    `
    SELECT id, user_id, entry_date, pain, stress, sleep, stool, bloating, diarrhea, energy, overall_gut, notes, created_at, updated_at
    FROM symptom_entries
    WHERE user_id = $1
    ORDER BY entry_date DESC, updated_at DESC
    `,
    [user.id]
  );

  res.json({
    success: true,
    data: result.rows.map((row) => mapSymptomRow(row)),
  });
});

app.put('/api/symptoms/:date', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const date = String(req.params.date ?? '');
  if (!isDateKey(date)) {
    res.status(400).json({success: false, error: 'Invalid date format. Use YYYY-MM-DD.'});
    return;
  }

  const scores = parseSymptomScores(req.body);
  if (!scores) {
    res.status(400).json({success: false, error: 'Invalid symptom scores. Expected values from 1 to 10.'});
    return;
  }

  const notes = normalizeNotes(req.body?.notes);
  const overallGut = calculateOverallGut(scores);

  const result = await pool.query(
    `
    INSERT INTO symptom_entries (
      user_id, entry_date, pain, stress, sleep, stool, bloating, diarrhea, energy, overall_gut, notes, updated_at
    )
    VALUES ($1, $2::date, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
    ON CONFLICT (user_id, entry_date)
    DO UPDATE SET
      pain = EXCLUDED.pain,
      stress = EXCLUDED.stress,
      sleep = EXCLUDED.sleep,
      stool = EXCLUDED.stool,
      bloating = EXCLUDED.bloating,
      diarrhea = EXCLUDED.diarrhea,
      energy = EXCLUDED.energy,
      overall_gut = EXCLUDED.overall_gut,
      notes = EXCLUDED.notes,
      updated_at = NOW()
    RETURNING id, user_id, entry_date, pain, stress, sleep, stool, bloating, diarrhea, energy, overall_gut, notes, created_at, updated_at
    `,
    [
      user.id,
      date,
      scores.pain,
      scores.stress,
      scores.sleep,
      scores.stool,
      scores.bloating,
      scores.diarrhea,
      scores.energy,
      overallGut,
      notes,
    ]
  );

  res.json({success: true, data: mapSymptomRow(result.rows[0])});
});

app.delete('/api/symptoms/:date', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const date = String(req.params.date ?? '');
  if (!isDateKey(date)) {
    res.status(400).json({success: false, error: 'Invalid date format. Use YYYY-MM-DD.'});
    return;
  }

  await pool.query(
    `
    DELETE FROM symptom_entries
    WHERE user_id = $1 AND entry_date = $2::date
    `,
    [user.id, date]
  );

  res.json({success: true});
});

app.get('/api/food-logs', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const result = await pool.query(
    `
    SELECT id, name, amount, status, notes, created_at
    FROM food_log_entries
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [user.id]
  );

  res.json({
    success: true,
    data: result.rows.map((row) => mapFoodRow(row)),
  });
});

app.post('/api/food-logs', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const amount = typeof req.body?.amount === 'string' ? req.body.amount.trim() : '';
  const status = parseFoodStatus(req.body?.status);
  const notes = normalizeNotes(req.body?.notes);

  if (!name) {
    res.status(400).json({success: false, error: 'Food name is required.'});
    return;
  }

  if (!amount) {
    res.status(400).json({success: false, error: 'Amount is required.'});
    return;
  }

  if (!status) {
    res.status(400).json({success: false, error: 'Invalid food status.'});
    return;
  }

  const result = await pool.query(
    `
    INSERT INTO food_log_entries (user_id, name, amount, status, notes)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, amount, status, notes, created_at
    `,
    [user.id, name, amount, status, notes]
  );

  res.status(201).json({success: true, data: mapFoodRow(result.rows[0])});
});

app.delete('/api/food-logs/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const id = String(req.params.id ?? '');
  const result = await pool.query(
    `
    DELETE FROM food_log_entries
    WHERE id = $1 AND user_id = $2
    RETURNING id
    `,
    [id, user.id]
  );

  if (!result.rowCount) {
    res.status(404).json({success: false, error: 'Food log entry not found.'});
    return;
  }

  res.json({success: true});
});

app.get('/api/breath-tests', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const testsResult = await pool.query(
    `
    SELECT id, test_date, substrate, units, notes, file_name, created_at
    FROM breath_tests
    WHERE user_id = $1
    ORDER BY COALESCE(test_date, created_at::date) DESC, created_at DESC
    `,
    [user.id]
  );

  if (!testsResult.rowCount) {
    res.json({success: true, data: []});
    return;
  }

  const testIds = testsResult.rows.map((row) => row.id);
  const pointsResult = await pool.query(
    `
    SELECT test_id, minute, h2, ch4, h2s
    FROM breath_test_points
    WHERE test_id = ANY($1::uuid[])
    ORDER BY minute ASC, created_at ASC
    `,
    [testIds]
  );

  const pointsMap = new Map<string, BreathPointInput[]>();
  for (const row of pointsResult.rows) {
    const key = String(row.test_id);
    const list = pointsMap.get(key) ?? [];
    list.push({
      minute: Number(row.minute),
      h2: Number(row.h2),
      ch4: Number(row.ch4),
      ...(row.h2s !== null && row.h2s !== undefined ? {h2s: Number(row.h2s)} : {}),
    });
    pointsMap.set(key, list);
  }

  const tests = testsResult.rows.map((row) =>
    mapBreathTestRow(row, pointsMap.get(String(row.id)) ?? [])
  );
  res.json({success: true, data: tests});
});

app.post('/api/breath-tests', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const substrate = parseSubstrate(req.body?.substrate);
  const units = parseUnits(req.body?.units);
  const data = parseBreathPoints(req.body?.data);
  const notes = normalizeNotes(req.body?.notes);
  const fileName = typeof req.body?.fileName === 'string' ? req.body.fileName.trim().slice(0, 512) : '';
  const testDateRaw = req.body?.testDate;
  const testDate =
    typeof testDateRaw === 'string' && isDateKey(testDateRaw.trim())
      ? testDateRaw.trim()
      : null;

  if (!substrate) {
    res.status(400).json({success: false, error: 'Invalid substrate.'});
    return;
  }

  if (!units) {
    res.status(400).json({success: false, error: 'Invalid units.'});
    return;
  }

  if (!data) {
    res.status(400).json({success: false, error: 'Invalid breath test data.'});
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const testInsert = await client.query(
      `
      INSERT INTO breath_tests (user_id, test_date, substrate, units, notes, file_name)
      VALUES ($1, $2::date, $3, $4, $5, $6)
      RETURNING id, test_date, substrate, units, notes, file_name, created_at
      `,
      [user.id, testDate, substrate, units, notes, fileName]
    );

    const testId = testInsert.rows[0].id;
    for (const point of data) {
      await client.query(
        `
        INSERT INTO breath_test_points (test_id, minute, h2, ch4, h2s)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [testId, point.minute, point.h2, point.ch4, point.h2s ?? null]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({
      success: true,
      data: mapBreathTestRow(testInsert.rows[0], data),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

app.delete('/api/breath-tests/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const id = String(req.params.id ?? '');
  const result = await pool.query(
    `
    DELETE FROM breath_tests
    WHERE id = $1 AND user_id = $2
    RETURNING id
    `,
    [id, user.id]
  );

  if (!result.rowCount) {
    res.status(404).json({success: false, error: 'Breath test not found.'});
    return;
  }

  res.json({success: true});
});

app.delete('/api/auth/account', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  await pool.query('DELETE FROM users WHERE id = $1', [user.id]);
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


