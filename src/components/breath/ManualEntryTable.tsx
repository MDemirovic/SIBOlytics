import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BreathDataPoint, BreathTest } from '../../types/breathTest';

interface ManualEntryTableProps {
  initialData?: BreathDataPoint[] | null;
  onSave: (test: Omit<BreathTest, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function ManualEntryTable({ initialData, onSave, onCancel }: ManualEntryTableProps) {
  const [substrate, setSubstrate] = useState<'glucose' | 'lactulose' | 'unknown'>('lactulose');
  const [notes, setNotes] = useState('');
  const [testDate, setTestDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dataPoints, setDataPoints] = useState<BreathDataPoint[]>([
    { minute: 0, h2: 0, ch4: 0 },
    { minute: 15, h2: 0, ch4: 0 },
    { minute: 30, h2: 0, ch4: 0 },
  ]);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setDataPoints(initialData);
    }
  }, [initialData]);

  const handleAddRow = () => {
    const lastMinute = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].minute : 0;
    setDataPoints([...dataPoints, { minute: lastMinute + 15, h2: 0, ch4: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    setDataPoints(dataPoints.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof BreathDataPoint, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    const newData = [...dataPoints];
    newData[index] = { ...newData[index], [field]: isNaN(numValue) ? 0 : numValue };
    setDataPoints(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sort by minute
    const sortedData = [...dataPoints].sort((a, b) => a.minute - b.minute);
    
    onSave({
      substrate,
      units: 'ppm',
      data: sortedData,
      notes,
      testDate: testDate || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Substrate</label>
          <select 
            value={substrate}
            onChange={(e) => setSubstrate(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          >
            <option value="lactulose">Lactulose</option>
            <option value="glucose">Glucose</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Test Date</label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes (Optional)</label>
          <input 
            type="text" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            placeholder="e.g., Fasted for 12 hours"
          />
        </div>
      </div>

      <div className="overflow-x-auto mb-4 border border-slate-800 rounded-xl bg-slate-950/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="p-3 text-xs font-medium text-slate-400 font-mono uppercase tracking-wider">Minute</th>
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="number" 
                    min="0"
                    value={point.h2}
                    onChange={(e) => handleChange(index, 'h2', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </td>
                <td className="p-2">
                  <input 
                    type="number" 
                    min="0"
                    value={point.ch4}
                    onChange={(e) => handleChange(index, 'ch4', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </td>
                <td className="p-2 text-center">
                  <button 
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-md transition-colors"
                    disabled={dataPoints.length <= 1}
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
        className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mb-8 w-fit"
      >
        <Plus className="w-4 h-4" /> Add Row
      </button>

      {/* Sticky Footer */}
      <div className="mt-auto pt-4 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-slate-900 py-4">
        <button 
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          Save Test
        </button>
      </div>
    </form>
  );
}
