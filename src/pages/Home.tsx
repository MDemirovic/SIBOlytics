import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bot, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero Card */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:p-10">
        {/* Background Gradient Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Welcome{firstName ? `, ${firstName}` : '.'}
          </h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Start tracking your breath tests, log your personal food triggers, and learn from reliable sources—tailored for SIBO.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/breath-tests')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors cursor-pointer"
            >
              Start with Breath Test
            </button>
            <button 
              onClick={() => navigate('/food-hub')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-2 cursor-pointer"
            >
              Explore Food Hub <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-xs text-slate-500">Educational only. Not medical advice.</p>
        </div>
      </section>

      {/* Quick Steps */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">Start here</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1 */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-semibold text-lg">
                1
              </div>
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Add your breath test</h3>
            <p className="text-sm text-slate-400 mb-6 flex-1">
              Upload your results (CSV, PDF, or photo) or enter them manually.
            </p>
            <button 
              onClick={() => navigate('/breath-tests')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Go to Breath Tests <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-semibold text-lg">
                2
              </div>
              <span className="text-2xl">
              🍴
              </span>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Filter your foods</h3>
            <p className="text-sm text-slate-400 mb-6 flex-1">
              Check Low/Caution/High in the Food Hub database.
            </p>
            <button 
              onClick={() => navigate('/food-hub')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Go to Food Hub <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-semibold text-lg">
                3
              </div>
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Ask NIH evidence</h3>
            <p className="text-sm text-slate-400 mb-6 flex-1">
              Get answers with citations from NIH sources only.
            </p>
            <button 
              onClick={() => navigate('/nih-evidence')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Go to NIH Evidence <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Read the SIBO Guide Row Card */}
      <section>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Read the SIBO Guide</h3>
              <p className="text-sm text-slate-400">
                Simple, structured education to understand SIBO basics.
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/education')}
            className="shrink-0 py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            Go to Education <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Bottom Panel */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* What you can do here */}
          <div>
            <h2 className="text-xl font-medium text-white mb-6">What you can do here</h2>
            <ul className="space-y-4">
              {[
                'Track breath tests',
                'Build your personal food tolerance log',
                'Learn from NIH-only sources',
                'Use success stories for relapse prevention motivation'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="mt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h2 className="text-xl font-medium text-white mb-6">Tips</h2>
            <ul className="space-y-4">
              {[
                'Start with a breath test or your symptoms baseline.',
                'Use Food Hub filters to avoid overwhelm.',
                'Bring your tracked data to your clinician.'
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0 mt-2" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
