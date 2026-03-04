import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { SymptomDiaryEntry } from '../types/symptomDiary';
import { getLocalDateKey, loadSymptomDiary, saveSymptomDiary } from '../utils/symptomDiaryStorage';

type SymptomFieldKey =
  | 'pain'
  | 'stress'
  | 'sleep'
  | 'stool'
  | 'bloating'
  | 'diarrhea'
  | 'energy';

type SymptomFormState = Record<SymptomFieldKey, number> & {
  overallGut: number;
  notes: string;
};

const SYMPTOM_FIELDS: SymptomFieldKey[] = [
  'pain',
  'stress',
  'sleep',
  'stool',
  'bloating',
  'diarrhea',
  'energy',
];

const EMPTY_FORM: SymptomFormState = {
  pain: 5,
  stress: 5,
  sleep: 5,
  stool: 5,
  bloating: 5,
  diarrhea: 5,
  energy: 5,
  overallGut: 5,
  notes: '',
};

function formatDate(date: string, isHr: boolean) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(isHr ? 'hr-HR' : 'en-US');
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthKey(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

function mapEntryToForm(entry: SymptomDiaryEntry): SymptomFormState {
  return {
    pain: entry.pain,
    stress: entry.stress,
    sleep: entry.sleep,
    stool: entry.stool,
    bloating: entry.bloating,
    diarrhea: entry.diarrhea,
    energy: entry.energy,
    overallGut: entry.overallGut,
    notes: entry.notes || '',
  };
}

function calculateOverall(form: Pick<SymptomFormState, SymptomFieldKey>): number {
  const total = SYMPTOM_FIELDS.reduce((sum, field) => sum + form[field], 0);
  return Math.round(total / SYMPTOM_FIELDS.length);
}

function sliderBadgeClass(value: number) {
  if (value <= 3) return 'text-red-300 border-red-500/30 bg-red-500/10';
  if (value <= 6) return 'text-amber-300 border-amber-500/30 bg-amber-500/10';
  if (value === 7) return 'text-emerald-200 border-emerald-500/20 bg-emerald-500/5';
  return 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10';
}

function SymptomSlider({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-slate-200">{label}</span>
        <span className={`text-xs px-2 py-1 rounded-md border font-medium ${sliderBadgeClass(value)}`}>
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        className={`symptom-range w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </label>
  );
}

export default function SymptomDiary() {
  const { user } = useAuth();
  const { isHr } = useLanguage();
  const [entries, setEntries] = useState<SymptomDiaryEntry[]>([]);
  const [todayKey, setTodayKey] = useState<string>(getLocalDateKey());
  const [entryDate, setEntryDate] = useState<string>(getLocalDateKey());
  const [form, setForm] = useState<SymptomFormState>(EMPTY_FORM);
  const [saveFeedback, setSaveFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => getMonthStart(new Date()));
  const previousTodayKeyRef = useRef(todayKey);

  const copy = {
    loginPrompt: isHr ? 'Prijavi se za korištenje Dnevnika simptoma.' : 'Sign in to use Symptom Diary.',
    todayIs: isHr ? 'Danas je' : 'Today is',
    editingToday: isHr ? 'Trenutno uređuješ danas. Moguć je samo jedan unos dnevno.' : 'You are currently editing today. One entry per day is enforced.',
    viewingDay: isHr ? 'Pregledavaš' : 'You are viewing',
    returnToday: isHr ? 'Klikni "Danas" za povratak.' : 'Click "Today" to return.',
    today: isHr ? 'Danas' : 'Today',
    savedEntries: isHr ? 'Spremljeni dnevni unosi' : 'Saved Daily Entries',
    total: isHr ? 'ukupno' : 'total',
    noEntries: isHr ? 'Još nema unosa. Klikni "Danas" i spremi simptome.' : 'No entries yet. Click "Today" and save symptoms.',
    pain: isHr ? 'Bol' : 'Pain',
    stress: isHr ? 'Stres' : 'Stress',
    energy: isHr ? 'Energija' : 'Energy',
    titleToday: isHr ? 'Današnji simptomi' : "Today's Symptoms",
    titleDaily: isHr ? 'Dnevni simptomi' : 'Daily Symptoms',
    titleAdd: isHr ? 'Dodaj simptome' : 'Add symptoms',
    scaleText: isHr ? '1 je najgore (crveno), 10 je najbolje (zeleno). Spremi za novi unos ili ažuriranje dana.' : '1 is worst (red), 10 is best (green). Save to create or update this day.',
    overall: isHr ? 'Izračunati ukupni dan' : 'Calculated overall day',
    notes: isHr ? 'Bilješke' : 'Notes',
    notesPlaceholder: isHr ? 'Opcionalne bilješke...' : 'Optional notes...',
    delete: isHr ? 'Obriši' : 'Delete',
    saving: isHr ? 'Spremanje...' : 'Saving...',
    updateToday: isHr ? 'Ažuriraj danas' : 'Update Today',
    updateDay: isHr ? 'Ažuriraj odabrani dan' : 'Update Selected Day',
    saveToday: isHr ? 'Spremi danas' : 'Save Today',
    saveDay: isHr ? 'Spremi odabrani dan' : 'Save Selected Day',
    savedFor: isHr ? 'Spremljeno za' : 'Saved for',
    at: isHr ? 'u' : 'at',
    deletedFor: isHr ? 'Obrisan unos za' : 'Deleted entry for',
  };

  const fieldLabels: Record<SymptomFieldKey, string> = {
    pain: isHr ? 'Bol u trbuhu' : 'Stomach Pain',
    stress: isHr ? 'Stres' : 'Stress',
    sleep: isHr ? 'San' : 'Sleep',
    stool: isHr ? 'Stolica' : 'Stool',
    bloating: isHr ? 'Nadutost' : 'Bloating',
    diarrhea: isHr ? 'Proljev' : 'Diarrhea',
    energy: isHr ? 'Energija' : 'Energy',
  };

  const entryTarget = useMemo(
    () => entries.find((entry) => entry.date === entryDate) ?? null,
    [entries, entryDate]
  );
  const entryDates = useMemo(() => new Set(entries.map((entry) => entry.date)), [entries]);
  const isPastDate = entryDate < todayKey;
  const isReadOnly = isPastDate;

  useEffect(() => {
    const loaded = loadSymptomDiary(user?.id);
    setEntries(loaded);
  }, [user]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextToday = getLocalDateKey();
      setTodayKey((current) => (current === nextToday ? current : nextToday));
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const previousToday = previousTodayKeyRef.current;
    if (todayKey !== previousToday) {
      if (entryDate === previousToday || entryDate > todayKey) {
        setEntryDate(todayKey);
      }
      previousTodayKeyRef.current = todayKey;
    }
  }, [todayKey, entryDate]);

  useEffect(() => {
    if (entryDate > todayKey) {
      setEntryDate(todayKey);
    }
  }, [entryDate, todayKey]);

  useEffect(() => {
    const today = new Date(`${todayKey}T00:00:00`);
    const currentMonthStart = getMonthStart(today);
    setCalendarMonth((prev) => {
      const prevKey = getMonthKey(prev);
      const currentKey = getMonthKey(currentMonthStart);
      if (prevKey > currentKey) return currentMonthStart;
      return prev;
    });
  }, [todayKey]);

  useEffect(() => {
    if (entryTarget) {
      setForm(mapEntryToForm(entryTarget));
      return;
    }
    setForm(EMPTY_FORM);
  }, [entryTarget, entryDate]);

  const persistEntries = (nextEntries: SymptomDiaryEntry[]) => {
    setEntries(nextEntries);
    saveSymptomDiary(nextEntries, user?.id);
  };

  const handleGoToToday = () => {
    setEntryDate(todayKey);
  };

  const handleSelectDate = (dateKey: string) => {
    if (dateKey > todayKey) return;
    setEntryDate(dateKey);
  };

  const handlePrevMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    const todayMonth = getMonthStart(new Date(`${todayKey}T00:00:00`));
    if (getMonthKey(next) <= getMonthKey(todayMonth)) {
      setCalendarMonth(next);
    }
  };

  const updateFormScore = (field: SymptomFieldKey, value: number) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      return { ...next, overallGut: calculateOverall(next) };
    });
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    const now = new Date().toISOString();
    const calculatedOverall = calculateOverall(form);
    const nextEntry: SymptomDiaryEntry = {
      id: entryTarget?.id ?? `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      date: entryDate,
      pain: form.pain,
      stress: form.stress,
      sleep: form.sleep,
      stool: form.stool,
      bloating: form.bloating,
      diarrhea: form.diarrhea,
      energy: form.energy,
      overallGut: calculatedOverall,
      notes: form.notes.trim(),
      createdAt: entryTarget?.createdAt ?? now,
      updatedAt: now,
    };

    const updated = [nextEntry, ...entries.filter((entry) => entry.date !== entryDate)]
      .sort((a, b) => b.date.localeCompare(a.date));
    persistEntries(updated);
    setSelectedHistoryId(nextEntry.id);
    setSaveFeedback(
      `${copy.savedFor} ${formatDate(nextEntry.date, isHr)} ${copy.at} ${new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}.`
    );
    setIsSaving(false);
  };

  const handleDelete = () => {
    if (!entryTarget) return;
    const deletedDate = entryTarget.date;
    const updated = entries.filter((entry) => entry.date !== entryDate);
    persistEntries(updated);
    setSelectedHistoryId(updated[0]?.id ?? null);
    setSaveFeedback(`${copy.deletedFor} ${formatDate(deletedDate, isHr)}.`);
  };

  if (!user) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300">
        {copy.loginPrompt}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>{`
        .symptom-range {
          -webkit-appearance: none;
          appearance: none;
          height: 10px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #ef4444 0%, #facc15 50%, #22c55e 100%);
          outline: none;
        }
        .symptom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #e2e8f0;
          border: 2px solid #0f172a;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
          cursor: pointer;
        }
        .symptom-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #e2e8f0;
          border: 2px solid #0f172a;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
          cursor: pointer;
        }
      `}</style>

      <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-200">
              {copy.todayIs} {formatDate(todayKey, isHr)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {entryDate === todayKey
                ? copy.editingToday
                : `${copy.viewingDay} ${formatDate(entryDate, isHr)}. ${copy.returnToday}`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleGoToToday}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors w-fit"
          >
            {copy.today}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="hidden xl:block xl:col-span-4">
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-medium text-slate-200">{copy.savedEntries}</h3>
              <span className="text-[11px] text-slate-500">{entries.length} {copy.total}</span>
            </div>
            {entries.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
                {copy.noEntries}
              </div>
            )}
            <Calendar
              monthStart={calendarMonth}
              todayKey={todayKey}
              selectedKey={entryDate}
              entryDates={entryDates}
              isHr={isHr}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6">
          <section className="bg-linear-to-br from-blue-900/20 to-slate-900/40 border border-blue-900/30 rounded-2xl p-6 md:p-7 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-lg font-medium text-white">
                {entryTarget
                  ? `${entryDate === todayKey ? copy.titleToday : copy.titleDaily} - ${formatDate(entryDate, isHr)}`
                  : `${copy.titleAdd} - ${formatDate(entryDate, isHr)}`}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              {copy.scaleText}
            </p>

            {isReadOnly && (
              <div className="mb-5 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-300">
                {entryTarget
                  ? 'This day has already been logged. View only.'
                  : 'This is a past day with no entry. View only.'}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SYMPTOM_FIELDS.map((field) => (
                  <div key={field}>
                    <SymptomSlider
                      label={fieldLabels[field]}
                      value={form[field]}
                      onChange={(value) => updateFormScore(field, value)}
                      disabled={isReadOnly}
                    />
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">{copy.overall}</p>
                  <span className={`text-xs px-2 py-1 rounded-md border font-medium ${sliderBadgeClass(form.overallGut)}`}>
                    {form.overallGut}/10
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{copy.notes}</label>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  disabled={isReadOnly}
                  className={`w-full min-h-[100px] bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder={copy.notesPlaceholder}
                />
              </div>

              <div className="flex justify-end gap-3">
                {entryTarget && !isReadOnly && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600/15 border border-red-500/30 text-red-300 hover:bg-red-600/25 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {copy.delete}
                  </button>
                )}
                {!isReadOnly && (
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="cursor-pointer px-5 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white transition-colors"
                  >
                    {isSaving
                      ? copy.saving
                      : entryTarget
                        ? entryDate === todayKey
                          ? copy.updateToday
                          : copy.updateDay
                        : entryDate === todayKey
                          ? copy.saveToday
                          : copy.saveDay}
                  </button>
                )}
              </div>

              {saveFeedback && (
                <p className="text-xs text-emerald-300 text-right">{saveFeedback}</p>
              )}
            </form>
          </section>

          <section className="xl:hidden bg-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-medium text-slate-200">{copy.savedEntries}</h3>
              <span className="text-[11px] text-slate-500">{entries.length} {copy.total}</span>
            </div>
            {entries.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
                {copy.noEntries}
              </div>
            )}
            <Calendar
              monthStart={calendarMonth}
              todayKey={todayKey}
              selectedKey={entryDate}
              entryDates={entryDates}
              isHr={isHr}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

function Calendar({
  monthStart,
  todayKey,
  selectedKey,
  entryDates,
  isHr,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  monthStart: Date;
  todayKey: string;
  selectedKey: string;
  entryDates: Set<string>;
  isHr: boolean;
  onSelectDate: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startIndex = (monthStart.getDay() + 6) % 7;
  const todayMonthKey = getMonthKey(getMonthStart(new Date(`${todayKey}T00:00:00`)));
  const currentMonthKey = getMonthKey(monthStart);

  const dayLabels = isHr
    ? ['Pon', 'Uto', 'Sri', 'Cet', 'Pet', 'Sub', 'Ned']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const cells: Array<number | null> = [];
  for (let i = 0; i < startIndex; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPrevMonth}
          className="px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
        >
          ‹
        </button>
        <div className="text-sm font-medium text-slate-200">
          {monthStart.toLocaleDateString(isHr ? 'hr-HR' : 'en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button
          type="button"
          onClick={onNextMonth}
          disabled={currentMonthKey >= todayMonthKey}
          className="px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-500">
        {dayLabels.map((label) => (
          <div key={label} className="text-center py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="h-9" />;
          }
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isFuture = dateKey > todayKey;
          const isSelected = dateKey === selectedKey;
          const isToday = dateKey === todayKey;
          const hasEntry = entryDates.has(dateKey);
          const baseClasses = isSelected
            ? 'border-blue-500/70 bg-blue-500/15 text-blue-200'
            : 'border-slate-800 bg-slate-950/40 text-slate-200 hover:border-slate-700';
          const entryClasses = hasEntry && !isSelected
            ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.18)]'
            : '';

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              disabled={isFuture}
              className={`h-9 rounded-lg border text-sm font-medium transition-colors relative ${baseClasses} ${entryClasses} ${isFuture ? 'opacity-40 cursor-not-allowed hover:border-slate-800' : ''}`}
            >
              <span className={isToday ? 'text-blue-300' : ''}>{day}</span>
              {hasEntry && (
                <span className={`absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-slate-950/70 ${isSelected ? 'bg-blue-400' : 'bg-emerald-400'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
