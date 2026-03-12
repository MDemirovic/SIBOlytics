import 'dotenv/config';
import crypto from 'node:crypto';
import {existsSync} from 'node:fs';
import path from 'node:path';
import express, {NextFunction, Request, Response} from 'express';
import {Collection, MongoClient, MongoServerError} from 'mongodb';
import {
  extractValidCitationIds,
  generateNihAnswer,
  isQuotaError,
  NihLanguage,
  retrieveNihCitations,
} from './nihRag';

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

type UserDocument = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  hasCompletedOnboarding: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type SessionDocument = {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
};

type OnboardingProfileDocument = {
  userId: string;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

type SymptomEntryDocument = {
  id: string;
  userId: string;
  entryDate: string;
  pain: number;
  stress: number;
  sleep: number;
  stool: number;
  bloating: number;
  diarrhea: number;
  energy: number;
  overallGut: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

type FoodLogEntryDocument = {
  id: string;
  userId: string;
  name: string;
  amount: string;
  status: FoodStatus;
  notes: string;
  createdAt: Date;
};

type BreathTestRunDocument = {
  id: string;
  userId: string;
  testDate?: string;
  substrate: BreathSubstrate;
  units: BreathUnits;
  notes: string;
  fileName: string;
  pointsJson: Record<string, {h2: number; ch4: number; h2s?: number}>;
  pointsJsonCanonical: string;
  createdAt: Date;
};

const app = express();
const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);
const mongoUri = process.env.MONGODB_URI?.trim();
const mongoDbName = process.env.MONGODB_DB_NAME?.trim() || 'sibolytics';
const sessionCookieName = 'sibolytics_session';
const sessionDurationDays = 7;
const isProduction = process.env.NODE_ENV === 'production';
const clientDistPath = path.resolve(process.cwd(), 'dist');
const apiJsonLimit = process.env.API_JSON_LIMIT?.trim() || '12mb';
const mistralApiKey = process.env.MISTRAL_API_KEY?.trim() ?? '';
const breathOcrModel = (process.env.BREATH_OCR_MODEL ?? 'mistral-ocr-latest').trim() || 'mistral-ocr-latest';
const breathOcrTimeoutMs = Number(process.env.BREATH_OCR_TIMEOUT_MS ?? 20000);
const breathOcrMaxImageMb = Number(process.env.BREATH_OCR_MAX_IMAGE_MB ?? 8);
const breathOcrMaxReqPerHour = Number(process.env.BREATH_OCR_MAX_REQ_PER_HOUR ?? 40);
const breathOcrRateWindowMs = 60 * 60 * 1000;
const nihMaxContextChars = Number(process.env.NIH_MAX_CONTEXT_CHARS ?? 18000);
const nihMaxQpsPerUser = Number(process.env.NIH_MAX_QPS_PER_USER ?? 1);
const nihMaxReqPerHour = Number(process.env.NIH_MAX_REQ_PER_HOUR ?? 30);
const nihRateWindowMs = 60 * 60 * 1000;

app.use(express.json({limit: apiJsonLimit}));

type NihRateState = {
  windowStartMs: number;
  count: number;
  lastRequestMs: number;
};

const nihRateMap = new Map<string, NihRateState>();

if (!mongoUri) {
  throw new Error('Missing MONGODB_URI in environment variables.');
}

const mongoClient = new MongoClient(mongoUri);
let usersCollection!: Collection<UserDocument>;
let sessionsCollection!: Collection<SessionDocument>;
let onboardingProfilesCollection!: Collection<OnboardingProfileDocument>;
let symptomEntriesCollection!: Collection<SymptomEntryDocument>;
let foodLogEntriesCollection!: Collection<FoodLogEntryDocument>;
let breathTestRunsCollection!: Collection<BreathTestRunDocument>;

async function connectMongo() {
  await mongoClient.connect();
  const db = mongoClient.db(mongoDbName);

  usersCollection = db.collection<UserDocument>('users');
  sessionsCollection = db.collection<SessionDocument>('sessions');
  onboardingProfilesCollection = db.collection<OnboardingProfileDocument>('onboarding_profiles');
  symptomEntriesCollection = db.collection<SymptomEntryDocument>('symptom_entries');
  foodLogEntriesCollection = db.collection<FoodLogEntryDocument>('food_log_entries');
  breathTestRunsCollection = db.collection<BreathTestRunDocument>('breath_test_runs');
}

async function ensureMongoIndexes() {
  await usersCollection.createIndex({email: 1}, {unique: true, name: 'uq_users_email'});
  await sessionsCollection.createIndex({tokenHash: 1}, {unique: true, name: 'uq_sessions_token_hash'});
  await sessionsCollection.createIndex({expiresAt: 1}, {expireAfterSeconds: 0, name: 'idx_sessions_expires_ttl'});
  await onboardingProfilesCollection.createIndex({userId: 1}, {unique: true, name: 'uq_onboarding_user'});
  await symptomEntriesCollection.createIndex({userId: 1, entryDate: -1, updatedAt: -1}, {name: 'idx_symptom_entries_user_date'});
  await symptomEntriesCollection.createIndex({userId: 1, entryDate: 1}, {unique: true, name: 'uq_symptom_entries_user_date'});
  await foodLogEntriesCollection.createIndex({userId: 1, createdAt: -1}, {name: 'idx_food_log_entries_user_created'});
  await breathTestRunsCollection.createIndex({userId: 1, testDate: -1, createdAt: -1}, {name: 'idx_breath_test_runs_user_date_created'});
}

function isMongoDuplicateKeyError(error: unknown): boolean {
  return error instanceof MongoServerError && error.code === 11000;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function mapUser(row: any): SafeUser {
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    hasCompletedOnboarding: Boolean(row.hasCompletedOnboarding ?? row.has_completed_onboarding),
    emailVerified: Boolean(row.emailVerified ?? row.email_verified),
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


type NihApiErrorCode =
  | 'INVALID_INPUT'
  | 'LOCAL_RATE_LIMIT'
  | 'UPSTREAM_QUOTA_EXCEEDED'
  | 'UPSTREAM_ERROR'
  | 'NO_VALID_CITATIONS';

function sendNihError(res: Response, status: number, code: NihApiErrorCode, message: string) {
  res.status(status).json({success: false, error: message, code});
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]).trim();
  }
  return req.socket.remoteAddress ?? 'unknown';
}

