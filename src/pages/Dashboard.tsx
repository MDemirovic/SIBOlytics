import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Clock,
  FileText,
  ChevronRight,
  Sprout,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BreathTest } from '../types/breathTest';
import { SymptomDiaryEntry } from '../types/symptomDiary';
import { getLocalDateKey, getSymptomDiaryStorageKey, loadSymptomDiary } from '../utils/symptomDiaryStorage';

type ChartRange = 7 | 30;

function getDateSequence(days: number): string[] {
  const list: string[] = [];
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(base);
    date.setDate(base.getDate() - i);
    list.push(getLocalDateKey(date));
  }
  return list;
}

function getDayLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' });
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm flex items-start justify-between group hover:border-slate-700 transition-colors">
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-semibold text-slate-50 tracking-tight">{value}</h3>
        <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:scale-105 transition-transform">
        {icon}
      </div>
    </div>
  );
}

function getTestTimestamp(test: BreathTest): number {
  const primary = Date.parse(test.testDate ?? '');
  if (!Number.isNaN(primary)) return primary;
  const fallback = Date.parse(test.createdAt ?? '');
  return Number.isNaN(fallback) ? 0 : fallback;
}

function getLatestBreathTestSummary(tests: BreathTest[]): { value: string; subtitle: string } {
  if (tests.length === 0) {
    return {
      value: 'No Tests Yet',
      subtitle: 'Add a test in Breath Tests',
    };
  }

  const latest = tests.reduce((currentLatest, candidate) =>
    getTestTimestamp(candidate) > getTestTimestamp(currentLatest) ? candidate : currentLatest
  );

  const dateLabel = new Date(getTestTimestamp(latest)).toLocaleDateString();
  if (!latest.data || latest.data.length === 0) {
    return {
      value: 'No Data',
      subtitle: `${dateLabel} - Empty test data`,
    };
  }

  const baselineH2 = latest.data[0]?.h2 || 0;
  const peakH2Point = latest.data.reduce((max, point) => (point.h2 > max.h2 ? point : max), latest.data[0]);
  const peakCH4Point = latest.data.reduce((max, point) => (point.ch4 > max.ch4 ? point : max), latest.data[0]);
  const h2Rise = peakH2Point.h2 - baselineH2;
  const isH2Positive = h2Rise >= 20;
  const isCH4Positive = peakCH4Point.ch4 >= 10;

  if (isH2Positive && isCH4Positive) {
    return {
      value: 'Mixed Pattern',
      subtitle: `${dateLabel} - H2 ${peakH2Point.h2}ppm / CH4 ${peakCH4Point.ch4}ppm`,
    };
  }
  if (isH2Positive) {
    return {
      value: 'H2 Dominant',
      subtitle: `${dateLabel} - Peak H2 ${peakH2Point.h2}ppm at ${peakH2Point.minute}min`,
    };
  }
  if (isCH4Positive) {
    return {
      value: 'CH4 Dominant',
      subtitle: `${dateLabel} - Peak CH4 ${peakCH4Point.ch4}ppm at ${peakCH4Point.minute}min`,
    };
  }

  return {
    value: 'Normal Pattern',
    subtitle: `${dateLabel} - H2 ${peakH2Point.h2}ppm / CH4 ${peakCH4Point.ch4}ppm`,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests, setTests] = useState<BreathTest[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<SymptomDiaryEntry[]>([]);
  const [chartRange, setChartRange] = useState<ChartRange>(7);

  useEffect(() => {
    if (!user) {
      setTests([]);
      return;
    }

    const storageKey = `sibolytics_breathtests_${user.id}`;
    const loadTests = () => {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        setTests([]);
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        setTests(Array.isArray(parsed) ? parsed : []);
      } catch {
        setTests([]);
      }
    };

    loadTests();
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        loadTests();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [user]);

  const latestBreathTest = useMemo(() => getLatestBreathTestSummary(tests), [tests]);
  const todayKey = useMemo(() => getLocalDateKey(), []);

  useEffect(() => {
    if (!user) {
      setDiaryEntries([]);
      return;
    }

    const storageKey = getSymptomDiaryStorageKey(user.id);
    const syncDiary = () => setDiaryEntries(loadSymptomDiary(user.id));

    syncDiary();
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        syncDiary();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [user]);

  const todayEntry = useMemo(
    () => diaryEntries.find((entry) => entry.date === todayKey),
    [diaryEntries, todayKey]
  );

  const todaySymptomMetric = useMemo(() => {
    if (!todayEntry) {
      return {
        value: '--',
        subtitle: 'Log symptoms in Symptom Diary',
      };
    }
    return {
      value: `${todayEntry.overallGut}/10`,
      subtitle: `Bloating ${todayEntry.bloating}/10 - Stress ${todayEntry.stress}/10`,
    };
  }, [todayEntry]);

  const chartData = useMemo(() => {
    const entryMap = new Map<string, SymptomDiaryEntry>(
      diaryEntries.map((entry) => [entry.date, entry])
    );
    return getDateSequence(chartRange).map((date) => {
      const entry = entryMap.get(date);
      return {
        date,
        day: getDayLabel(date),
        bloating: entry?.bloating ?? null,
        stress: entry?.stress ?? null,
      };
    });
  }, [chartRange, diaryEntries]);

  const hasChartData = useMemo(
    () => chartData.some((point) => point.bloating !== null || point.stress !== null),
    [chartData]
  );

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Today's Symptom Score"
          value={todaySymptomMetric.value}
          subtitle={todaySymptomMetric.subtitle}
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          trend="down"
        />
        <MetricCard
          title="MMC Reminder"
          value="4h Gap"
          subtitle="Try to keep around 4h between meals."
          icon={<Clock className="w-5 h-5 text-blue-400" />}
          trend="neutral"
        />
        <MetricCard
          title="Last Breath Test"
          value={latestBreathTest.value}
          subtitle={latestBreathTest.subtitle}
          icon={<FileText className="w-5 h-5 text-indigo-400" />}
          trend="neutral"
        />
      </div>

      {/* Main Chart & Motivation Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch min-h-[540px]">
        {/* Chart Card */}
        <div className="xl:col-span-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium">Symptom & Stress Trends</h2>
              <p className="text-sm text-slate-400">Past {chartRange} days correlation</p>
            </div>
            <select
              value={chartRange}
              onChange={(event) => setChartRange(Number(event.target.value) as ChartRange)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none"
              aria-label="Select time period for symptom trends"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          <div className="mb-4 text-xs text-slate-400">
            Chart is based on your Symptom Diary daily logs.{' '}
            <button
              onClick={() => navigate('/symptom-diary')}
              className="text-blue-300 hover:text-blue-200 underline underline-offset-2"
            >
              Log symptoms in Symptom Diary to see trends here.
            </button>
          </div>
          <div className="h-[420px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="bloating" name="Bloating (1-10)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="stress" name="Stress (1-10)" stroke="#818cf8" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#818cf8', strokeWidth: 2, stroke: '#0f172a' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {!hasChartData && (
            <p className="mt-3 text-sm text-slate-400">
              No symptom logs yet in this period. Add diary entries to populate the trend chart.
            </p>
          )}
        </div>

        {/* Motivation Card */}
        <div className="xl:col-span-4 bg-gradient-to-br from-blue-900/20 to-slate-900/40 border border-blue-900/30 rounded-2xl p-6 backdrop-blur-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-lg font-medium">Daily SIBO Motivation</h2>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              Healing the gut is a marathon, not a sprint. Small, consistent habits like spacing your meals and managing stress make a profound difference over time.
            </p>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
              <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Remember</h4>
              <p className="text-sm text-slate-300">
                Setbacks are normal. Focus on the progress you've made and stay consistent with your plan.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/sibo-success')}
            className="mt-6 w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            SIBO Success
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Info Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
        <section className="xl:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-medium text-white mb-4">Common SIBO Symptom Pattern</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            Symptoms often fluctuate by meal timing, food type, stress, and sleep quality. Tracking consistency over time usually gives clearer insight than looking at one isolated day.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Frequent</p>
              <p className="text-sm text-slate-200">Bloating, gas, abdominal discomfort</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Pattern Clues</p>
              <p className="text-sm text-slate-200">Worse after trigger foods or shortened meal gaps</p>
            </div>
          </div>
        </section>

        <section className="xl:col-span-5 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-medium text-white mb-4">Today&apos;s Focus</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              Keep approximately 4 hours between meals when possible.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              Add or review your most recent breath test in the Breath Tests section.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              Use Food Hub to check one suspected trigger ingredient today.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}


