import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bot, BookOpen, CheckCircle2, FileText, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isHr } = useLanguage();
  const firstName = user?.name?.split(' ')[0] || '';
  const copy = {
    welcome: isHr ? 'Dobrodošao' : 'Welcome',
    subtitle: isHr
      ? 'Prati izdisajne testove, razumij prehrambene triggere i uči iz pouzdanih izvora prilagođenih SIBO-u.'
      : 'Track your breath tests, understand your food triggers, and learn from reliable evidence tailored for SIBO.',
    startTracking: isHr ? 'Počni pratiti' : 'Start Tracking',
    exploreFoodHub: isHr ? 'Istraži prehranu' : 'Explore Food Hub',
    learnAboutSibo: isHr ? 'Saznaj više o SIBO-u' : 'Learn about SIBO',
    howItWorks: isHr ? 'Kako funkcionira' : 'How it works',
    steps: [
      {
        title: isHr ? 'Bilježi simptome svaki dan' : 'Log symptoms daily',
        desc: isHr
          ? 'Prati bol, nadutost, stolicu, stres, san, proljev i energiju kako bi prepoznao rutine kroz vrijeme.'
          : 'Track pain, bloating, stool, stress, sleep, diarrhea, and energy to spot routines over time.',
      },
      {
        title: isHr ? 'Interpretacija izdisajnih testova' : 'Track your breath tests',
        desc: isHr
          ? 'Unesi rezultate ručno ili ih dodaj kao gotov test kako bi izgradio vremensku liniju.'
          : 'Upload results or add them manually to build your timeline.',
      },
      {
        title: isHr ? 'Razumij prehrambene triggere' : 'Understand your food triggers',
        desc: isHr
          ? 'Koristi Food Hub za uočavanje obrazaca i smanjenje pogoršanja simptoma.'
          : 'Use the Food Hub to find patterns and reduce symptom flare-ups.',
      },
      {
        title: isHr ? 'Uči iz znanstvenih izvora' : 'Learn from evidence-based research',
        desc: isHr
          ? 'Postavljaj pitanja i pregledaj NIH izvore s citatima.'
          : 'Ask questions and review NIH-only sources with citations.',
      },
      {
        title: isHr ? 'Podijeli ključne zapise' : 'Share your key logs',
        desc: isHr
          ? 'Ponesi symptom timeline, food log i rezultate izdisajnih testova liječniku.'
          : 'Bring your symptom timeline, food log, and breath test results to your clinician.',
      },
    ],
    whyTitle: isHr ? 'Zašto SIBOlytics?' : 'Why SIBOlytics?',
    whyItems: isHr
      ? [
          'Praćenje izdisajnih testova',
          'Izgradi osobni dnevnik tolerancije hrane',
          'Uči iz NIH izvora',
          'Koristi priče o uspjehu za motivaciju',
        ]
      : [
          'Track breath tests',
          'Build your personal food tolerance log',
          'Learn from NIH-only sources',
          'Use success stories for motivation',
        ],
    tipsTitle: isHr ? 'Savjet za početak' : 'Getting Started Tip',
    tips: isHr
      ? [
          'Počni s prvim izdisajnim testom kako bi postavio jasnu početnu točku.',
          'Pregledaj Food Hub nakon logiranja simptoma kako bi otkrio moguće triggere.',
          'Ponesi symptom timeline, food log i rezultate izdisajnih testova liječniku za preciznije odluke.',
        ]
      : [
          'Start by adding your first breath test to establish a clear baseline.',
          'Review Food Hub after logging symptoms to identify likely triggers.',
          'Bring your symptom timeline, food log, and breath test results to your clinician for focused decisions.',
        ],
  };

  return (
    <div className="space-y-10 md:space-y-12 w-full">
      {/* Hero Card */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:p-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4 wrap-break-word">
            {copy.welcome}{firstName ? `, ${firstName}` : '.'}
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            {copy.subtitle}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => navigate('/breath-tests')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors cursor-pointer"
            >
              {copy.startTracking}
            </button>
            <button
              onClick={() => navigate('/food-hub')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
            >
              {copy.exploreFoodHub}
            </button>
            <button
              onClick={() => navigate('/education')}
              className="px-6 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
            >
              {copy.learnAboutSibo}
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-xl font-medium text-white mb-4">{copy.howItWorks}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <button
            onClick={() => navigate('/symptom-diary')}
            className="text-left bg-slate-900/35 border border-slate-800 rounded-2xl p-6 h-full hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-semibold">
                1
              </div>
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">{copy.steps[0].title}</h3>
            <p className="text-sm text-slate-400">{copy.steps[0].desc}</p>
          </button>

          <button
            onClick={() => navigate('/breath-tests')}
            className="text-left bg-slate-900/35 border border-slate-800 rounded-2xl p-6 h-full hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-semibold">
                2
              </div>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">{copy.steps[1].title}</h3>
            <p className="text-sm text-slate-400">{copy.steps[1].desc}</p>
          </button>

          <button
            onClick={() => navigate('/food-hub')}
            className="text-left bg-slate-900/35 border border-slate-800 rounded-2xl p-6 h-full hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-semibold">
                3
              </div>
              <Utensils className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">{copy.steps[2].title}</h3>
            <p className="text-sm text-slate-400">{copy.steps[2].desc}</p>
          </button>

          <button
            onClick={() => navigate('/nih-evidence')}
            className="text-left bg-slate-900/35 border border-slate-800 rounded-2xl p-6 h-full hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-semibold">
                4
              </div>
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">{copy.steps[3].title}</h3>
            <p className="text-sm text-slate-400">{copy.steps[3].desc}</p>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="text-left bg-slate-900/35 border border-slate-800 rounded-2xl p-6 h-full hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-semibold">
                5
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">{copy.steps[4].title}</h3>
            <p className="text-sm text-slate-400">{copy.steps[4].desc}</p>
          </button>
        </div>
      </section>

      {/* Why SIBOlytics */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h2 className="text-xl font-medium text-white mb-6">{copy.whyTitle}</h2>
            <ul className="space-y-4">
              {copy.whyItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="mt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
               {copy.tipsTitle}
             </h2>
             <ul className="space-y-4">
               {copy.tips.map((tip, i) => (
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