function checkNihRateLimit(key: string, nowMs = Date.now()): boolean {
  if (nihRateMap.size > 20000) {
    const cutoff = nowMs - nihRateWindowMs;
    for (const [entryKey, state] of nihRateMap.entries()) {
      if (state.windowStartMs < cutoff) nihRateMap.delete(entryKey);
    }
  }

  const intervalMs = nihMaxQpsPerUser > 0 ? Math.ceil(1000 / nihMaxQpsPerUser) : 0;
  const previous = nihRateMap.get(key);

  if (!previous) {
    nihRateMap.set(key, {windowStartMs: nowMs, count: 1, lastRequestMs: nowMs});
    return true;
  }

  const state: NihRateState = {...previous};
  if (nowMs - state.windowStartMs >= nihRateWindowMs) {
    state.windowStartMs = nowMs;
    state.count = 0;
  }

  if (intervalMs > 0 && nowMs - state.lastRequestMs < intervalMs) {
    nihRateMap.set(key, state);
    return false;
  }

  if (state.count >= nihMaxReqPerHour) {
    nihRateMap.set(key, state);
    return false;
  }

  state.count += 1;
  state.lastRequestMs = nowMs;
  nihRateMap.set(key, state);
  return true;
}

type BreathOcrApiErrorCode =
  | 'INVALID_INPUT'
  | 'UNSUPPORTED_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'OCR_TIMEOUT'
  | 'OCR_RATE_LIMIT'
  | 'OCR_PROVIDER_ERROR';

type BreathOcrRateState = {
  windowStartMs: number;
  count: number;
};

type BreathOcrRow = {
  minute: number;
  h2: number | null;
  ch4: number | null;
  confidence?: number;
};

type BreathOcrFailure = {
  status: number;
  code: BreathOcrApiErrorCode;
  message: string;
};

const breathOcrRateMap = new Map<string, BreathOcrRateState>();

function sendBreathOcrError(res: Response, status: number, code: BreathOcrApiErrorCode, message: string) {
  res.status(status).json({success: false, error: message, code});
}

function isBreathOcrFailure(value: unknown): value is BreathOcrFailure {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.status === 'number' &&
    typeof obj.code === 'string' &&
    typeof obj.message === 'string'
  );
}

function checkBreathOcrRateLimit(key: string, nowMs = Date.now()): boolean {
  if (breathOcrMaxReqPerHour <= 0) return true;

  if (breathOcrRateMap.size > 20000) {
    const cutoff = nowMs - breathOcrRateWindowMs;
    for (const [entryKey, state] of breathOcrRateMap.entries()) {
      if (state.windowStartMs < cutoff) breathOcrRateMap.delete(entryKey);
    }
  }

  const previous = breathOcrRateMap.get(key);
  if (!previous) {
    breathOcrRateMap.set(key, {windowStartMs: nowMs, count: 1});
    return true;
  }

  const state: BreathOcrRateState = {...previous};
  if (nowMs - state.windowStartMs >= breathOcrRateWindowMs) {
    state.windowStartMs = nowMs;
    state.count = 0;
  }

  if (state.count >= breathOcrMaxReqPerHour) {
    breathOcrRateMap.set(key, state);
    return false;
  }

  state.count += 1;
  breathOcrRateMap.set(key, state);
  return true;
}

function normalizeBreathOcrMimeType(value: unknown): 'image/png' | 'image/jpeg' | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'image/png') return 'image/png';
  if (normalized === 'image/jpeg' || normalized === 'image/jpg') return 'image/jpeg';
  return null;
}

function normalizeBase64ImagePayload(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const payload = trimmed.startsWith('data:')
    ? trimmed.slice(trimmed.indexOf(',') + 1)
    : trimmed;

  const compact = payload.replace(/\s+/g, '');
  if (!compact) return null;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(compact)) return null;

  return compact;
}

