import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { BreathDataPoint, BreathDataPointDraft, BreathTest } from '../../types/breathTest';
import { useLanguage } from '../../context/LanguageContext';

interface ManualEntryTableProps {
  initialData?: BreathDataPointDraft[] | null;
  minuteStep?: 15 | 20 | null;
  extractionWarnings?: string[];
  onSave: (test: Omit<BreathTest, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_ROWS: BreathDataPointDraft[] = [
  { minute: 0, h2: 0, ch4: 0 },
  { minute: 15, h2: 0, ch4: 0 },
  { minute: 30, h2: 0, ch4: 0 },
];

const sanitizeNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
};

const toDraftRow = (row: BreathDataPointDraft): BreathDataPointDraft => ({
  minute: sanitizeNumber(row.minute),
  h2: sanitizeNumber(row.h2),
  ch4: sanitizeNumber(row.ch4),
});

const parseInputNumber = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
};

const isCompleteRow = (row: BreathDataPointDraft): row is BreathDataPoint => {
  return (
    typeof row.minute === 'number' && Number.isFinite(row.minute) && row.minute >= 0 &&
    typeof row.h2 === 'number' && Number.isFinite(row.h2) && row.h2 >= 0 &&
    typeof row.ch4 === 'number' && Number.isFinite(row.ch4) && row.ch4 >= 0
  );
};

export default function ManualEntryTable({
  initialData,
  minuteStep,
  extractionWarnings,
  onSave,
  onCancel,
}: ManualEntryTableProps) {
  const { isHr } = useLanguage();
  const [substrate, setSubstrate] = useState<'glucose' | 'lactulose' | 'unknown'>('lactulose');
  const [notes, setNotes] = useState('');
  const [testDate, setTestDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dataPoints, setDataPoints] = useState<BreathDataPointDraft[]>(DEFAULT_ROWS);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setDataPoints(initialData.map(toDraftRow));
    }
  }, [initialData]);

  const effectiveStep = useMemo(() => (minuteStep === 20 ? 20 : 15), [minuteStep]);

  const copy = {
    substrate: isHr ? 'Supstrat' : 'Substrate',
    lactulose: isHr ? 'Laktuloza' : 'Lactulose',
    glucose: isHr ? 'Glukoza' : 'Glucose',
    unknown: isHr ? 'Nepoznato' : 'Unknown',
    testDate: isHr ? 'Datum testa' : 'Test Date',
    notesOptional: isHr ? 'Biljeske (opcionalno)' : 'Notes (Optional)',
    notesPlaceholder: isHr ? 'npr. Post 12 sati' : 'e.g., Fasted for 12 hours',
    minute: isHr ? 'Minuta' : 'Minute',
    addRow: isHr ? 'Dodaj red' : 'Add Row',
    cancel: isHr ? 'Odustani' : 'Cancel',
    saveTest: isHr ? 'Spremi test' : 'Save Test',
    saving: isHr ? 'Spremanje...' : 'Saving...',
    saveError: isHr ? 'Spremanje testa nije uspjelo.' : 'Could not save breath test.',
    completeRows: isHr
      ? 'Molimo upisi minute, H2 i CH4 vrijednosti u svaki red prije spremanja.'
      : 'Please fill minute, H2, and CH4 in every row before saving.',
    extractionWarningsTitle: isHr ? 'AI upozorenja' : 'AI warnings',
    stepDetected: isHr
      ? `Detektirani razmak mjerenja: svakih ${effectiveStep} min.`
      : `Detected measurement interval: every ${effectiveStep} min.`,
  };

  const handleAddRow = () => {
    if (isSaving) return;
    const lastMinute =
      dataPoints.length > 0 && typeof dataPoints[dataPoints.length - 1]?.minute === 'number'
        ? (dataPoints[dataPoints.length - 1].minute as number)
        : 0;

    setDataPoints([...dataPoints, { minute: lastMinute + effectiveStep, h2: null, ch4: null }]);
  };

  const handleRemoveRow = (index: number) => {
    if (isSaving) return;
    setDataPoints(dataPoints.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof BreathDataPointDraft, value: string) => {
    if (isSaving) return;
    const numericValue = parseInputNumber(value);
    const newData = [...dataPoints];
    newData[index] = { ...newData[index], [field]: numericValue };
    setDataPoints(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const completeRows = dataPoints
      .map(toDraftRow)
      .filter(isCompleteRow)
      .map((row) => ({
        minute: Math.round(row.minute),
        h2: Math.round(row.h2),
        ch4: Math.round(row.ch4),
      }))
      .sort((a, b) => a.minute - b.minute);

    if (completeRows.length !== dataPoints.length || completeRows.length === 0) {
      setSubmitError(copy.completeRows);
      return;
    }

    setSubmitError('');
    setIsSaving(true);
    try {
      await onSave({
        substrate,
        units: 'ppm',
        data: completeRows,
        notes,
        testDate: testDate || undefined,
      });
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : copy.saveError;
      setSubmitError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">{copy.substrate}</label>
          <select
            value={substrate}
            onChange={(e) => setSubstrate(e.target.value as 'glucose' | 'lactulose' | 'unknown')}
            disabled={isSaving}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="lactulose">{copy.lactulose}</option>
            <option value="glucose">{copy.glucose}</option>
            <option value="unknown">{copy.unknown}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">{copy.testDate}</label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            disabled={isSaving}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">{copy.notesOptional}</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSaving}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            placeholder={copy.notesPlaceholder}
          />
        </div>
      </div>

      {(extractionWarnings && extractionWarnings.length > 0) && (
        <div className="mb-4 text-sm text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
          <div className="flex items-center gap-2 font-medium mb-2">
            <AlertCircle className="w-4 h-4" />
            {copy.extractionWarningsTitle}
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {extractionWarnings.map((warning, index) => (
              <li key={`${warning}-${index}`}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {minuteStep && (
        <div className="mb-4 text-xs text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-xl p-2">
          {copy.stepDetected}
        </div>
      )}

      {submitError && (
        <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {submitError}
        </div>
      )}

      <div className="overflow-x-auto mb-4 border border-slate-800 rounded-xl bg-slate-950/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="p-3 text-xs font-medium text-slate-400 font-mono uppercase tracking-wider">{copy.minute}</th>
              <th className="p-3 text-xs font-medium text-slate-400 font-mono uppercase tracking-wider">H2 (ppm)</th>
              <th className="p-3 text-xs font-medium text-slate-400 font-mono uppercase tracking-wider">CH4 (ppm)</th>
              <th className="p-3 text-xs font-medium text-slate-400 font-mono uppercase tracking-wider w-12"></th>
            </tr>
          </thead>
          <tbody>
            {dataPoints.map((point, index) => (
              <tr key={index} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={point.minute ?? ''}
                    onChange={(e) => handleChange(index, 'minute', e.target.value)}
                    disabled={isSaving}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={point.h2 ?? ''}
                    onChange={(e) => handleChange(index, 'h2', e.target.value)}
                    disabled={isSaving}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={point.ch4 ?? ''}
                    onChange={(e) => handleChange(index, 'ch4', e.target.value)}
                    disabled={isSaving}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving || dataPoints.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={handleAddRow}
        disabled={isSaving}
        className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mb-8 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" /> {copy.addRow}
      </button>

      <div className="mt-auto pt-4 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-slate-900 py-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copy.cancel}
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? copy.saving : copy.saveTest}
        </button>
      </div>
    </form>
  );
}
