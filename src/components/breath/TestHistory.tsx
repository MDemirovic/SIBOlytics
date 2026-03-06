import React from 'react';
import { Trash2, Activity } from 'lucide-react';
import { BreathTest } from '../../types/breathTest';

interface TestHistoryProps {
  tests: BreathTest[];
  selectedTestId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TestHistory({ tests, selectedTestId, onSelect, onDelete }: TestHistoryProps) {
  if (tests.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm text-center">
        <p className="text-sm text-slate-400">No tests saved yet.</p>
      </div>
    );
  }

  const getLabel = (test: BreathTest) => {
    if (!test.data || test.data.length === 0) return 'No Data';
    const baselineH2 = test.data[0]?.h2 || 0;
    const peakH2 = Math.max(...test.data.map(d => d.h2));
    const peakCH4 = Math.max(...test.data.map(d => d.ch4));
    
    const h2Rise = peakH2 - baselineH2;
    const isH2Positive = h2Rise >= 20;
    const isCH4Positive = peakCH4 >= 10;

    if (isH2Positive && isCH4Positive) return 'Mixed Pattern';
    if (isH2Positive) return 'H2 Dominant';
    if (isCH4Positive) return 'CH4 Dominant';
    return 'Normal Pattern';
  };

  return (
    <div className="flex flex-col gap-3">
      {tests.map(test => {
        const date = new Date(test.testDate ?? test.createdAt).toLocaleDateString();
        const isSelected = test.id === selectedTestId;
        const label = getLabel(test);
        
        return (
          <div 
            key={test.id}
            className={`flex flex-col p-4 rounded-2xl transition-all cursor-pointer border ${
              isSelected 
                ? 'bg-blue-900/20 border-blue-500/50 shadow-lg shadow-blue-900/10' 
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
            onClick={() => onSelect(test.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    <span className="capitalize">{test.substrate}</span> Test
                  </p>
                  <p className="text-xs text-slate-500">{date}</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(test.id);
                }}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Delete test"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                label.includes('H2') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                label.includes('CH4') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                label.includes('Mixed') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {label}
              </span>
              {test.notes && (
                <span className="text-xs text-slate-500 truncate max-w-[120px] ml-2" title={test.notes}>
                  {test.notes}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

