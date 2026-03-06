import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Wind className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">SIBOlytics</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            Create account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6 max-w-3xl relative z-10">
          Evidence-based <span className="text-blue-500">SIBO </span> management & education platform.
        </h1>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl relative z-10">
          Track symptoms, analyze breath tests, and discover your personal food triggers with AI-powered insights. Not a replacement for your doctor, but a powerful tool for your journey.
        </p>
        <div className="flex items-center gap-4 relative z-10">
          <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-base font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
            Get Started Free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Preview Dashboard */}
        <div className="mt-20 w-full max-w-5xl relative z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-20 pointer-events-none"></div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-2xl opacity-80 pointer-events-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <p className="text-sm font-medium text-slate-400 mb-1">Today's Symptom Score</p>
                <h3 className="text-2xl font-semibold text-slate-50">3/10</h3>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <p className="text-sm font-medium text-slate-400 mb-1">MMC Fasting Status</p>
                <h3 className="text-2xl font-semibold text-slate-50">3h 45m</h3>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <p className="text-sm font-medium text-slate-400 mb-1">Last Breath Test</p>
                <h3 className="text-2xl font-semibold text-slate-50">H2 Dominant</h3>
              </div>
            </div>
            <div className="h-64 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-center">
              <p className="text-slate-500">Interactive charts and AI insights available inside.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