function parseOcrNumber(token: string): number | null {
  const cleaned = token
    .replace(/,/g, '.')
    .replace(/[^0-9.-]/g, '')
    .trim();

  if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned === '-.') {
    return null;
  }

  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function parseMinuteToken(value: string): number | null {
  const sampleMatch = value.match(/#?\s*\d+\s*-\s*(\d{1,3})\b/i);
  if (sampleMatch?.[1]) {
    const parsed = parseOcrNumber(sampleMatch[1]);
    if (parsed !== null && Number.isInteger(parsed) && parsed >= 0 && parsed <= 360) {
      return parsed;
    }
  }

  const firstNumber = value.match(/\d{1,3}/);
  if (!firstNumber?.[0]) return null;
  const parsed = Number(firstNumber[0]);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 360) return null;
  return parsed;
}

function normalizeGasValue(value: number | null): number | null {
  if (value === null) return null;
  if (!Number.isFinite(value)) return null;
  if (value < 0 || value > 500) return null;
  return Math.round(value);
}

function rowCompletenessScore(row: BreathOcrRow): number {
  return (row.h2 === null ? 0 : 1) + (row.ch4 === null ? 0 : 1);
}

function upsertBreathOcrRow(byMinute: Map<number, BreathOcrRow>, row: BreathOcrRow, warnings: string[]) {
  const existing = byMinute.get(row.minute);
  if (!existing) {
    byMinute.set(row.minute, row);
    return;
  }

  const existingScore = rowCompletenessScore(existing);
  const candidateScore = rowCompletenessScore(row);
  if (candidateScore > existingScore) {
    byMinute.set(row.minute, row);
  }

  warnings.push('Duplicate minute ' + row.minute + ' detected. Keeping the most complete row.');
}

function parsePipeTableRows(text: string, byMinute: Map<number, BreathOcrRow>, warnings: string[]) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let headerIndexes: {minute: number; h2: number; ch4: number} | null = null;

  for (const line of lines) {
    if (!line.includes('|')) continue;
    const cells = line
      .split('|')
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

    if (cells.length < 3) continue;

    if (!headerIndexes) {
      const normalized = cells.map((cell) =>
        cell
          .toLowerCase()
          .normalize('NFKD')
          .replace(/[^a-z0-9]/g, '')
      );

      const minuteIdx = normalized.findIndex((cell) => cell.includes('minute') || cell === 'min' || cell.includes('time'));
      const h2Idx = normalized.findIndex((cell) => cell.includes('h2') || cell.includes('hydrogen'));
      const ch4Idx = normalized.findIndex((cell) => cell.includes('ch4') || cell.includes('methane'));

      if (minuteIdx >= 0 && h2Idx >= 0 && ch4Idx >= 0) {
        headerIndexes = {minute: minuteIdx, h2: h2Idx, ch4: ch4Idx};
      }
      continue;
    }

    if (/^-+$/.test(cells.join(''))) continue;

    const minuteCell = cells[headerIndexes.minute] ?? '';
    const h2Cell = cells[headerIndexes.h2] ?? '';
    const ch4Cell = cells[headerIndexes.ch4] ?? '';

    const minute = parseMinuteToken(minuteCell);
    if (minute === null) continue;

    const h2 = normalizeGasValue(parseOcrNumber(h2Cell));
    const ch4 = normalizeGasValue(parseOcrNumber(ch4Cell));

    upsertBreathOcrRow(byMinute, {minute, h2, ch4}, warnings);
  }
}

function parseClockToMinutes(clockValue: string): number | null {
  const match = clockValue.match(/\b(\d{1,2}):(\d{2})\b/);
  if (!match?.[1] || !match?.[2]) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return (hours * 60) + minutes;
}

function parseTimedRows(text: string, byMinute: Map<number, BreathOcrRow>, warnings: string[]) {
  const lines = text
    .replace(/[\u2013\u2014]/g, '-')
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  let baselineClockMinutes: number | null = null;

  for (const line of lines) {
    if (!/\d/.test(line)) continue;
    if (line.length > 140) continue;

    const timeMatch = line.match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/);
    if (!timeMatch?.[0]) continue;

    const clockMinutes = parseClockToMinutes(timeMatch[0]);
    if (clockMinutes === null) continue;

    const sampleBeforeTime = line
      .slice(0, line.indexOf(timeMatch[0]))
      .match(/(?:^|\s)(\d{1,2})\.?(?:\s|$)/);

    if (!sampleBeforeTime?.[1]) continue;

    const lineAfterTime = line.slice(line.indexOf(timeMatch[0]) + timeMatch[0].length).trim();
    const numericTail = (lineAfterTime.match(/-?\d+(?:[.,]\d+)?/g) ?? [])
      .map((token) => parseOcrNumber(token))
      .filter((value): value is number => value !== null);

    if (numericTail.length < 2) continue;

    if (baselineClockMinutes === null) {
      baselineClockMinutes = clockMinutes;
    }

    let minute = clockMinutes - baselineClockMinutes;
    if (minute < 0) minute += 24 * 60;
    if (minute < 0 || minute > 360) continue;

    const h2 = normalizeGasValue(numericTail[0] ?? null);
    const ch4 = normalizeGasValue(numericTail[1] ?? null);
    if (h2 === null && ch4 === null) continue;

    upsertBreathOcrRow(byMinute, {minute, h2, ch4}, warnings);
  }
}

