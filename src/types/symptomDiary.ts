export interface SymptomDiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD (local date)
  stress: number;
  overallGut: number;
  bloating: number;
  stool: number;
  pain: number;
  diarrhea: number;
  energy: number;
  sleep: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
