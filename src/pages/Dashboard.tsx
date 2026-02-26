import React from 'react';
import { 
  Activity, 
  Clock, 
  FileText, 
  Utensils, 
  BookOpen, 
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const symptomData = [
  { day: 'Mon', bloating: 6, stress: 4 },
  { day: 'Tue', bloating: 7, stress: 5 },
  { day: 'Wed', bloating: 4, stress: 3 },
  { day: 'Thu', bloating: 3, stress: 2 },
  { day: 'Fri', bloating: 5, stress: 6 },
  { day: 'Sat', bloating: 2, stress: 2 },
  { day: 'Sun', bloating: 1, stress: 1 },
];

function MetricCard({ title, value, subtitle, icon, trend }: { title: string, value: string, subtitle: string, icon: React.ReactNode, trend: 'up' | 'down' | 'neutral' }) {
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

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Today's Symptom Score" 
          value="3/10" 
          subtitle="Mild bloating reported"
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          trend="down"
        />
        <MetricCard 
          title="MMC Fasting Status" 
          value="3h 45m" 
          subtitle="Since last meal"
          icon={<Clock className="w-5 h-5 text-blue-400" />}
          trend="neutral"
        />
        <MetricCard 
          title="Last Breath Test" 
          value="H2 Dominant" 
          subtitle="Peak 85ppm at 90min"
          icon={<FileText className="w-5 h-5 text-indigo-400" />}
          trend="neutral"
        />
      </div>

      {/* Main Chart & Motivation Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium">Symptom & Stress Trends</h2>
              <p className="text-sm text-slate-400">Past 7 days correlation</p>
            </div>
            <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={symptomData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
        </div>

        {/* Motivation Card */}
        <div className="bg-gradient-to-br from-blue-900/20 to-slate-900/40 border border-blue-900/30 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400 text-lg">🌱</span>
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

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-medium mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-400" />
            Research Highlights
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5"></div>
              <div>
                <p className="text-sm font-medium text-slate-200">Understanding MMC and Fasting</p>
                <p className="text-xs text-slate-500 mt-1">Source: PubMed • 3 min read</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5"></div>
              <div>
                <p className="text-sm font-medium text-slate-200">Methane vs Hydrogen Dominance</p>
                <p className="text-xs text-slate-500 mt-1">Source: ACG Guidelines • 5 min read</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-medium mb-4 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-slate-400" />
            Recent Food Scans
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden">
                  <img src="https://picsum.photos/seed/salad/100/100" alt="Salad" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Chicken Salad</p>
                  <p className="text-xs text-emerald-400 mt-0.5">Low Risk</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">12:30 PM</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden">
                  <img src="https://picsum.photos/seed/pasta/100/100" alt="Pasta" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Pasta with Red Sauce</p>
                  <p className="text-xs text-amber-400 mt-0.5">Moderate Risk (Garlic)</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
