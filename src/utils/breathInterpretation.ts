import { BreathDataPoint, BreathTest } from '../types/breathTest';

export const BREATH_THRESHOLDS = {
  hydrogenRisePpm: 20,
  methanePpm: 10,
  smallBowelWindowMinutes: 90,
} as const;

export type BreathPattern =
  | 'insufficient'
  | 'normal'
  | 'hydrogen_sibo'
  | 'methane_imo'
  | 'mixed_sibo_imo'
  | 'late_h2_colonic'
  | 'methane_with_late_h2';

export interface BreathAnalysis {
  hasData: boolean;
  baselineH2: number;
  peakH2: number;
  peakCH4: number;
  h2Rise: number;
  peakH2Minute: number;
  firstH2PositiveMinute: number | null;
  h2PositiveBy90: boolean;
  lateOnlyH2Rise: boolean;
  ch4Positive: boolean;
  pattern: BreathPattern;
}

function sanitizePoints(data: BreathDataPoint[]): BreathDataPoint[] {
  return [...data]
    .filter(
      (point) =>
        Number.isFinite(point.minute) &&
        Number.isFinite(point.h2) &&
        Number.isFinite(point.ch4)
    )
    .sort((a, b) => a.minute - b.minute);
}

export function analyzeBreathTest(test: Pick<BreathTest, 'data'>): BreathAnalysis {
  const points = sanitizePoints(test.data ?? []);
  if (points.length === 0) {
    return {
      hasData: false,
      baselineH2: 0,
      peakH2: 0,
      peakCH4: 0,
      h2Rise: 0,
      peakH2Minute: 0,
      firstH2PositiveMinute: null,
      h2PositiveBy90: false,
      lateOnlyH2Rise: false,
      ch4Positive: false,
      pattern: 'insufficient',
    };
  }

  const baselineH2 = points[0].h2;
  const peakH2Point = points.reduce((max, point) => (point.h2 > max.h2 ? point : max), points[0]);
  const peakCH4 = points.reduce((max, point) => (point.ch4 > max ? point.ch4 : max), points[0].ch4);
  const h2Rise = peakH2Point.h2 - baselineH2;

  const firstH2PositivePoint =
    points.find(
      (point) =>
        point.minute <= BREATH_THRESHOLDS.smallBowelWindowMinutes &&
        point.h2 - baselineH2 >= BREATH_THRESHOLDS.hydrogenRisePpm
    ) ?? null;

  const h2PositiveBy90 = firstH2PositivePoint !== null;
  const anyH2Positive = h2Rise >= BREATH_THRESHOLDS.hydrogenRisePpm;
  const lateOnlyH2Rise = anyH2Positive && !h2PositiveBy90;
  const ch4Positive = peakCH4 >= BREATH_THRESHOLDS.methanePpm;

  let pattern: BreathPattern = 'normal';
  if (h2PositiveBy90 && ch4Positive) {
    pattern = 'mixed_sibo_imo';
  } else if (h2PositiveBy90) {
    pattern = 'hydrogen_sibo';
  } else if (ch4Positive && lateOnlyH2Rise) {
    pattern = 'methane_with_late_h2';
  } else if (ch4Positive) {
    pattern = 'methane_imo';
  } else if (lateOnlyH2Rise) {
    pattern = 'late_h2_colonic';
  }

  return {
    hasData: true,
    baselineH2,
    peakH2: peakH2Point.h2,
    peakCH4,
    h2Rise,
    peakH2Minute: peakH2Point.minute,
    firstH2PositiveMinute: firstH2PositivePoint?.minute ?? null,
    h2PositiveBy90,
    lateOnlyH2Rise,
    ch4Positive,
    pattern,
  };
}