function parseLooseRows(text: string, byMinute: Map<number, BreathOcrRow>, warnings: string[]) {
  const lines = text
    .replace(/[\u2013\u2014]/g, '-')
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  for (const rawLine of lines) {
    if (!/\d/.test(rawLine)) continue;
    if (rawLine.length > 140) continue;

    const lineWithoutTime = rawLine
      .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    let minute: number | null = null;
    let tail = lineWithoutTime;

    const sampleMatch = lineWithoutTime.match(/#?\s*\d+\s*-\s*\d{1,3}\b/i);
    if (sampleMatch?.[0]) {
      minute = parseMinuteToken(sampleMatch[0]);
      tail = lineWithoutTime.slice(lineWithoutTime.indexOf(sampleMatch[0]) + sampleMatch[0].length).trim();
    }

    const numericTokens = (tail.match(/-?\d+(?:[.,]\d+)?/g) ?? [])
      .map((token) => parseOcrNumber(token))
      .filter((value): value is number => value !== null);

    if (minute === null) {
      if (numericTokens.length < 3) continue;
      const candidateMinute = numericTokens[0];
      if (!Number.isInteger(candidateMinute) || candidateMinute < 0 || candidateMinute > 360) continue;
      if (candidateMinute > 0 && candidateMinute < 10) continue;
      minute = candidateMinute;
      numericTokens.shift();
    }

    const h2 = normalizeGasValue(numericTokens.length > 0 ? numericTokens[0] : null);
    const ch4 = normalizeGasValue(numericTokens.length > 1 ? numericTokens[1] : null);

    if (h2 === null && ch4 === null) continue;

    upsertBreathOcrRow(byMinute, {minute, h2, ch4}, warnings);
  }
}

function detectBreathOcrInterval(rows: BreathOcrRow[]): 15 | 20 | null {
  const minutes = [...new Set(rows.map((row) => row.minute))].sort((a, b) => a - b);
  if (minutes.length < 3) return null;

  let count15 = 0;
  let count20 = 0;

  for (let i = 1; i < minutes.length; i += 1) {
    const diff = minutes[i] - minutes[i - 1];
    if (diff === 15) count15 += 1;
    if (diff === 20) count20 += 1;
  }

  if (count15 === 0 && count20 === 0) return null;
  if (count15 > count20) return 15;
  if (count20 > count15) return 20;
  return null;
}

function parseBreathOcrRows(markdown: string): {rows: BreathOcrRow[]; warnings: string[]} {
  const warnings: string[] = [];
  const byMinute = new Map<number, BreathOcrRow>();

  parsePipeTableRows(markdown, byMinute, warnings);
  parseTimedRows(markdown, byMinute, warnings);

  if (byMinute.size < 2) {
    parseLooseRows(markdown, byMinute, warnings);
  }

  const rows = [...byMinute.values()].sort((a, b) => a.minute - b.minute);

  if (rows.some((row) => row.h2 === null || row.ch4 === null)) {
    warnings.push('Some values were not read confidently and were left blank for manual review.');
  }

  return {
    rows,
    warnings: [...new Set(warnings)],
  };
}

async function readErrorMessageFromResponse(response: globalThis.Response): Promise<string | null> {
  try {
    const text = await response.text();
    if (!text) return null;

    try {
      const payload = JSON.parse(text);
      const message = payload?.message || payload?.error || payload?.detail;
      return typeof message === 'string' ? message : null;
    } catch {
      return text.slice(0, 500);
    }
  } catch {
    return null;
  }
}

async function runMistralBreathOcr(mimeType: 'image/png' | 'image/jpeg', imageBase64: string): Promise<{markdown: string; model: string}> {
  if (!mistralApiKey) {
    throw {
      status: 502,
      code: 'OCR_PROVIDER_ERROR',
      message: 'MISTRAL_API_KEY is missing on the server.',
    } as BreathOcrFailure;
  }

  const timeoutMs = Number.isFinite(breathOcrTimeoutMs) && breathOcrTimeoutMs > 1000
    ? Math.floor(breathOcrTimeoutMs)
    : 20000;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.mistral.ai/v1/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + mistralApiKey,
      },
      body: JSON.stringify({
        model: breathOcrModel,
        document: {
          type: 'image_url',
          image_url: 'data:' + mimeType + ';base64,' + imageBase64,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const upstreamMessage = await readErrorMessageFromResponse(response);

      if (response.status === 429) {
        throw {
          status: 429,
          code: 'OCR_RATE_LIMIT',
          message: upstreamMessage || 'LLM quota exceeded. Please try again later.',
        } as BreathOcrFailure;
      }

      if (response.status === 408 || response.status === 504) {
        throw {
          status: 504,
          code: 'OCR_TIMEOUT',
          message: 'OCR provider timed out. Please try again.',
        } as BreathOcrFailure;
      }

      throw {
        status: 502,
        code: 'OCR_PROVIDER_ERROR',
        message: upstreamMessage || 'OCR provider error (' + response.status + ').',
      } as BreathOcrFailure;
    }

    const payload = await response.json();
    const pages = Array.isArray(payload?.pages) ? payload.pages : [];

    const markdown = pages
      .map((page: any) => (typeof page?.markdown === 'string' ? page.markdown : ''))
      .join('\n')
      .trim();

    if (!markdown) {
      throw {
        status: 502,
        code: 'OCR_PROVIDER_ERROR',
        message: 'OCR provider returned no readable content.',
      } as BreathOcrFailure;
    }

    return {
      markdown,
      model: typeof payload?.model === 'string' ? payload.model : breathOcrModel,
    };
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw {
        status: 504,
        code: 'OCR_TIMEOUT',
        message: 'OCR request timed out. Please try a smaller or clearer image.',
      } as BreathOcrFailure;
    }

    if (isBreathOcrFailure(error)) {
      throw error;
    }

    throw {
      status: 502,
      code: 'OCR_PROVIDER_ERROR',
      message: 'OCR provider unavailable. Please try again later.',
    } as BreathOcrFailure;
  } finally {
    clearTimeout(timeout);
  }
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
function encodeBreathPoints(points: BreathPointInput[]): Record<string, {h2: number; ch4: number; h2s?: number}> {
  const payload: Record<string, {h2: number; ch4: number; h2s?: number}> = {};
  const sorted = [...points].sort((a, b) => a.minute - b.minute);

  for (const point of sorted) {
    payload[String(point.minute)] = {
      h2: point.h2,
      ch4: point.ch4,
      ...(point.h2s !== undefined ? {h2s: point.h2s} : {}),
    };
  }

  return payload;
}

function decodeBreathPoints(payload: unknown): BreathPointInput[] {
  let source: unknown = payload;

  if (typeof source === 'string') {
    try {
      source = JSON.parse(source);
    } catch {
      return [];
    }
  }

  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return [];
  }

  const points: BreathPointInput[] = [];
  for (const [minuteKey, rawValue] of Object.entries(source as Record<string, unknown>)) {
    if (!rawValue || typeof rawValue !== 'object' || Array.isArray(rawValue)) continue;

    const minute = Number(minuteKey);
    const h2 = clampNonNegative((rawValue as any).h2);
    const ch4 = clampNonNegative((rawValue as any).ch4);
    const rawH2s = (rawValue as any).h2s;
    const h2s = rawH2s === undefined || rawH2s === null ? undefined : clampNonNegative(rawH2s);

    if (!Number.isFinite(minute) || minute < 0 || h2 === null || ch4 === null || h2s === null) continue;

    points.push({
      minute,
      h2,
      ch4,
      ...(h2s !== undefined ? {h2s} : {}),
    });
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
  const dateKey = toDateKey(row.entryDate) ?? toDateKey(row.entry_date) ?? toDateKey(row.date) ?? toDateKey(new Date())!;
  const createdAt = row.createdAt ?? row.created_at;
  const updatedAt = row.updatedAt ?? row.updated_at;
  const userId = row.userId ?? row.user_id;

  return {
    id: String(row.id),
    userId: String(userId),
    date: dateKey,
    pain: Number(row.pain),
    stress: Number(row.stress),
    sleep: Number(row.sleep),
    stool: Number(row.stool),
    bloating: Number(row.bloating),
    diarrhea: Number(row.diarrhea),
    energy: Number(row.energy),
    overallGut: Number(row.overallGut ?? row.overall_gut),
    notes: String(row.notes ?? ''),
    createdAt: new Date(createdAt).toISOString(),
    updatedAt: new Date(updatedAt).toISOString(),
  };
}

function mapFoodRow(row: any) {
  const createdAt = row.createdAt ?? row.created_at;

  return {
    id: String(row.id),
    name: String(row.name),
    amount: String(row.amount),
    status: String(row.status) as FoodStatus,
    notes: String(row.notes ?? ''),
    createdAt: new Date(createdAt).toISOString(),
  };
}

function mapBreathTestRow(row: any, points: BreathPointInput[]) {
  const testDate = toDateKey(row.testDate) ?? toDateKey(row.test_date) ?? undefined;
  const createdAt = row.createdAt ?? row.created_at;
  const fileName = row.fileName ?? row.file_name;

  return {
    id: String(row.id),
    createdAt: new Date(createdAt).toISOString(),
    testDate,
    substrate: String(row.substrate) as BreathSubstrate,
    units: String(row.units) as BreathUnits,
    notes: String(row.notes ?? ''),
    fileName: String(fileName ?? ''),
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
  const session = await sessionsCollection.findOne({
    tokenHash,
    expiresAt: {$gt: new Date()},
  });
  if (!session) return null;

  const user = await usersCollection.findOne({id: session.userId});
  if (!user) return null;

  return mapUser(user);
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

app.post('/api/nih/chat', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  const language = req.body?.language === 'hr' ? 'hr' : 'en';

  if (!question || question.length < 3 || question.length > 1000) {
    sendNihError(res, 400, 'INVALID_INPUT', 'Question must be between 3 and 1000 characters.');
    return;
  }

  const rateKey = `${user.id}:${getClientIp(req)}`;
  if (!checkNihRateLimit(rateKey)) {
    sendNihError(res, 429, 'LOCAL_RATE_LIMIT', 'Rate limit exceeded. Please try again shortly.');
    return;
  }

  const retrieved = retrieveNihCitations(question);
  if (retrieved.length === 0) {
    sendNihError(res, 422, 'NO_VALID_CITATIONS', 'Not enough NIH evidence found for this question.');
    return;
  }

  const boundedCitations = (() => {
    const maxChars = Number.isFinite(nihMaxContextChars) && nihMaxContextChars > 500
      ? Math.floor(nihMaxContextChars)
      : 12000;

    const items = [] as typeof retrieved;
    let consumed = 0;

    for (const citation of retrieved) {
      if (consumed >= maxChars) break;
      const remaining = maxChars - consumed;
      if (remaining < 200) break;

      const clipped = citation.content.length > remaining
        ? citation.content.slice(0, remaining)
        : citation.content;

      consumed += clipped.length;
      items.push({...citation, content: clipped});
    }

    return items;
  })();

  if (boundedCitations.length === 0) {
    sendNihError(res, 422, 'NO_VALID_CITATIONS', 'Not enough NIH evidence found for this question.');
    return;
  }

  try {
    let result = await generateNihAnswer(question, language as NihLanguage, boundedCitations);
    const allowedIds = new Set(boundedCitations.map((item) => item.id));
    let citationIds = extractValidCitationIds(result.answer, allowedIds);

    if (citationIds.length === 0) {
      const retryResult = await generateNihAnswer(
        question,
        language as NihLanguage,
        boundedCitations,
        {forceCitationTokens: true}
      );
      const retryCitationIds = extractValidCitationIds(retryResult.answer, allowedIds);
      if (retryCitationIds.length > 0) {
        result = retryResult;
        citationIds = retryCitationIds;
      }
    }

    if (citationIds.length === 0) {
      console.warn('[NIH_CHAT_CITATION_PARSE_FAILED]', {
        questionPreview: question.slice(0, 160),
        answerPreview: result.answer.slice(0, 260),
      });
      sendNihError(res, 422, 'NO_VALID_CITATIONS', 'Model answer did not include valid citations.');
      return;
    }

    const citations = boundedCitations
      .filter((item) => citationIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        snippet: item.snippet,
      }));

    res.json({
      success: true,
      data: {
        answer: result.answer,
        citations,
        model: result.model,
      },
    });
  } catch (error) {
    const upstreamError = error as any;
    const upstreamMessage = String(upstreamError?.message ?? 'Unknown upstream error');
    const upstreamStatusRaw = upstreamError?.status ?? upstreamError?.statusCode;
    const upstreamStatus = Number(upstreamStatusRaw);

    console.error('[NIH_CHAT_UPSTREAM_ERROR]', {
      status: Number.isFinite(upstreamStatus) ? upstreamStatus : null,
      code: upstreamError?.code,
      message: upstreamMessage,
    });

    if (isQuotaError(error)) {
      sendNihError(res, 429, 'UPSTREAM_QUOTA_EXCEEDED', 'LLM quota exceeded. Please try again later.');
      return;
    }

    const normalizedMessage = upstreamMessage.toLowerCase();
    if (
      upstreamStatus === 401 ||
      upstreamStatus === 403 ||
      normalizedMessage.includes('api key') ||
      normalizedMessage.includes('unauthorized') ||
      normalizedMessage.includes('permission denied')
    ) {
      sendNihError(res, 502, 'UPSTREAM_ERROR', 'LLM authentication failed. Check provider API key (GEMINI_API_KEY or GROQ_API_KEY).');
      return;
    }

    if (
      normalizedMessage.includes('model') &&
      (normalizedMessage.includes('invalid') || normalizedMessage.includes('not found'))
    ) {
      sendNihError(res, 502, 'UPSTREAM_ERROR', 'LLM model is invalid. Check NIH_LLM_MODEL (Gemini) or NIH_GROQ_MODEL (Groq).');
      return;
    }

    sendNihError(res, 502, 'UPSTREAM_ERROR', 'LLM provider unavailable. Please try again later.');
  }
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

  const existing = await usersCollection.findOne({email}, {projection: {id: 1}});
  if (existing) {
    res.status(409).json({success: false, error: 'An account with this email already exists.'});
    return;
  }

  const now = new Date();
  const doc: UserDocument = {
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash: hashPassword(password),
    hasCompletedOnboarding: false,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await usersCollection.insertOne(doc);
  } catch (error) {
    if (isMongoDuplicateKeyError(error)) {
      res.status(409).json({success: false, error: 'An account with this email already exists.'});
      return;
    }
    throw error;
  }

  res.status(201).json({success: true, requiresEmailVerification: false});
});

