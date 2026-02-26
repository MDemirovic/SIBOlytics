import React from 'react';
import { Heart, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SiboSuccess() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">SIBO Success & Relapse Prevention</h1>
        <p className="text-slate-400 max-w-2xl">
          Healing is a journey. Learn from others, recognize early warning signs, and safely reintroduce foods to build a resilient microbiome.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Success Stories */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            Success Stories
          </h2>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">M</div>
              <div>
                <h3 className="text-base font-medium text-slate-200">Methane Dominant to Remission</h3>
                <p className="text-xs text-slate-500">Anonymous • 2 years post-treatment</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              "After 3 rounds of antibiotics, what finally kept me in remission was strictly spacing my meals by 4 hours and using a prokinetic. I slowly reintroduced FODMAPs over 6 months. Now I can eat garlic and onions without looking 6 months pregnant."
            </p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-400">Meal Spacing</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-400">Prokinetics</span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">J</div>
              <div>
                <h3 className="text-base font-medium text-slate-200">Managing Hydrogen SIBO</h3>
                <p className="text-xs text-slate-500">Anonymous • 8 months post-treatment</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              "Stress was my biggest trigger. Whenever work got crazy, my digestion stopped. Incorporating vagus nerve exercises (deep breathing before meals) changed everything for my motility."
            </p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-400">Stress Management</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-400">Vagus Nerve</span>
            </div>
          </div>
        </div>

        {/* Relapse Prevention & Reintroduction */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border border-indigo-900/30 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Relapse Prevention
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">Maintain 4-5 hours between meals to allow the MMC to sweep the gut.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">Discuss long-term prokinetic use with your doctor.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">Watch for early signs: returning morning bloating or changes in stool.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white mb-4">Food Reintroduction</h2>
            <p className="text-sm text-slate-400 mb-4">
              A diverse microbiome is key to long-term health. Don't stay on a restrictive diet forever.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                <h4 className="text-sm font-medium text-slate-200 mb-1">1. Start Small</h4>
                <p className="text-xs text-slate-400">Introduce one new food every 3 days. Start with a tiny portion (e.g., 1 tsp of avocado).</p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                <h4 className="text-sm font-medium text-slate-200 mb-1">2. Monitor Symptoms</h4>
                <p className="text-xs text-slate-400">Track reactions in the Food Hub. Mild gas is normal; severe pain is a sign to step back.</p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                <h4 className="text-sm font-medium text-slate-200 mb-1">3. Build Tolerance</h4>
                <p className="text-xs text-slate-400">If tolerated, slowly increase the portion size over weeks.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
