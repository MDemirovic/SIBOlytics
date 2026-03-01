export interface BreathDataPoint {
  minute: number;
  h2: number;
  ch4: number;
  h2s?: number;
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
