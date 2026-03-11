import { BreathTest } from '../types/breathTest';
import { LoggedFood, OnboardingData } from '../types/health';
import { SymptomDiaryEntry } from '../types/symptomDiary';

export type SymptomEntryInput = {
  pain: number;
  stress: number;
  sleep: number;
  stool: number;
  bloating: number;
  diarrhea: number;
  energy: number;
  notes?: string;
};

export type FoodLogInput = {
  name: string;
  amount: string;
  status: LoggedFood['status'];
  notes?: string;
};

export type NihChatCitation = {
  id: string;
  title: string;
  url: string;
  snippet: string;
};

export type NihChatResponse = {
  answer: string;
  citations: NihChatCitation[];
  model: string;
};

export type BreathOcrRow = {
  minute: number;
  h2: number | null;
  ch4: number | null;
  confidence?: number;
};

export type BreathImageExtractResponse = {
  rows: BreathOcrRow[];
  detectedInterval: 15 | 20 | null;
  warnings: string[];
  model: string;
  provider: string;
  fileName?: string;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/$/, '') || '';

function apiUrl(path: string) {
  if (!API_BASE) return path;
  return `${API_BASE}${path}`;
}

function clampScore(value: unknown, fallback = 5): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const rounded = Math.round(parsed);
  if (rounded < 1) return 1;
  if (rounded > 10) return 10;
  return rounded;
}

function normalizeDateKey(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}$/.test(trimmed.slice(0, 10))) return trimmed.slice(0, 10);

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

function normalizeIsoTimestamp(value: unknown): string {
  if (typeof value === 'string' || value instanceof Date) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
}

function mapSymptomEntry(raw: any): SymptomDiaryEntry | null {
  if (!raw || typeof raw !== 'object') return null;

  const date = normalizeDateKey(raw.date ?? raw.entryDate ?? raw.entry_date);
  if (!date) return null;

  const pain = clampScore(raw.pain);
  const stress = clampScore(raw.stress);
  const sleep = clampScore(raw.sleep);
  const stool = clampScore(raw.stool);
  const bloating = clampScore(raw.bloating);
  const diarrhea = clampScore(raw.diarrhea);
  const energy = clampScore(raw.energy);
  const fallbackOverall = Math.round((pain + stress + sleep + stool + bloating + diarrhea + energy) / 7);
  const overallGut = clampScore(raw.overallGut ?? raw.overall_gut, fallbackOverall);

  const createdAt = normalizeIsoTimestamp(raw.createdAt ?? raw.created_at);
  const updatedAt = normalizeIsoTimestamp(raw.updatedAt ?? raw.updated_at ?? createdAt);
  const userId = raw.userId ?? raw.user_id;

  return {
    id: String(raw.id ?? `${date}-${updatedAt}`),
    userId: userId === undefined || userId === null ? undefined : String(userId),
    date,
    pain,
    stress,
    sleep,
    stool,
    bloating,
    diarrhea,
    energy,
    overallGut,
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    createdAt,
    updatedAt,
  };
}

function normalizeSymptomEntries(raw: unknown): SymptomDiaryEntry[] {
  if (!Array.isArray(raw)) return [];

  const mapped = raw
    .map((entry) => mapSymptomEntry(entry))
    .filter((entry): entry is SymptomDiaryEntry => entry !== null)
    .sort((a, b) => {
      if (a.date === b.date) return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
      return b.date.localeCompare(a.date);
    });

  const seen = new Set<string>();
  return mapped.filter((entry) => {
    if (seen.has(entry.date)) return false;
    seen.add(entry.date);
    return true;
  });
}

export class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    credentials: 'include',
  });

  const text = await response.text();
  let payload: any = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok || payload?.success === false) {
    const message = payload?.error || `Request failed (${response.status}).`;
    const code = typeof payload?.code === 'string' ? payload.code : undefined;
    throw new ApiRequestError(message, response.status, code);
  }

  if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data as T;
  }

  return payload as T;
}

export function getOnboardingData() {
  return request<OnboardingData>('/api/onboarding', { method: 'GET' });
}

export async function getSymptomEntries() {
  const raw = await request<unknown>('/api/symptoms', { method: 'GET' });
  return normalizeSymptomEntries(raw);
}

export async function upsertSymptomEntry(date: string, payload: SymptomEntryInput) {
  const raw = await request<unknown>(`/api/symptoms/${encodeURIComponent(date)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  const mapped = mapSymptomEntry(raw);
  if (!mapped) {
    throw new Error('Invalid symptom entry payload from server.');
  }

  return mapped;
}

export function deleteSymptomEntry(date: string) {
  return request<{ success: true }>(`/api/symptoms/${encodeURIComponent(date)}`, {
    method: 'DELETE',
  });
}

export function getFoodLogs() {
  return request<LoggedFood[]>('/api/food-logs', { method: 'GET' });
}

export function createFoodLog(payload: FoodLogInput) {
  return request<LoggedFood>('/api/food-logs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteFoodLog(id: string) {
  return request<{ success: true }>(`/api/food-logs/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function getBreathTests() {
  return request<BreathTest[]>('/api/breath-tests', { method: 'GET' });
}

export function createBreathTest(payload: Omit<BreathTest, 'id' | 'createdAt'>) {
  return request<BreathTest>('/api/breath-tests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteBreathTest(id: string) {
  return request<{ success: true }>(`/api/breath-tests/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export function extractBreathTestFromImage(payload: {
  fileName: string;
  mimeType: 'image/png' | 'image/jpeg';
  imageBase64: string;
}) {
  return request<BreathImageExtractResponse>('/api/breath-tests/extract', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
export function askNihBot(question: string, language: 'en' | 'hr') {
  return request<NihChatResponse>('/api/nih/chat', {
    method: 'POST',
    body: JSON.stringify({ question, language }),
  });
}


