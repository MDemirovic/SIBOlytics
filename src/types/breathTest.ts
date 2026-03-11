export interface BreathDataPoint {
  minute: number;
  h2: number;
  ch4: number;
  h2s?: number;
}

export interface BreathDataPointDraft {
  minute: number | null;
  h2: number | null;
  ch4: number | null;
  h2s?: number | null;
}

export interface BreathTest {
  id: string;
  createdAt: string;
  testDate?: string;
  substrate: 'glucose' | 'lactulose' | 'unknown';
  units: 'ppm';
  data: BreathDataPoint[];
  notes?: string;
  fileName?: string;
}