app.post('/api/auth/login', async (req, res) => {
  const email = normalizeEmail(String(req.body?.email ?? ''));
  const password = String(req.body?.password ?? '');

  const userDoc = await usersCollection.findOne({email});
  if (!userDoc) {
    res.status(401).json({success: false, error: 'Invalid email or password.'});
    return;
  }

  const validPassword = verifyPassword(password, String(userDoc.passwordHash));

  if (!validPassword) {
    res.status(401).json({success: false, error: 'Invalid email or password.'});
    return;
  }

  const sessionToken = createSessionToken();
  const tokenHash = hashSessionToken(sessionToken);

  const expiresAt = new Date(Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000);
  await sessionsCollection.insertOne({
    tokenHash,
    userId: userDoc.id,
    expiresAt,
    createdAt: new Date(),
  });

  setSessionCookie(res, sessionToken);
  res.json({success: true, user: mapUser(userDoc)});
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
    await sessionsCollection.deleteOne({tokenHash});
  }

  clearSessionCookie(res);
  res.json({success: true});
});

app.post('/api/auth/complete-onboarding', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const data = (req.body ?? {}) as Record<string, unknown>;
  const now = new Date();

  await usersCollection.updateOne(
    {id: user.id},
    {
      $set: {
        hasCompletedOnboarding: true,
        updatedAt: now,
      },
    }
  );

  await onboardingProfilesCollection.updateOne(
    {userId: user.id},
    {
      $set: {data, updatedAt: now},
      $setOnInsert: {createdAt: now},
    },
    {upsert: true}
  );

  const refreshed = await usersCollection.findOne({id: user.id});
  if (!refreshed) {
    res.status(404).json({success: false, error: 'User not found.'});
    return;
  }

  res.json({success: true, user: mapUser(refreshed)});
});

