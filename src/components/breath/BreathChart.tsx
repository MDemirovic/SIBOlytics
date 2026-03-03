import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { BreathTest } from '../../types/breathTest';
import { useLanguage } from '../../context/LanguageContext';

interface BreathChartProps {
  test: BreathTest;
}

export default function BreathChart({ test }: BreathChartProps) {
  const { isHr } = useLanguage();
  const data = test.data;
  const substrateLabel = (() => {
    if (!isHr) return test.substrate;
    if (test.substrate === 'lactulose') return 'laktuloza';
    if (test.substrate === 'glucose') return 'glukoza';
    return 'nepoznato';
  })();
  const copy = {
    title: isHr ? 'Rezultati izdisajnog testa' : 'Breath Test Results',
    substrate: isHr ? 'Supstrat' : 'Substrate',
    hydrogen: isHr ? 'Vodik (H2)' : 'Hydrogen (H2)',
    methane: isHr ? 'Metan (CH4)' : 'Methane (CH4)',
    minutes: isHr ? 'Minute' : 'Minutes',
    minutePrefix: isHr ? 'Minuta' : 'Minute',
    hydrogenShort: isHr ? 'Vodik' : 'Hydrogen',
    methaneShort: isHr ? 'Metan' : 'Methane',
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-white">{copy.title}</h2>
          <p className="text-sm text-slate-400">{copy.substrate}: <span className="capitalize">{substrateLabel}</span></p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-medium text-slate-300">{copy.hydrogen}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-medium text-slate-300">{copy.methane}</span>
          </div>
        </div>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="minute" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              label={{ value: copy.minutes, position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              label={{ value: 'ppm', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              formatter={(value: number, name: string) => [`${value} ppm`, name === 'h2' ? copy.hydrogenShort : copy.methaneShort]}
              labelFormatter={(label) => `${copy.minutePrefix} ${label}`}
            />
            
            {/* Reference lines for common thresholds (educational only) */}
            <ReferenceLine y={20} stroke="#3b82f6" strokeDasharray="3 3" opacity={0.3} label={{ position: 'insideTopLeft', value: 'H2 +20', fill: '#3b82f6', fontSize: 10, opacity: 0.5 }} />
            <ReferenceLine y={10} stroke="#10b981" strokeDasharray="3 3" opacity={0.3} label={{ position: 'insideTopLeft', value: 'CH4 10', fill: '#10b981', fontSize: 10, opacity: 0.5 }} />
            <ReferenceLine x={90} stroke="#64748b" strokeDasharray="3 3" opacity={0.3} label={{ position: 'insideTopRight', value: '90 min', fill: '#64748b', fontSize: 10, opacity: 0.5 }} />

            <Line 
              type="monotone" 
              dataKey="h2" 
              name="h2" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="ch4" 
              name="ch4" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }} 
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
