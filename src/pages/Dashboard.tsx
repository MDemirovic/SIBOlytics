import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Clock,
  FileText,
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
import { useLanguage } from '../context/LanguageContext';
import { BreathTest } from '../types/breathTest';
import { getBreathTests, getSymptomEntries } from '../services/healthApi';
import { SymptomDiaryEntry } from '../types/symptomDiary';
import { getLocalDateKey } from '../utils/symptomDiaryStorage';
import { analyzeBreathTest } from '../utils/breathInterpretation';

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

function getDayLabel(date: string, language: 'en' | 'hr') {
  return new Date(`${date}T00:00:00`).toLocaleDateString(language === 'hr' ? 'hr-HR' : 'en-US', { weekday: 'short' });
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
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

function getLatestBreathTestSummary(tests: BreathTest[], isHr: boolean): { value: string; subtitle: string } {
  if (tests.length === 0) {
    return {
      value: isHr ? 'Nema testova' : 'No Tests Yet',
      subtitle: isHr ? 'Dodaj test u sekciju Izdisajni testovi' : 'Add a test in Breath Tests',
    };
  }

  const latest = tests.reduce((currentLatest, candidate) =>
    getTestTimestamp(candidate) > getTestTimestamp(currentLatest) ? candidate : currentLatest
  );

  const dateLabel = new Date(getTestTimestamp(latest)).toLocaleDateString();
  if (!latest.data || latest.data.length === 0) {
    return {
      value: isHr ? 'Nema podataka' : 'No Data',
      subtitle: isHr ? `${dateLabel} - Prazni podaci testa` : `${dateLabel} - Empty test data`,
    };
  }

    const analysis = analyzeBreathTest(latest);

  if (!analysis.hasData) {
    return {
      value: isHr ? 'Nema podataka' : 'No Data',
      subtitle: isHr ? `${dateLabel} - Prazni podaci testa` : `${dateLabel} - Empty test data`,
    };
  }

  if (analysis.pattern === 'mixed_sibo_imo') {
    return {
      value: isHr ? 'Mjesoviti obrazac' : 'Mixed Pattern',
      subtitle: `${dateLabel} - H2 +${analysis.h2Rise}ppm (<=90) / CH4 ${analysis.peakCH4}ppm`,
    };
  }

  if (analysis.pattern === 'hydrogen_sibo') {
    return {
      value: isHr ? 'H2 pozitivan (<=90)' : 'H2 Positive (<=90)',
      subtitle: isHr
        ? `${dateLabel} - H2 porast +${analysis.h2Rise}ppm do 90. min`
        : `${dateLabel} - H2 rise +${analysis.h2Rise}ppm by 90 min`,
    };
  }

  if (analysis.pattern === 'methane_with_late_h2') {
    return {
      value: isHr ? 'IMO + kasni H2' : 'IMO + Late H2',
      subtitle: isHr
        ? `${dateLabel} - CH4 ${analysis.peakCH4}ppm; H2 porast tek >90 min`
        : `${dateLabel} - CH4 ${analysis.peakCH4}ppm; H2 rise only >90 min`,
    };
  }

  if (analysis.pattern === 'methane_imo') {
    return {
      value: isHr ? 'CH4 dominantan (IMO)' : 'CH4 Dominant (IMO)',
      subtitle: isHr
        ? `${dateLabel} - Vrh CH4 ${analysis.peakCH4}ppm`
        : `${dateLabel} - Peak CH4 ${analysis.peakCH4}ppm`,
    };
  }

  if (analysis.pattern === 'late_h2_colonic') {
    return {
      value: isHr ? 'Kasni H2 porast (>90)' : 'Late H2 Rise (>90)',
      subtitle: isHr
        ? `${dateLabel} - H2 porast +${analysis.h2Rise}ppm nakon 90. min`
        : `${dateLabel} - H2 rise +${analysis.h2Rise}ppm after 90 min`,
    };
  }

  return {
    value: isHr ? 'Normalan obrazac' : 'Normal Pattern',
    subtitle: `${dateLabel} - H2 ${analysis.peakH2}ppm / CH4 ${analysis.peakCH4}ppm`,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, isHr } = useLanguage();
  const [tests, setTests] = useState<BreathTest[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<SymptomDiaryEntry[]>([]);
  const [chartRange, setChartRange] = useState<ChartRange>(7);

  const copy = {
    todaySymptomScore: isHr ? 'Današnji rezultat simptoma' : "Today's Symptom Score",
    logSymptoms: isHr ? 'Upiši simptome u Dnevnik simptoma' : 'Log symptoms in Symptom Diary',
    mmcReminder: isHr ? 'MMC podsjetnik' : 'MMC Reminder',
    mmcValue: isHr ? '4h razmak' : '4h Gap',
    mmcSubtitle: isHr ? 'Pokušaj držati oko 4h izmeðu obroka.' : 'Try to keep around 4h between meals.',
    lastBreathTest: isHr ? 'Zadnji izdisajni test' : 'Last Breath Test',
    trendsTitle: isHr ? 'Trend simptoma i stresa' : 'Symptom & Stress Trends',
    trendsSubtitle: isHr ? `Korelacija zadnjih ${chartRange} dana` : `Past ${chartRange} days correlation`,
    last7: isHr ? 'Zadnjih 7 dana' : 'Last 7 days',
    last30: isHr ? 'Zadnjih 30 dana' : 'Last 30 days',
    chartInfo: isHr
      ? 'Graf se temelji na dnevnim unosima iz Dnevnika simptoma.'
      : 'Chart is based on your Symptom Diary daily logs.',
    chartCta: isHr
      ? 'Upiši simptome u Dnevnik simptoma kako bi ovdje vidio trendove.'
      : 'Log symptoms in Symptom Diary to see trends here.',
    noChartData: isHr
      ? 'Nema unosa simptoma u ovom periodu. Dodaj dnevne unose za prikaz trenda.'
      : 'No symptom logs yet in this period. Add diary entries to populate the trend chart.',
    motivationTitle: isHr ? 'Dnevna SIBO motivacija' : 'Daily SIBO Motivation',
    motivationText: isHr
      ? 'Oporavak crijeva je maraton, ne sprint. Male, dosljedne navike poput razmaka izmeðu obroka i upravljanja stresom s vremenom èine veliku razliku.'
      : 'Healing the gut is a marathon, not a sprint. Small, consistent habits like spacing your meals and managing stress make a profound difference over time.',
    remember: isHr ? 'Zapamti' : 'Remember',
    rememberText: isHr
      ? 'Zastoji su normalni. Fokusiraj se na napredak koji si napravio i ostani dosljedan svom planu.'
      : "Setbacks are normal. Focus on the progress you've made and stay consistent with your plan.",
    commonPattern: isHr ? 'Uobièajeni obrazac SIBO simptoma' : 'Common SIBO Symptom Pattern',
    commonPatternText: isHr
      ? 'Simptomi èesto variraju zbog vremena obroka, vrste hrane, stresa i kvalitete sna. Praæenje kontinuiteta kroz vrijeme obièno daje jasniji uvid nego promatranje samo jednog dana.'
      : 'Symptoms often fluctuate by meal timing, food type, stress, and sleep quality. Tracking consistency over time usually gives clearer insight than looking at one isolated day.',
    frequent: isHr ? 'Èesto' : 'Frequent',
    frequentText: isHr ? 'Nadutost, plinovi, nelagoda u trbuhu' : 'Bloating, gas, abdominal discomfort',
    patternClues: isHr ? 'Znakovi obrasca' : 'Pattern Clues',
    patternCluesText: isHr ? 'Gore nakon trigger hrane ili kraæih razmaka izmeðu obroka' : 'Worse after trigger foods or shortened meal gaps',
    todayFocus: isHr ? 'Današnji fokus' : "Today's Focus",
    focus1: isHr ? 'Drži otprilike 4 sata izmeðu obroka kad god je moguæe.' : 'Keep approximately 4 hours between meals when possible.',
    focus2: isHr ? 'Dodaj ili pregledaj svoj zadnji izdisajni test u sekciji Izdisajni testovi.' : 'Add or review your most recent breath test in the Breath Tests section.',
    focus3: isHr ? 'U Food Hubu provjeri jedan sumnjivi sastojak danas.' : 'Use Food Hub to check one suspected trigger ingredient today.',
  };

  useEffect(() => {
    if (!user) {
      setTests([]);
      return;
    }

    const loadTests = async () => {
      try {
        const loaded = await getBreathTests();
        setTests(loaded);
      } catch {
        setTests([]);
      }
    };

    void loadTests();
  }, [user]);

  const latestBreathTest = useMemo(() => getLatestBreathTestSummary(tests, isHr), [tests, isHr]);
  const todayKey = useMemo(() => getLocalDateKey(), []);

  useEffect(() => {
    if (!user) {
      setDiaryEntries([]);
      return;
    }

    const loadDiary = async () => {
      try {
        const loaded = await getSymptomEntries();
        setDiaryEntries(loaded);
      } catch {
        setDiaryEntries([]);
      }
    };

    void loadDiary();
  }, [user]);

  const todayEntry = useMemo(
    () => diaryEntries.find((entry) => entry.date === todayKey),
    [diaryEntries, todayKey]
  );

  const todaySymptomMetric = useMemo(() => {
    if (!todayEntry) {
      return {
        value: '--',
        subtitle: copy.logSymptoms,
      };
    }
    return {
      value: `${todayEntry.overallGut}/10`,
      subtitle: `Bloating ${todayEntry.bloating}/10 - Stress ${todayEntry.stress}/10`,
    };
  }, [todayEntry, copy.logSymptoms]);

  const chartData = useMemo(() => {
    const entryMap = new Map<string, SymptomDiaryEntry>(
      diaryEntries.map((entry) => [entry.date, entry])
    );
    return getDateSequence(chartRange).map((date) => {
      const entry = entryMap.get(date);
      return {
        date,
        day: getDayLabel(date, language),
        bloating: entry?.bloating ?? null,
        stress: entry?.stress ?? null,
      };
    });
  }, [chartRange, diaryEntries, language]);

  const hasChartData = useMemo(
    () => chartData.some((point) => point.bloating !== null || point.stress !== null),
    [chartData]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title={copy.todaySymptomScore}
          value={todaySymptomMetric.value}
          subtitle={todaySymptomMetric.subtitle}
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
        />
        <MetricCard
          title={copy.mmcReminder}
          value={copy.mmcValue}
          subtitle={copy.mmcSubtitle}
          icon={<Clock className="w-5 h-5 text-blue-400" />}
        />
        <MetricCard
          title={copy.lastBreathTest}
          value={latestBreathTest.value}
          subtitle={latestBreathTest.subtitle}
          icon={<FileText className="w-5 h-5 text-indigo-400" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch min-h-[540px]">
        <div className="xl:col-span-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium">{copy.trendsTitle}</h2>
              <p className="text-sm text-slate-400">{copy.trendsSubtitle}</p>
            </div>
            <select
              value={chartRange}
              onChange={(event) => setChartRange(Number(event.target.value) as ChartRange)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none"
              aria-label="Select time period for symptom trends"
            >
              <option value={7}>{copy.last7}</option>
              <option value={30}>{copy.last30}</option>
            </select>
          </div>
          <div className="mb-4 text-xs text-slate-400">
            {copy.chartInfo}{' '}
            <button
              onClick={() => navigate('/symptom-diary')}
              className="text-blue-300 hover:text-blue-200 underline underline-offset-2"
            >
              {copy.chartCta}
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
                <Line
                  type="monotone"
                  dataKey="bloating"
                  name={isHr ? 'Nadutost (1-10)' : 'Bloating (1-10)'}
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="stress"
                  name={isHr ? 'Stres (1-10)' : 'Stress (1-10)'}
                  stroke="#818cf8"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#818cf8', strokeWidth: 2, stroke: '#0f172a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {!hasChartData && (
            <p className="mt-3 text-sm text-slate-400">
              {copy.noChartData}
            </p>
          )}
        </div>

        <div className="xl:col-span-4 bg-gradient-to-br from-blue-900/20 to-slate-900/40 border border-blue-900/30 rounded-2xl p-6 backdrop-blur-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-lg font-medium">{copy.motivationTitle}</h2>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              {copy.motivationText}
            </p>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
              <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{copy.remember}</h4>
              <p className="text-sm text-slate-300">
                {copy.rememberText}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pb-8">
        <section className="xl:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-medium text-white mb-4">{copy.commonPattern}</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            {copy.commonPatternText}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{copy.frequent}</p>
              <p className="text-sm text-slate-200">{copy.frequentText}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{copy.patternClues}</p>
              <p className="text-sm text-slate-200">{copy.patternCluesText}</p>
            </div>
          </div>
        </section>

        <section className="xl:col-span-5 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-medium text-white mb-4">{copy.todayFocus}</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              {copy.focus1}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              {copy.focus2}
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              {copy.focus3}
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}