app.get('/api/onboarding', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const profile = await onboardingProfilesCollection.findOne({userId: user.id});
  const data = profile?.data ?? {};
  res.json({success: true, data});
});

app.get('/api/symptoms', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const rows = await symptomEntriesCollection
    .find({userId: user.id})
    .sort({entryDate: -1, updatedAt: -1})
    .toArray();

  res.json({
    success: true,
    data: rows.map((row) => mapSymptomRow(row)),
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

  const now = new Date();
  const result = await symptomEntriesCollection.findOneAndUpdate(
    {userId: user.id, entryDate: date},
    {
      $set: {
        pain: scores.pain,
        stress: scores.stress,
        sleep: scores.sleep,
        stool: scores.stool,
        bloating: scores.bloating,
        diarrhea: scores.diarrhea,
        energy: scores.energy,
        overallGut,
        notes,
        updatedAt: now,
      },
      $setOnInsert: {
        id: crypto.randomUUID(),
        userId: user.id,
        entryDate: date,
        createdAt: now,
      },
    },
    {upsert: true, returnDocument: 'after'}
  );

  if (!result) {
    res.status(500).json({success: false, error: 'Failed to save symptom entry.'});
    return;
  }

  res.json({success: true, data: mapSymptomRow(result)});
});

app.delete('/api/symptoms/:date', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const date = String(req.params.date ?? '');
  if (!isDateKey(date)) {
    res.status(400).json({success: false, error: 'Invalid date format. Use YYYY-MM-DD.'});
    return;
  }

  await symptomEntriesCollection.deleteOne({userId: user.id, entryDate: date});

  res.json({success: true});
});

