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

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/$/, '') || '';

function apiUrl(path: string) {
  if (!API_BASE) return path;
  return `${API_BASE}${path}`;
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
    throw new Error(message);
  }

  if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data as T;
  }

  return payload as T;
}

export function getOnboardingData() {
  return request<OnboardingData>('/api/onboarding', { method: 'GET' });
}

export function getSymptomEntries() {
  return request<SymptomDiaryEntry[]>('/api/symptoms', { method: 'GET' });
}

export function upsertSymptomEntry(date: string, payload: SymptomEntryInput) {
  return request<SymptomDiaryEntry>(`/api/symptoms/${encodeURIComponent(date)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
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
