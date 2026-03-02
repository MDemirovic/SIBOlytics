import { SymptomDiaryEntry } from '../types/symptomDiary';

const SYMPTOM_DIARY_STORAGE_KEY = 'sibolytics_symptom_diary';

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 5;
}

function clampScore(value: unknown): number {
  const parsed = Math.round(toNumber(value));
  if (parsed < 1) return 1;
  if (parsed > 10) return 10;
  return parsed;
}

function normalizeEntry(entry: any): SymptomDiaryEntry | null {
  if (!entry || typeof entry !== 'object') return null;
  if (typeof entry.id !== 'string' || typeof entry.date !== 'string') return null;

  const createdAt = typeof entry.createdAt === 'string' ? entry.createdAt : new Date().toISOString();
  const updatedAt = typeof entry.updatedAt === 'string' ? entry.updatedAt : createdAt;

  return {
    id: entry.id,
    date: entry.date,
    stress: clampScore(entry.stress),
    overallGut: clampScore(entry.overallGut),
    bloating: clampScore(entry.bloating),
    stool: clampScore(entry.stool),
    pain: clampScore(entry.pain),
    diarrhea: clampScore(entry.diarrhea ?? entry.brainFog),
    energy: clampScore(entry.energy),
    sleep: clampScore(entry.sleep),
    notes: typeof entry.notes === 'string' ? entry.notes : '',
    createdAt,
    updatedAt,
  };
}

export function getSymptomDiaryStorageKey(userId?: string) {
  return userId ? `${SYMPTOM_DIARY_STORAGE_KEY}_${userId}` : SYMPTOM_DIARY_STORAGE_KEY;
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function sortByDateDesc(a: SymptomDiaryEntry, b: SymptomDiaryEntry) {
  if (a.date === b.date) return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  return b.date.localeCompare(a.date);
}

function dedupeByDate(entries: SymptomDiaryEntry[]) {
  const sorted = [...entries].sort(sortByDateDesc);
  const seenDates = new Set<string>();
  return sorted.filter((entry) => {
    if (seenDates.has(entry.date)) return false;
    seenDates.add(entry.date);
    return true;
  });
}

export function loadSymptomDiary(userId?: string): SymptomDiaryEntry[] {
  const raw = localStorage.getItem(getSymptomDiaryStorageKey(userId));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return dedupeByDate(
      parsed
      .map((entry) => normalizeEntry(entry))
      .filter((entry): entry is SymptomDiaryEntry => entry !== null)
    );
  } catch {
    return [];
  }
}

export function saveSymptomDiary(entries: SymptomDiaryEntry[], userId?: string) {
  const normalized = dedupeByDate(
    entries
      .map((entry) => normalizeEntry(entry))
      .filter((entry): entry is SymptomDiaryEntry => entry !== null)
  );
  localStorage.setItem(getSymptomDiaryStorageKey(userId), JSON.stringify(normalized));
}