app.get('/api/food-logs', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const rows = await foodLogEntriesCollection
    .find({userId: user.id})
    .sort({createdAt: -1})
    .toArray();

  res.json({
    success: true,
    data: rows.map((row) => mapFoodRow(row)),
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

  const row: FoodLogEntryDocument = {
    id: crypto.randomUUID(),
    userId: user.id,
    name,
    amount,
    status,
    notes,
    createdAt: new Date(),
  };
  await foodLogEntriesCollection.insertOne(row);

  res.status(201).json({success: true, data: mapFoodRow(row)});
});

app.delete('/api/food-logs/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const id = String(req.params.id ?? '');
  const result = await foodLogEntriesCollection.deleteOne({id, userId: user.id});

  if (!result.deletedCount) {
    res.status(404).json({success: false, error: 'Food log entry not found.'});
    return;
  }

  res.json({success: true});
});


app.post('/api/breath-tests/extract', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const fileName = typeof req.body?.fileName === 'string' ? req.body.fileName.trim().slice(0, 512) : '';
  const mimeType = normalizeBreathOcrMimeType(req.body?.mimeType);
  const imageBase64 = normalizeBase64ImagePayload(req.body?.imageBase64);

  if (!mimeType) {
    sendBreathOcrError(res, 400, 'UNSUPPORTED_FILE_TYPE', 'Only JPG and PNG image files are supported for AI extraction.');
    return;
  }

  if (!imageBase64) {
    sendBreathOcrError(res, 400, 'INVALID_INPUT', 'Image payload is missing or invalid base64.');
    return;
  }

  let imageBytes = 0;
  try {
    imageBytes = Buffer.from(imageBase64, 'base64').length;
  } catch {
    sendBreathOcrError(res, 400, 'INVALID_INPUT', 'Image payload is not valid base64.');
    return;
  }

  if (imageBytes <= 0) {
    sendBreathOcrError(res, 400, 'INVALID_INPUT', 'Image payload is empty.');
    return;
  }

  const maxImageBytes = (
    Number.isFinite(breathOcrMaxImageMb) && breathOcrMaxImageMb > 0
      ? Math.floor(breathOcrMaxImageMb)
      : 8
  ) * 1024 * 1024;

  if (imageBytes > maxImageBytes) {
    sendBreathOcrError(
      res,
      413,
      'FILE_TOO_LARGE',
      'Image file is too large for OCR. Please upload a smaller image.'
    );
    return;
  }

  const rateKey = user.id + ':' + getClientIp(req);
  if (!checkBreathOcrRateLimit(rateKey)) {
    sendBreathOcrError(res, 429, 'OCR_RATE_LIMIT', 'OCR rate limit reached. Please try again later.');
    return;
  }

  try {
    const upstream = await runMistralBreathOcr(mimeType, imageBase64);
    const parsed = parseBreathOcrRows(upstream.markdown);

    if (parsed.rows.length < 2) {
      sendBreathOcrError(
        res,
        422,
        'OCR_PROVIDER_ERROR',
        'Could not reliably extract minute, H2, and CH4 rows from this image.'
      );
      return;
    }

    const detectedInterval = detectBreathOcrInterval(parsed.rows);

    res.json({
      success: true,
      data: {
        rows: parsed.rows,
        detectedInterval,
        warnings: parsed.warnings,
        model: upstream.model,
        provider: 'mistral',
        ...(fileName ? {fileName} : {}),
      },
    });
  } catch (error) {
    if (isBreathOcrFailure(error)) {
      sendBreathOcrError(res, error.status, error.code, error.message);
      return;
    }

    console.error('[BREATH_OCR_ERROR]', error);
    sendBreathOcrError(res, 502, 'OCR_PROVIDER_ERROR', 'OCR provider unavailable. Please try again later.');
  }
});

