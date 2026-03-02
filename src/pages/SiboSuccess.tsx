import React from 'react';
import { Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SiboSuccess() {
  const { isHr } = useLanguage();
  const copy = {
    title: isHr ? 'SIBO uspjesi i prevencija relapsa' : 'SIBO Success & Relapse Prevention',
    subtitle: isHr
      ? 'Oporavak je putovanje. Uci od drugih, prepoznaj rane znakove i sigurno vracaj namirnice kako bi izgradio otporniji mikrobiom.'
      : 'Healing is a journey. Learn from others, recognize early warning signs, and safely reintroduce foods to build a resilient microbiome.',
    successStories: isHr ? 'Price o uspjehu' : 'Success Stories',
    relapsePrevention: isHr ? 'Prevencija relapsa' : 'Relapse Prevention',
    foodReintro: isHr ? 'Ponovno uvodenje hrane' : 'Food Reintroduction',
    foodReintroText: isHr
      ? 'Raznolik mikrobiom je kljucan za dugorocno zdravlje. Nemoj dugorocno ostati na restriktivnoj prehrani.'
      : "A diverse microbiome is key to long-term health. Don't stay on a restrictive diet forever.",
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">{copy.title}</h1>
        <p className="text-slate-400 max-w-2xl">{copy.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            {copy.successStories}
          </h2>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">M</div>
              <div>
                <h3 className="text-base font-medium text-slate-200">{isHr ? 'Od metan-dominantnog stanja do remisije' : 'Methane Dominant to Remission'}</h3>
                <p className="text-xs text-slate-500">{isHr ? 'Anonimno - 2 godine nakon terapije' : 'Anonymous - 2 years post-treatment'}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {isHr
                ? '"Nakon 3 kure antibiotika, ono sto me drzalo u remisiji bio je strogi razmak od 4 sata izmedu obroka i prokinetik. FODMAP namirnice sam vracao postupno tijekom 6 mjeseci. Danas mogu jesti luk bez velikih smetnji."'
                : '"After 3 rounds of antibiotics, what finally kept me in remission was strictly spacing my meals by 4 hours and using a prokinetic. I slowly reintroduced FODMAPs over 6 months. Now I can eat garlic and onions without looking 6 months pregnant."'}
            </p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-400">{isHr ? 'Razmak obroka' : 'Meal Spacing'}</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-400">Prokinetics</span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">J</div>
              <div>
                <h3 className="text-base font-medium text-slate-200">{isHr ? 'Upravljanje vodik-dominantnim SIBO-om' : 'Managing Hydrogen SIBO'}</h3>
                <p className="text-xs text-slate-500">{isHr ? 'Anonimno - 8 mjeseci nakon terapije' : 'Anonymous - 8 months post-treatment'}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {isHr
                ? '"Stres je bio moj najveci trigger. Kad bi posao postao kaotican, probava bi stala. Vjezbe za vagus (duboko disanje prije obroka) promijenile su mi motilitet."'
                : '"Stress was my biggest trigger. Whenever work got crazy, my digestion stopped. Incorporating vagus nerve exercises (deep breathing before meals) changed everything for my motility."'}
            </p>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-400">{isHr ? 'Upravljanje stresom' : 'Stress Management'}</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-400">Vagus Nerve</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border border-indigo-900/30 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              {copy.relapsePrevention}
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">
                  {isHr ? 'Drzi 4-5 sati izmedu obroka kako bi MMC mogao "ocistiti" crijevo.' : 'Maintain 4-5 hours between meals to allow the MMC to sweep the gut.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">
                  {isHr ? 'Razgovaraj s lijecnikom o dugorocnoj upotrebi prokinetika.' : 'Discuss long-term prokinetic use with your doctor.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-300">
                  {isHr ? 'Pazi na rane znakove: jutarnja nadutost ili promjene stolice.' : 'Watch for early signs: returning morning bloating or changes in stool.'}
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white mb-4">{copy.foodReintro}</h2>
            <p className="text-sm text-slate-400 mb-4">{copy.foodReintroText}</p>
            <div className="space-y-4">
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                <h4 className="text-sm font-medium text-slate-200 mb-1">{isHr ? '1. Kreni malo' : '1. Start Small'}</h4>
                <p className="text-xs text-slate-400">
                  {isHr ? 'Uvodi jednu novu namirnicu svaka 3 dana i pocni s malom kolicinom.' : 'Introduce one new food every 3 days. Start with a tiny portion (e.g., 1 tsp of avocado).'}
                </p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                <h4 className="text-sm font-medium text-slate-200 mb-1">{isHr ? '2. Prati simptome' : '2. Monitor Symptoms'}</h4>
                <p className="text-xs text-slate-400">
                  {isHr ? 'Prati reakcije u Food Hubu. Blagi plin je normalan, jaka bol je znak za korak nazad.' : 'Track reactions in the Food Hub. Mild gas is normal; severe pain is a sign to step back.'}
                </p>
              </div>
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                <h4 className="text-sm font-medium text-slate-200 mb-1">{isHr ? '3. Gradi toleranciju' : '3. Build Tolerance'}</h4>
                <p className="text-xs text-slate-400">
                  {isHr ? 'Ako podnosis, polako povecavaj porcije kroz tjedne.' : 'If tolerated, slowly increase the portion size over weeks.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

