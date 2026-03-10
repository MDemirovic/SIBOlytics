import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BreathDataPoint, BreathTest } from '../../types/breathTest';
import { useLanguage } from '../../context/LanguageContext';

interface ManualEntryTableProps {
  initialData?: BreathDataPoint[] | null;
  onSave: (test: Omit<BreathTest, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
}

export default function ManualEntryTable({ initialData, onSave, onCancel }: ManualEntryTableProps) {
  const { isHr } = useLanguage();
  const [substrate, setSubstrate] = useState<'glucose' | 'lactulose' | 'unknown'>('lactulose');
  const [notes, setNotes] = useState('');
  const [testDate, setTestDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dataPoints, setDataPoints] = useState<BreathDataPoint[]>([
    { minute: 0, h2: 0, ch4: 0 },
    { minute: 15, h2: 0, ch4: 0 },
    { minute: 30, h2: 0, ch4: 0 },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setDataPoints(initialData);
    }
  }, [initialData]);

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
  };

  const handleAddRow = () => {
    if (isSaving) return;
    const lastMinute = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].minute : 0;
    setDataPoints([...dataPoints, { minute: lastMinute + 15, h2: 0, ch4: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    if (isSaving) return;
    setDataPoints(dataPoints.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof BreathDataPoint, value: string) => {
    if (isSaving) return;
    const numValue = value === '' ? 0 : parseInt(value, 10);
    const newData = [...dataPoints];
    newData[index] = { ...newData[index], [field]: isNaN(numValue) ? 0 : numValue };
    setDataPoints(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const sortedData = [...dataPoints].sort((a, b) => a.minute - b.minute);

    setSubmitError('');
    setIsSaving(true);
    try {
      await onSave({
        substrate,
        units: 'ppm',
        data: sortedData,
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
                    value={point.minute}
                    onChange={(e) => handleChange(index, 'minute', e.target.value)}
                    disabled={isSaving}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={point.h2}
                    onChange={(e) => handleChange(index, 'h2', e.target.value)}
                    disabled={isSaving}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    value={point.ch4}
                    onChange={(e) => handleChange(index, 'ch4', e.target.value)}
                    disabled={isSaving}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    required
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
