import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bot,
  BookOpen,
  ClipboardList,
  FileText,
  Send,
  Sparkles,
  Utensils,
} from 'lucide-react';
import UserMenu from '../components/UserMenu';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getBreathTests, getFoodLogs, getSymptomEntries } from '../services/healthApi';
import { getLocalDateKey } from '../utils/symptomDiaryStorage';
import type { SymptomDiaryEntry } from '../types/symptomDiary';

type Progress = {
  symptomEntries: SymptomDiaryEntry[];
  hasBreathTests: boolean;
  hasFoodLogs: boolean;
};

function shiftDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

// Consecutive days with a symptom entry, counting back from today (or yesterday if today is not logged yet).
function computeStreak(entries: SymptomDiaryEntry[]) {
  const dates = new Set(entries.map((entry) => entry.date));
  let cursor = new Date();
  if (!dates.has(getLocalDateKey(cursor))) cursor = shiftDays(cursor, -1);
  let streak = 0;
  while (dates.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor = shiftDays(cursor, -1);
  }
  return streak;
}

// Percent change in average bloating: last 7 days vs. the 7 days before.
function computeBloatingChange(entries: SymptomDiaryEntry[]) {
  const today = new Date();
  const weekStart = getLocalDateKey(shiftDays(today, -6));
  const prevStart = getLocalDateKey(shiftDays(today, -13));
  const avg = (list: SymptomDiaryEntry[]) => list.reduce((sum, entry) => sum + entry.bloating, 0) / list.length;
  const thisWeek = entries.filter((entry) => entry.date >= weekStart);
  const prevWeek = entries.filter((entry) => entry.date >= prevStart && entry.date < weekStart);
  if (thisWeek.length === 0 || prevWeek.length === 0) return null;
  const prevAvg = avg(prevWeek);
  if (prevAvg === 0) return null;
  return Math.round(((avg(thisWeek) - prevAvg) / prevAvg) * 100);
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isHr } = useLanguage();
  const firstName = user?.name?.split(' ')[0] || '';
  const [progress, setProgress] = useState<Progress | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getSymptomEntries(), getBreathTests(), getFoodLogs()]).then(([symptoms, breath, food]) => {
      if (cancelled) return;
      setProgress({
        symptomEntries: symptoms.status === 'fulfilled' ? symptoms.value : [],
        hasBreathTests: breath.status === 'fulfilled' && breath.value.length > 0,
        hasFoodLogs: food.status === 'fulfilled' && food.value.length > 0,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const copy = {
    welcome: isHr ? 'Dobrodošao natrag,' : 'Welcome back,',
    welcomeNoName: isHr ? 'Dobrodošao natrag.' : 'Welcome back.',
    todayPrompt: isHr ? 'Što želiš napraviti danas?' : 'What would you like to do today?',
    dayStreak: isHr ? 'dana zaredom' : 'day streak',
    bloatingWeek: isHr ? 'nadutost ovaj tjedan' : 'bloating this week',
    step: isHr ? 'KORAK' : 'STEP',
    done: isHr ? 'Gotovo' : 'Done',
    skip: isHr ? 'Preskoči zasad' : 'Skip for now',
    askTitle: isHr ? 'Pitaj o SIBO-u' : 'Ask about SIBO',
    askPlaceholder: isHr ? 'Upiši pitanje…' : 'Type a question…',
    prompts: isHr
      ? ['Metan ili vodik?', 'Kako se pripremiti za izdisajni test?']
      : ['Methane vs hydrogen?', 'How should I prep for a breath test?'],
  };

  const steps = [
    {
      label: isHr ? 'Bilježi' : 'Log',
      icon: FileText,
      route: '/symptom-diary',
      title: isHr ? 'Bilježi simptome svaki dan' : 'Log symptoms daily',
      body: isHr
        ? 'Prati bol, nadutost, stolicu, san i energiju kako bi se pokazali obrasci.'
        : 'Track pain, bloating, stool, sleep and energy so patterns show up.',
      cta: isHr ? 'Otvori dnevnik simptoma' : 'Open Symptom Log',
      time: '≈ 1 min',
      done: (progress?.symptomEntries.length ?? 0) > 0,
    },
    {
      label: isHr ? 'Izdisajni test' : 'Breath test',
      icon: Activity,
      route: '/breath-tests',
      title: isHr ? 'Dodaj izdisajni test' : 'Add your breath test',
      body: isHr
        ? 'Učitaj laboratorijski PDF ili unesi vrijednosti ručno. Postaje početna točka tvoje vremenske linije.'
        : 'Upload a lab PDF or enter values by hand. It becomes the baseline for your timeline.',
      cta: isHr ? 'Dodaj izdisajni test' : 'Add breath test',
      time: '≈ 3 min',
      done: progress?.hasBreathTests ?? false,
    },
    {
      label: isHr ? 'Okidači' : 'Triggers',
      icon: Utensils,
      route: '/food-hub',
      title: isHr ? 'Pronađi prehrambene okidače' : 'Find your food triggers',
      body: isHr
        ? 'Food Hub uspoređuje obroke s pogoršanjima kako bi otkrio vjerojatne okidače.'
        : 'Food Hub matches meals against flare-ups to surface likely triggers.',
      cta: isHr ? 'Otvori prehranu' : 'Open Food Hub',
      time: '≈ 5 min',
      done: progress?.hasFoodLogs ?? false,
    },
    {
      label: isHr ? 'Istraživanja' : 'Research',
      icon: Bot,
      route: '/nih-evidence',
      title: isHr ? 'Pitaj dokaze' : 'Ask the evidence',
      body: isHr
        ? 'Odgovori na pitanja isključivo iz NIH izvora, s citatima.'
        : 'Questions answered from NIH-only sources, with citations.',
      cta: isHr ? 'Pitaj AI' : 'Ask the AI',
      time: '≈ 2 min',
      done: false,
    },
    {
      label: isHr ? 'Uči' : 'Learn',
      icon: BookOpen,
      route: '/education',
      title: isHr ? 'Nauči osnove' : 'Learn the essentials',
      body: isHr
        ? 'Simptomi, uzroci, testiranje i praktični sljedeći koraci.'
        : 'Symptoms, causes, testing and practical next steps.',
      cta: isHr ? 'Počni učiti' : 'Start learning',
      time: '≈ 10 min',
      done: false,
    },
    {
      label: isHr ? 'Podijeli' : 'Share',
      icon: ClipboardList,
      route: '/summary',
      title: isHr ? 'Podijeli s liječnikom' : 'Share with your clinician',
      body: isHr
        ? 'Jedan sažetak tvoje vremenske linije, dnevnika hrane i izdisajnih testova.'
        : 'One summary of your timeline, food log and breath tests.',
      cta: isHr ? 'Izradi sažetak' : 'Build summary',
      time: '≈ 1 min',
      done: false,
    },
  ];

  const active = selected ?? 0;
  const current = steps[active];

  const streak = useMemo(() => (progress ? computeStreak(progress.symptomEntries) : 0), [progress]);
  const bloatingChange = useMemo(() => (progress ? computeBloatingChange(progress.symptomEntries) : null), [progress]);

  const askQuestion = (text: string) => {
    navigate('/nih-evidence', { state: { prefill: text.trim() } });
  };

  return (
    <div className="relative flex w-full flex-1 flex-col font-['Manrope',ui-sans-serif,system-ui,sans-serif] text-[#e8ecf5]">
      {/* Fixed to the viewport so the glow is never clipped by the content container. */}
      <div className="pointer-events-none fixed -top-72 -right-56 h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle_closest-side,rgba(31,107,255,.24)_0%,rgba(31,107,255,.16)_25%,rgba(31,107,255,.08)_50%,rgba(31,107,255,.03)_72%,rgba(31,107,255,0)_100%)]" />

      <div className="relative flex flex-1 flex-col gap-10">
        {/* Greeting + quick stats */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="m-0 text-4xl md:text-[52px] font-extrabold tracking-[-.04em] leading-none wrap-break-word">
              {firstName ? (
                <>
                  {copy.welcome}
                  <br />
                  <span className="text-[#5b9bff]">{firstName}.</span>
                </>
              ) : (
                copy.welcomeNoName
              )}
            </h1>
            <p className="mt-4 text-base text-[#9aa6c2]">{copy.todayPrompt}</p>
          </div>

          <div className="flex items-center gap-7 md:justify-end">
          {(streak > 0 || bloatingChange !== null) && (
            <div className="flex items-center gap-7">
              {streak > 0 && (
                <div className="md:text-right">
                  <div className="text-[22px] font-extrabold">{streak}</div>
                  <div className="text-xs font-semibold text-[#6b7690]">{copy.dayStreak}</div>
                </div>
              )}
              {streak > 0 && bloatingChange !== null && <div className="h-8 w-px bg-[#1f2a45]" />}
              {bloatingChange !== null && (
                <div className="md:text-right">
                  <div className={`text-[22px] font-extrabold ${bloatingChange <= 0 ? 'text-[#4fd1a5]' : 'text-[#f5a83d]'}`}>
                    {bloatingChange > 0 ? '+' : bloatingChange < 0 ? '−' : ''}
                    {Math.abs(bloatingChange)}%
                  </div>
                  <div className="text-xs font-semibold text-[#6b7690]">{copy.bloatingWeek}</div>
                </div>
              )}
            </div>
          )}
            {/* On mobile the Layout header still shows the user menu. */}
            <div className="hidden md:block -my-1.5">
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Step track */}
        <div className="relative">
          <div className="absolute left-[18px] right-[18px] top-[17px] hidden h-0.5 bg-[#1a2443] md:block" />
          <div className="relative grid grid-cols-3 gap-y-6 md:grid-cols-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isSelected = index === active;
              const nodeClass = isSelected
                ? 'bg-[#1f6bff] text-white border-[#8bb8ff]'
                : 'bg-[#0d1428] text-[#56617a] border-[#1f2a45] group-hover:border-[#2a4a8a] group-hover:text-[#8a94ab]';
              const labelClass = isSelected ? 'text-white' : 'text-[#56617a] group-hover:text-[#8a94ab]';
              return (
                <button
                  key={step.route}
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-pressed={isSelected}
                  className="group flex flex-col items-start gap-3 text-left cursor-pointer"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${nodeClass} ${isSelected ? 'shadow-[0_0_0_6px_rgba(91,155,255,.18)]' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className={`text-[13.5px] font-bold transition-colors ${labelClass}`}>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current step + ask card */}
        <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="flex min-h-[300px] flex-col gap-4 rounded-[20px] border border-[#1d3466] bg-[#0d1428] p-6 md:p-8">
            <div className="flex items-center gap-2.5">
              <span className="rounded-md bg-[#12224a] px-2 py-1 font-['JetBrains_Mono',ui-monospace,monospace] text-xs text-[#8bb8ff]">
                {copy.step} {active + 1}
              </span>
              <span className="text-[13px] font-semibold text-[#6b7690]">{current.done ? copy.done : current.time}</span>
            </div>
            <h2 className="m-0 text-2xl md:text-[32px] font-extrabold leading-[1.15] tracking-[-.02em]">{current.title}</h2>
            <p className="m-0 max-w-[460px] text-[15px] leading-normal text-[#9aa6c2]">{current.body}</p>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(current.route)}
                className="flex items-center gap-2 rounded-xl bg-[#1f6bff] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3a7dff] cursor-pointer"
              >
                {current.cta} <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelected((active + 1) % steps.length)}
                className="text-[13.5px] font-semibold text-[#6b7690] transition-colors hover:text-[#9aa6c2] cursor-pointer"
              >
                {copy.skip}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 rounded-[20px] border border-[#1a2443] bg-[#0d1428] p-6">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Sparkles className="h-4 w-4 text-[#a08bff]" />
              {copy.askTitle}
            </div>
            <div className="flex flex-col gap-2">
              {copy.prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => askQuestion(prompt)}
                  className="group flex items-center justify-between rounded-[11px] bg-[#121a33] px-3.5 py-[11px] text-left text-[13.5px] text-[#c3cadb] transition-colors hover:bg-[#17213f] cursor-pointer"
                >
                  {prompt}
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#56617a] transition-colors group-hover:text-[#a08bff]" />
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (question.trim()) askQuestion(question);
              }}
              className="mt-auto flex items-center gap-2.5 rounded-xl border border-[#1f2a45] bg-[#070c1a] px-3.5 py-2 focus-within:border-[#2a4a8a]"
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={copy.askPlaceholder}
                className="min-w-0 flex-1 bg-transparent py-1 text-[13.5px] text-[#e8ecf5] placeholder:text-[#56617a] outline-none"
              />
              <button type="submit" aria-label={copy.askTitle} className="p-1 text-[#a08bff] hover:text-[#c0b2ff] cursor-pointer">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