app.get('/api/breath-tests', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const rows = await breathTestRunsCollection
    .find({userId: user.id})
    .sort({testDate: -1, createdAt: -1})
    .toArray();

  const tests = rows.map((row) =>
    mapBreathTestRow(row, decodeBreathPoints(row.pointsJson))
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

  const effectiveTestDate = testDate ?? toDateKey(new Date())!;
  const pointsPayload = encodeBreathPoints(data);
  const pointsPayloadJson = JSON.stringify(pointsPayload);
  const duplicateWindowStart = new Date(Date.now() - 2 * 60 * 1000);

  // Guard against accidental multi-click submits creating duplicate rows.
  const duplicateRow = await breathTestRunsCollection.findOne(
    {
      userId: user.id,
      testDate: effectiveTestDate,
      substrate,
      units,
      notes,
      fileName,
      pointsJsonCanonical: pointsPayloadJson,
      createdAt: {$gte: duplicateWindowStart},
    },
    {sort: {createdAt: -1}}
  );

  if (duplicateRow) {
    res.status(200).json({
      success: true,
      data: mapBreathTestRow(duplicateRow, decodeBreathPoints(duplicateRow.pointsJson)),
    });
    return;
  }

  const row: BreathTestRunDocument = {
    id: crypto.randomUUID(),
    userId: user.id,
    testDate: effectiveTestDate,
    substrate,
    units,
    notes,
    fileName,
    pointsJson: pointsPayload,
    pointsJsonCanonical: pointsPayloadJson,
    createdAt: new Date(),
  };
  await breathTestRunsCollection.insertOne(row);

  res.status(201).json({
    success: true,
    data: mapBreathTestRow(row, data),
  });
});

app.delete('/api/breath-tests/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const id = String(req.params.id ?? '');
  const result = await breathTestRunsCollection.deleteOne({id, userId: user.id});

  if (!result.deletedCount) {
    res.status(404).json({success: false, error: 'Breath test not found.'});
    return;
  }

  res.json({success: true});
});

app.delete('/api/auth/account', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  await Promise.all([
    usersCollection.deleteOne({id: user.id}),
    sessionsCollection.deleteMany({userId: user.id}),
    onboardingProfilesCollection.deleteOne({userId: user.id}),
    symptomEntriesCollection.deleteMany({userId: user.id}),
    foodLogEntriesCollection.deleteMany({userId: user.id}),
    breathTestRunsCollection.deleteMany({userId: user.id}),
  ]);

  clearSessionCookie(res);
  res.json({success: true});
});

app.use('/api', (_req, res) => {
  res.status(404).json({success: false, error: 'Not found.'});
});

if (isProduction) {
  if (!existsSync(clientDistPath)) {
    console.warn(`Missing frontend build at ${clientDistPath}. Run "npm run build" before "npm run start".`);
  } else {
    app.use(express.static(clientDistPath));
    app.get(/^\/(?!api(?:\/|$)).*/, (_req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }
}
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({success: false, error: 'Server error.'});
});

async function startServer() {
  await connectMongo();
  await ensureMongoIndexes();
  app.listen(port, () => {
    console.log(`Server listening on http://127.0.0.1:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start API server:', error);
  process.exit(1);
});






 






