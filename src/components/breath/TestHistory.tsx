import React from 'react';
import { Trash2, Activity } from 'lucide-react';
import { BreathTest } from '../../types/breathTest';
import { analyzeBreathTest } from '../../utils/breathInterpretation';
import { useLanguage } from '../../context/LanguageContext';

interface TestHistoryProps {
  tests: BreathTest[];
  selectedTestId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

type LabelTone = 'h2' | 'ch4' | 'mixed' | 'late' | 'normal';

export default function TestHistory({ tests, selectedTestId, onSelect, onDelete }: TestHistoryProps) {
  const { isHr } = useLanguage();

  if (tests.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm text-center">
        <p className="text-sm text-slate-400">{isHr ? 'Nema spremljenih testova.' : 'No tests saved yet.'}</p>
      </div>
    );
  }

  const getLabel = (test: BreathTest): { label: string; tone: LabelTone } => {
    const analysis = analyzeBreathTest(test);

    switch (analysis.pattern) {
      case 'mixed_sibo_imo':
        return { label: isHr ? 'Mjesoviti (SIBO+IMO)' : 'Mixed (SIBO+IMO)', tone: 'mixed' };
      case 'hydrogen_sibo':
        return { label: isHr ? 'H2 pozitivan (<=90)' : 'H2 Positive (<=90)', tone: 'h2' };
      case 'methane_imo':
        return { label: isHr ? 'CH4 dominantan (IMO)' : 'CH4 Dominant (IMO)', tone: 'ch4' };
      case 'methane_with_late_h2':
        return { label: isHr ? 'IMO + kasni H2' : 'IMO + Late H2', tone: 'late' };
      case 'late_h2_colonic':
        return { label: isHr ? 'Kasni H2 porast (>90)' : 'Late H2 Rise (>90)', tone: 'late' };
      case 'insufficient':
        return { label: isHr ? 'Nema podataka' : 'No Data', tone: 'normal' };
      default:
        return { label: isHr ? 'Normalan obrazac' : 'Normal Pattern', tone: 'normal' };
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {tests.map(test => {
        const date = new Date(test.testDate ?? test.createdAt).toLocaleDateString(isHr ? 'hr-HR' : 'en-US');
        const isSelected = test.id === selectedTestId;
        const { label, tone } = getLabel(test);

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
                    <span className="capitalize">{test.substrate}</span> {isHr ? 'Test' : 'Test'}
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
                title={isHr ? 'Obrisi test' : 'Delete test'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                tone === 'h2' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                tone === 'ch4' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                tone === 'mixed' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                tone === 'late' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
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
