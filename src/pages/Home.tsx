import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowUpRight, Bot, BookOpen, CheckCircle2, ClipboardList, FileText, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isHr } = useLanguage();
  const firstName = user?.name?.split(' ')[0] || '';
  const copy = {
    welcome: isHr ? 'DobrodoĹˇao' : 'Welcome',
    subtitle: isHr
      ? 'Prati izdisajne testove, razumij prehrambene triggere i uÄŤi iz pouzdanih izvora prilagoÄ‘enih SIBO-u.'
      : 'Track your breath tests, understand your food triggers, and learn from reliable evidence tailored for SIBO.',
    startTracking: isHr ? 'PoÄŤni pratiti' : 'Start Tracking',
    exploreFoodHub: isHr ? 'IstraĹľi prehranu' : 'Explore Food Hub',
    learnAboutSibo: isHr ? 'Saznaj viĹˇe o SIBO-u' : 'Learn about SIBO',
    howItWorks: isHr ? 'Kako funkcionira' : 'How it works',
    stepHint: isHr ? 'Klikni korak za otvaranje modula' : 'Click a step to open the module',
    steps: [
      {
        title: isHr ? 'BiljeĹľi simptome svaki dan' : 'Log symptoms daily',
        desc: isHr
          ? 'Prati bol, nadutost, stolicu, stres, san, proljev i energiju kako bi prepoznao rutine kroz vrijeme.'
          : 'Track pain, bloating, stool, stress, sleep, diarrhea, and energy to spot routines over time.',
      },
      {
        title: isHr ? 'Interpretacija izdisajnih testova' : 'Track your breath tests',
        desc: isHr
          ? 'Unesi rezultate ruÄŤno ili ih dodaj kao gotov test kako bi izgradio vremensku liniju.'
          : 'Upload results or add them manually to build your timeline.',
      },
      {
        title: isHr ? 'Razumij prehrambene triggere' : 'Understand your food triggers',
        desc: isHr
          ? 'Koristi Food Hub za uoÄŤavanje obrazaca i smanjenje pogorĹˇanja simptoma.'
          : 'Use the Food Hub to find patterns and reduce symptom flare-ups.',
      },
      {
        title: isHr ? 'UÄŤi iz znanstvenih izvora' : 'Learn from evidence-based research',
        desc: isHr
          ? 'Postavljaj pitanja i pregledaj NIH izvore s citatima, ukljuÄŤujuÄ‡i novo Pimentelovo istraĹľivanje iz 2026.'
          : 'Ask questions and review NIH-only sources with citations, including new Pimentel research from 2026.',
      },
      {
        title: isHr ? 'Podijeli kljuÄŤne zapise' : 'Share your key logs',
        desc: isHr
          ? 'Ponesi symptom timeline, food log i rezultate izdisajnih testova lijeÄŤniku.'
          : 'Bring your symptom timeline, food log, and breath test results to your clinician.',
      },
      {
        title: isHr ? 'Nauci o SIBO-u' : 'Learn about SIBO',
        desc: isHr
          ? 'U Education modulu procitaj osnove o simptomima, uzrocima, testiranju i preporukama za sljedece korake.'
          : 'Use the Education module to learn the essentials about symptoms, causes, testing, and practical next steps.',
      },
    ],
    whyTitle: isHr ? 'ZaĹˇto SIBOlytics?' : 'Why SIBOlytics?',
    whyItems: isHr
      ? [
          'PraÄ‡enje izdisajnih testova',
          'Izgradi osobni dnevnik tolerancije hrane',
          'UÄŤi iz NIH izvora',
          'Koristi Clinical Summary za pregled vaĹľnih podataka i prepoznavanje obrazaca za dijagnostiku',
        ]
      : [
          'Track breath tests',
          'Build your personal food tolerance log',
          'Learn from NIH-only sources',
          'Use Clinical Summary to keep key information in one place and spot diagnostic patterns',
        ],
    tipsTitle: isHr ? 'Savjet za poÄŤetak' : 'Getting Started Tip',
    tips: isHr
      ? [
          'PoÄŤni s prvim izdisajnim testom kako bi postavio jasnu poÄŤetnu toÄŤku.',
          'Pregledaj Food Hub nakon logiranja simptoma kako bi otkrio moguÄ‡e triggere.',
          'Ponesi symptom timeline, food log i rezultate izdisajnih testova lijeÄŤniku za preciznije odluke.',
        ]
      : [
          'Start by adding your first breath test to establish a clear baseline.',
          'Review Food Hub after logging symptoms to identify likely triggers.',
          'Bring your symptom timeline, food log, and breath test results to your clinician for focused decisions.',
        ],
  };

  const stepVisuals: Array<{
    route: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeClass: string;
    iconClass: string;
    accentBarClass: string;
  }> = [
    {
      route: '/symptom-diary',
      icon: FileText,
      badgeClass: 'bg-cyan-500/10 text-cyan-400',
      iconClass: 'text-cyan-400',
      accentBarClass: 'bg-cyan-400/70',
    },
    {
      route: '/breath-tests',
      icon: Activity,
      badgeClass: 'bg-blue-500/10 text-blue-400',
      iconClass: 'text-blue-400',
      accentBarClass: 'bg-blue-400/70',
    },
    {
      route: '/food-hub',
      icon: Utensils,
      badgeClass: 'bg-amber-500/10 text-amber-400',
      iconClass: 'text-amber-400',
      accentBarClass: 'bg-amber-400/70',
    },
    {
      route: '/nih-evidence',
      icon: Bot,
      badgeClass: 'bg-indigo-500/10 text-indigo-400',
      iconClass: 'text-indigo-400',
      accentBarClass: 'bg-indigo-400/70',
    },
    {
      route: '/summary',
      icon: ClipboardList,
      badgeClass: 'bg-emerald-500/10 text-emerald-400',
      iconClass: 'text-emerald-400',
      accentBarClass: 'bg-emerald-400/70',
    },
    {
      route: '/education',
      icon: BookOpen,
      badgeClass: 'bg-violet-500/10 text-violet-400',
      iconClass: 'text-violet-400',
      accentBarClass: 'bg-violet-400/70',
    },
  ];

  const steps = copy.steps.map((step, index) => ({
    ...step,
    ...stepVisuals[index],
    number: index + 1,
  }));

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
        <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <h2 className="text-xl font-medium text-white">{copy.howItWorks}</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wide">{copy.stepHint}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/35 p-3 md:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.number}
                  onClick={() => navigate(step.route)}
                  className="group relative text-left rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4 md:px-5 md:py-5 hover:border-slate-700 hover:bg-slate-800/70 transition-all"
                >
                  <span className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${step.accentBarClass}`}></span>
                  <div className="grid grid-cols-[auto,1fr,auto] items-start gap-3 pl-2">
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${step.badgeClass}`}>
                        {step.number}
                      </div>
                      <Icon className={`w-[18px] h-[18px] ${step.iconClass}`} />
                    </div>

                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-white leading-snug">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm md:text-[15px] text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
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

