import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Download, FileText, Printer, Utensils, Wind } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getBreathTests, getFoodLogs, getOnboardingData, getSymptomEntries } from '../services/healthApi';
import { BreathTest } from '../types/breathTest';
import { LoggedFood, OnboardingData } from '../types/health';
import { SymptomDiaryEntry } from '../types/symptomDiary';
import { analyzeBreathTest, BREATH_THRESHOLDS } from '../utils/breathInterpretation';

const SYMPTOM_FIELDS = ['pain', 'bloating', 'diarrhea', 'stress', 'sleep', 'energy', 'stool'] as const;
type SymptomField = (typeof SYMPTOM_FIELDS)[number];

function toTimestamp(value?: string): number {
  const parsed = Date.parse(value ?? '');
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(dateValue: string | undefined, isHr: boolean): string {
  if (!dateValue) return '-';
  const parsed = Date.parse(dateValue);
  if (Number.isNaN(parsed)) return '-';
  return new Date(parsed).toLocaleDateString(isHr ? 'hr-HR' : 'en-US');
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  const total = values.reduce((sum, value) => sum + value, 0);
  return Number((total / values.length).toFixed(1));
}

function getBreathTestTimestamp(test: BreathTest): number {
  const testDateTimestamp = toTimestamp(test.testDate);
  if (testDateTimestamp > 0) return testDateTimestamp;
  return toTimestamp(test.createdAt);
}

function getPeaks(test: BreathTest) {
  const firstPoint = test.data[0];
  const peakH2 = test.data.reduce((max, point) => (point.h2 > max.h2 ? point : max), firstPoint ?? { minute: 0, h2: 0, ch4: 0 });
  const peakCH4 = test.data.reduce((max, point) => (point.ch4 > max.ch4 ? point : max), firstPoint ?? { minute: 0, h2: 0, ch4: 0 });
  const baselineH2 = firstPoint?.h2 ?? 0;

  return {
    h2Rise: peakH2.h2 - baselineH2,
    peakCH4: peakCH4.ch4,
    peakH2Minute: peakH2.minute,
  };
}

function getBreathInterpretation(test: BreathTest, isHr: boolean) {
  const analysis = analyzeBreathTest(test);
  if (!analysis.hasData) {
    return {
      title: isHr ? 'Nedovoljno podataka' : 'Insufficient Data',
      description: isHr ? 'Nema tocki mjerenja u testu.' : 'No measurement points found in this test.',
    };
  }

  if (analysis.pattern === 'mixed_sibo_imo') {
    return {
      title: isHr ? 'Mjesoviti obrazac (SIBO + IMO)' : 'Mixed Pattern (SIBO + IMO)',
      description: isHr
        ? `H2 porast >=${BREATH_THRESHOLDS.hydrogenRisePpm} ppm se dogodio do ${BREATH_THRESHOLDS.smallBowelWindowMinutes}. minute (+${analysis.h2Rise} ppm), a CH4 je dosegao ${analysis.peakCH4} ppm.`
        : `H2 rise >=${BREATH_THRESHOLDS.hydrogenRisePpm} ppm occurred by ${BREATH_THRESHOLDS.smallBowelWindowMinutes} minutes (+${analysis.h2Rise} ppm), and CH4 peaked at ${analysis.peakCH4} ppm.`,
    };
  }

  if (analysis.pattern === 'hydrogen_sibo') {
    return {
      title: isHr ? 'H2 pozitivan obrazac (<=90 min)' : 'Hydrogen Positive Pattern (<=90 min)',
      description: isHr
        ? `H2 porast je +${analysis.h2Rise} ppm (vrh u ${analysis.peakH2Minute}. minuti), uz kljucni porast do 90. minute.`
        : `H2 rise is +${analysis.h2Rise} ppm (peak at minute ${analysis.peakH2Minute}), with the key rise happening by 90 minutes.`,
    };
  }

  if (analysis.pattern === 'methane_with_late_h2') {
    return {
      title: isHr ? 'IMO + kasni H2 porast' : 'IMO + Late H2 Rise',
      description: isHr
        ? `CH4 je povisen (${analysis.peakCH4} ppm), ali H2 porast >=${BREATH_THRESHOLDS.hydrogenRisePpm} ppm nastupa tek nakon 90. minute (vjerojatnija kolonicna fermentacija nego rani SIBO signal).`
        : `CH4 is elevated (${analysis.peakCH4} ppm), while H2 rise >=${BREATH_THRESHOLDS.hydrogenRisePpm} ppm appears only after 90 minutes (more compatible with colonic fermentation than early SIBO signal).`,
    };
  }

  if (analysis.pattern === 'methane_imo') {
    return {
      title: isHr ? 'CH4 dominantan obrazac (IMO)' : 'Methane Dominant Pattern (IMO)',
      description: isHr ? `CH4 vrh je ${analysis.peakCH4} ppm.` : `CH4 peak is ${analysis.peakCH4} ppm.`,
    };
  }

  if (analysis.pattern === 'late_h2_colonic') {
    return {
      title: isHr ? 'Kasni porast H2 (>90 min)' : 'Late H2 Rise (>90 min)',
      description: isHr
        ? `H2 porast je +${analysis.h2Rise} ppm, ali tek nakon 90. minute, sto je cesce kolonicni signal nego pozitivan rani SIBO obrazac.`
        : `H2 rise is +${analysis.h2Rise} ppm, but only after 90 minutes, which is more often a colonic signal than a positive early SIBO pattern.`,
    };
  }

  return {
    title: isHr ? 'Normalan obrazac' : 'Normal Pattern',
    description: isHr
      ? `Nema znacajnog porasta (H2 < ${BREATH_THRESHOLDS.hydrogenRisePpm} ppm do 90 min i CH4 < ${BREATH_THRESHOLDS.methanePpm} ppm).`
      : `No significant rise detected (H2 < ${BREATH_THRESHOLDS.hydrogenRisePpm} ppm by 90 min and CH4 < ${BREATH_THRESHOLDS.methanePpm} ppm).`,
  };
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export default function DoctorReport() {
  const { user } = useAuth();
  const { isHr } = useLanguage();

  const copy = {
    loginPrompt: isHr ? 'Prijavi se za pregled i izvoz personaliziranog izvještaja.' : 'Sign in to view and export your personalized report.',
    title: isHr ? 'Personalizirani sažetak' : 'Personalized Summary',
    subtitle: isHr
      ? 'Jedna pregledna stranica za pacijenta i klinicara: pocetni podaci, simptomi, prehrambeni okidaci i izdisajni testovi.'
      : 'One clear page for patients and clinicians: baseline, symptoms, food triggers, and breath tests.',
    generatedOn: isHr ? 'Generirano' : 'Generated',
    printPdf: isHr ? 'Ispiši / Spremi PDF' : 'Print / Save PDF',
    exportWord: isHr ? 'Preuzmi Word (.doc)' : 'Download Word (.doc)',
    patientInfo: isHr ? 'Podaci pacijenta' : 'Patient Information',
    baseline: isHr ? 'Početni baseline (onboarding)' : 'Initial Baseline (Onboarding)',
    primarySymptom: isHr ? 'Primarni simptom' : 'Primary symptom',
    severity: isHr ? 'Početna težina' : 'Initial severity',
    stoolPattern: isHr ? 'Uzorak stolice' : 'Stool pattern',
    suspectedTriggers: isHr ? 'Sumnjivi okidaci' : 'Suspected triggers',
    notProvided: isHr ? 'Nije uneseno' : 'Not provided',
    symptomSummary: isHr ? 'Sažetak simptoma' : 'Symptom Summary',
    avgOverall: isHr ? 'Prosjek ukupnog stanja crijeva' : 'Average overall gut',
    latestOverall: isHr ? 'Zadnje ukupno stanje crijeva' : 'Latest overall gut',
    totalLogs: isHr ? 'Ukupno unosa dnevnika simptoma' : 'Total symptom log entries',
    topBurdens: isHr ? 'Najvece opterecenje simptoma (nizi score = gore)' : 'Main symptom burdens (lower score = worse)',
    symptomAverages: isHr ? 'Prosjeci po simptomu' : 'Averages by symptom',
    recentSymptomLog: isHr ? 'Zadnji unosi dnevnika simptoma' : 'Recent symptom log entries',
    foodSummary: isHr ? 'Sazetak prehrambenih okidaca' : 'Food Trigger Summary',
    topTriggers: isHr ? 'Najcesci okidaci' : 'Most frequent triggers',
    triggerLog: isHr ? 'Dnevnik okidaca (s biljeskama)' : 'Trigger log (with notes)',
    breathSummary: isHr ? 'Sazetak izdisajnih testova' : 'Breath Test Summary',
    latestBreath: isHr ? 'Zadnji izdisajni test' : 'Latest breath test',
    noBreathTests: isHr ? 'Nema spremljenih breath testova.' : 'No saved breath tests.',
    breathHistory: isHr ? 'Povijest breath testova' : 'Breath test history',
    medicalNotice: isHr
      ? 'Napomena: ovo je edukativni sažetak korisničkih unosa, nije dijagnoza.'
      : 'Note: this is an educational summary of user-entered data, not a diagnosis.',
    noData: isHr ? 'Nema podataka' : 'No data',
    date: isHr ? 'Datum' : 'Date',
    overall: isHr ? 'Ukupno stanje crijeva' : 'Overall',
    pain: isHr ? 'Bol' : 'Pain',
    bloating: isHr ? 'Nadutost' : 'Bloating',
    stress: isHr ? 'Stres' : 'Stress',
    notes: isHr ? 'Bilješke' : 'Notes',
    food: isHr ? 'Hrana' : 'Food',
    substrate: isHr ? 'Supstrat' : 'Substrate',
    h2Rise: isHr ? 'H2 porast' : 'H2 rise',
    ch4Peak: isHr ? 'CH4 vrh' : 'CH4 peak',
    interpretation: isHr ? 'Interpretacija' : 'Interpretation',
  };

  const primarySymptomLabelsHr: Record<string, string> = {
    Bloating: 'Nadutost',
    'Abdominal Pain': 'Bol u trbuhu',
    Gas: 'Plinovi',
    'Brain Fog': 'Mentalna magla',
  };

  const stoolPatternLabelsHr: Record<string, string> = {
    Constipation: 'Zatvor',
    Diarrhea: 'Proljev',
    'Mixed/Normal': 'Mijesano/normalno',
  };

  const [onboarding, setOnboarding] = useState<OnboardingData>({});
  const [symptomEntries, setSymptomEntries] = useState<SymptomDiaryEntry[]>([]);
  const [foodLogs, setFoodLogs] = useState<LoggedFood[]>([]);
  const [breathTests, setBreathTests] = useState<BreathTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!user) {
      setOnboarding({});
      setSymptomEntries([]);
      setFoodLogs([]);
      setBreathTests([]);
      setLoadError('');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [onboardingData, symptoms, foods, tests] = await Promise.all([
          getOnboardingData(),
          getSymptomEntries(),
          getFoodLogs(),
          getBreathTests(),
        ]);

        setOnboarding(onboardingData ?? {});
        setSymptomEntries(symptoms);
        setFoodLogs([...foods].sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt)));
        setBreathTests([...tests].sort((a, b) => getBreathTestTimestamp(b) - getBreathTestTimestamp(a)));
        setLoadError('');
      } catch {
        setOnboarding({});
        setSymptomEntries([]);
        setFoodLogs([]);
        setBreathTests([]);
        setLoadError(isHr ? 'Ucavanje izvjestaja nije uspjelo.' : 'Could not load report data.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [user, isHr]);

  const suspectedTriggerList = useMemo(() => {
    const raw = onboarding?.suspectedTriggers ?? '';
    return raw
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [onboarding]);

  const symptomFieldLabels: Record<SymptomField, string> = {
    pain: copy.pain,
    bloating: copy.bloating,
    diarrhea: isHr ? 'Proljev' : 'Diarrhea',
    stress: copy.stress,
    sleep: isHr ? 'San' : 'Sleep',
    energy: isHr ? 'Energija' : 'Energy',
    stool: isHr ? 'Stolica' : 'Stool',
  };

  const primarySymptomValue = onboarding?.primarySymptom
    ? (isHr ? (primarySymptomLabelsHr[onboarding.primarySymptom] ?? onboarding.primarySymptom) : onboarding.primarySymptom)
    : copy.notProvided;

  const stoolPatternValue = onboarding?.stoolPattern
    ? (isHr ? (stoolPatternLabelsHr[onboarding.stoolPattern] ?? onboarding.stoolPattern) : onboarding.stoolPattern)
    : copy.notProvided;

  const symptomAverages = useMemo(() => {
    return SYMPTOM_FIELDS
      .map((field) => ({
        field,
        label: symptomFieldLabels[field],
        average: average(symptomEntries.map((entry) => entry[field])),
      }))
      .filter((item) => item.average !== null)
      .map((item) => ({ ...item, average: item.average as number }));
  }, [symptomEntries, symptomFieldLabels]);

  const topSymptomBurdens = useMemo(
    () => [...symptomAverages].sort((a, b) => a.average - b.average).slice(0, 3),
    [symptomAverages]
  );

  const latestSymptomEntry = symptomEntries[0];
  const avgOverall = average(symptomEntries.map((entry) => entry.overallGut));

  const triggerLogs = useMemo(
    () => foodLogs.filter((item) => item.status === 'trigger'),
    [foodLogs]
  );

  const topTriggers = useMemo(() => {
    const map = new Map<string, { label: string; count: number; lastNote: string; lastLoggedAt: string }>();

    for (const item of triggerLogs) {
      const key = item.name.trim().toLowerCase();
      if (!key) continue;
      const existing = map.get(key);
      const note = item.notes?.trim() ?? '';
      if (existing) {
        existing.count += 1;
        if (!existing.lastNote && note) {
          existing.lastNote = note;
        }
      } else {
        map.set(key, {
          label: item.name.trim(),
          count: 1,
          lastNote: note,
          lastLoggedAt: item.createdAt,
        });
      }
    }

    return [...map.values()]
      .sort((a, b) => (b.count - a.count) || (toTimestamp(b.lastLoggedAt) - toTimestamp(a.lastLoggedAt)))
      .slice(0, 8);
  }, [triggerLogs]);

  const latestBreathTest = breathTests[0];
  const latestBreathInterpretation = latestBreathTest ? getBreathInterpretation(latestBreathTest, isHr) : null;

  const generatedAt = new Date();
  const generatedLabel = generatedAt.toLocaleString(isHr ? 'hr-HR' : 'en-US');
  const fileDate = generatedAt.toISOString().slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    if (!user) return;

    const symptomRows = symptomEntries.slice(0, 14).map((entry) => {
      return `
        <tr>
          <td>${escapeHtml(formatDate(entry.date, isHr))}</td>
          <td>${entry.overallGut}/10</td>
          <td>${entry.pain}/10</td>
          <td>${entry.bloating}/10</td>
          <td>${entry.stress}/10</td>
          <td>${escapeHtml(entry.notes ?? '')}</td>
        </tr>
      `;
    }).join('');

    const foodRows = triggerLogs.slice(0, 14).map((item) => {
      return `
        <tr>
          <td>${escapeHtml(formatDate(item.createdAt, isHr))}</td>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.notes ?? '')}</td>
        </tr>
      `;
    }).join('');

    const breathRows = breathTests.slice(0, 10).map((test) => {
      const peaks = getPeaks(test);
      const interpretation = getBreathInterpretation(test, isHr);
      return `
        <tr>
          <td>${escapeHtml(formatDate(test.testDate ?? test.createdAt, isHr))}</td>
          <td>${escapeHtml(test.substrate)}</td>
          <td>${peaks.h2Rise} ppm</td>
          <td>${peaks.peakCH4} ppm</td>
          <td>${escapeHtml(interpretation.title)}</td>
        </tr>
      `;
    }).join('');

    const suspectedTriggersText = suspectedTriggerList.length > 0 ? suspectedTriggerList.join(', ') : copy.notProvided;
    const topTriggerNotePrefix = isHr ? 'biljeska' : 'note';
    const topTriggerText = topTriggers.length > 0
      ? topTriggers.map((item) => `${item.label} (${item.count}x${item.lastNote ? `; ${topTriggerNotePrefix}: ${item.lastNote}` : ''})`).join(', ')
      : copy.noData;

    const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(copy.title)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
      h1, h2, h3 { margin: 0 0 10px 0; }
      p { margin: 4px 0; }
      .card { border: 1px solid #d1d5db; border-radius: 10px; padding: 12px; margin-bottom: 14px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 12px; vertical-align: top; }
      th { background: #f3f4f6; }
      .muted { color: #4b5563; }
      .small { font-size: 12px; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(copy.title)}</h1>
    <p class="muted small">${escapeHtml(copy.generatedOn)}: ${escapeHtml(generatedLabel)}</p>

    <div class="card">
      <h2>${escapeHtml(copy.patientInfo)}</h2>
      <p><strong>Name:</strong> ${escapeHtml(user.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
    </div>

    <div class="card">
      <h2>${escapeHtml(copy.baseline)}</h2>
      <p><strong>${escapeHtml(copy.primarySymptom)}:</strong> ${escapeHtml(primarySymptomValue)}</p>
      <p><strong>${escapeHtml(copy.severity)}:</strong> ${onboarding?.severity ? `${onboarding.severity}/10` : escapeHtml(copy.notProvided)}</p>
      <p><strong>${escapeHtml(copy.stoolPattern)}:</strong> ${escapeHtml(stoolPatternValue)}</p>
      <p><strong>${escapeHtml(copy.suspectedTriggers)}:</strong> ${escapeHtml(suspectedTriggersText)}</p>
    </div>

    <div class="card">
      <h2>${escapeHtml(copy.symptomSummary)}</h2>
      <div class="grid">
        <p><strong>${escapeHtml(copy.avgOverall)}:</strong> ${avgOverall !== null ? `${avgOverall}/10` : escapeHtml(copy.noData)}</p>
        <p><strong>${escapeHtml(copy.latestOverall)}:</strong> ${latestSymptomEntry ? `${latestSymptomEntry.overallGut}/10` : escapeHtml(copy.noData)}</p>
      </div>
      <p><strong>${escapeHtml(copy.totalLogs)}:</strong> ${symptomEntries.length}</p>
      <p><strong>${escapeHtml(copy.topBurdens)}:</strong> ${topSymptomBurdens.length > 0 ? topSymptomBurdens.map((item) => `${item.label} (${item.average}/10)`).join(', ') : escapeHtml(copy.noData)}</p>
      <table>
        <thead>
          <tr>
            <th>${escapeHtml(copy.date)}</th>
            <th>${escapeHtml(copy.overall)}</th>
            <th>${escapeHtml(copy.pain)}</th>
            <th>${escapeHtml(copy.bloating)}</th>
            <th>${escapeHtml(copy.stress)}</th>
            <th>${escapeHtml(copy.notes)}</th>
          </tr>
        </thead>
        <tbody>
          ${symptomRows || `<tr><td colspan="6">${escapeHtml(copy.noData)}</td></tr>`}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>${escapeHtml(copy.foodSummary)}</h2>
      <p><strong>${escapeHtml(copy.topTriggers)}:</strong> ${escapeHtml(topTriggerText)}</p>
      <table>
        <thead>
          <tr>
            <th>${escapeHtml(copy.date)}</th>
            <th>${escapeHtml(copy.food)}</th>
            <th>${escapeHtml(copy.notes)}</th>
          </tr>
        </thead>
        <tbody>
          ${foodRows || `<tr><td colspan="3">${escapeHtml(copy.noData)}</td></tr>`}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>${escapeHtml(copy.breathSummary)}</h2>
      <p><strong>${escapeHtml(copy.latestBreath)}:</strong> ${latestBreathInterpretation ? `${escapeHtml(latestBreathInterpretation.title)} - ${escapeHtml(latestBreathInterpretation.description)}` : escapeHtml(copy.noBreathTests)}</p>
      <table>
        <thead>
          <tr>
            <th>${escapeHtml(copy.date)}</th>
            <th>${escapeHtml(copy.substrate)}</th>
            <th>${escapeHtml(copy.h2Rise)}</th>
            <th>${escapeHtml(copy.ch4Peak)}</th>
            <th>${escapeHtml(copy.interpretation)}</th>
          </tr>
        </thead>
        <tbody>
          ${breathRows || `<tr><td colspan="5">${escapeHtml(copy.noData)}</td></tr>`}
        </tbody>
      </table>
    </div>

    <p class="small muted">${escapeHtml(copy.medicalNotice)}</p>
  </body>
</html>`;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `sibolytics_summary_${fileDate}.doc`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300">
        {copy.loginPrompt}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300">
        {isHr ? 'Ucavanje izvjestaja...' : 'Loading summary...'}
      </div>
    );
  }

  return (
    <div className="summary-page space-y-8">
      <style>{`
        @page {
          size: A4;
          margin: 14mm;
        }

        @media print {
          aside,
          main > header,
          .no-print {
            display: none !important;
          }

          .summary-page {
            padding: 0 !important;
            margin: 0 !important;
          }

          .report-surface {
            background: #ffffff !important;
            color: #111827 !important;
            border-color: #d1d5db !important;
            box-shadow: none !important;
          }

          .report-muted {
            color: #4b5563 !important;
          }

          .report-table th,
          .report-table td {
            border-color: #d1d5db !important;
            color: #111827 !important;
          }
        }
      `}</style>

      {loadError && (
        <div className="no-print text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {loadError}
        </div>
      )}

      <section className="no-print bg-gradient-to-r from-sky-900/35 via-indigo-900/30 to-slate-900/45 border border-sky-800/35 rounded-3xl p-6 shadow-lg shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="text-sm text-slate-200/90 mt-1 max-w-3xl">{copy.subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handlePrint}
            aria-label={copy.printPdf}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            {copy.printPdf}
          </button>
          <button
            onClick={handleExportWord}
            aria-label={copy.exportWord}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/20"
          >
            <Download className="w-4 h-4" />
            {copy.exportWord}
          </button>
        </div>
      </section>

      <article className="report-surface bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.08)] p-6 md:p-10 space-y-10">
        <section className="pb-5 border-b border-slate-200">
          <h1 className="text-2xl font-semibold">{copy.title}</h1>
          <p className="report-muted text-sm mt-1">
            {copy.generatedOn}: {generatedLabel}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {copy.patientInfo}
            </h3>
            <div className="mt-3 text-sm space-y-1">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {copy.baseline}
            </h3>
            <div className="mt-3 text-sm space-y-1">
              <p><strong>{copy.primarySymptom}:</strong> {primarySymptomValue}</p>
              <p><strong>{copy.severity}:</strong> {onboarding?.severity ? `${onboarding.severity}/10` : copy.notProvided}</p>
              <p><strong>{copy.stoolPattern}:</strong> {stoolPatternValue}</p>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium">{copy.suspectedTriggers}</p>
              {suspectedTriggerList.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {suspectedTriggerList.map((item) => (
                    <span key={item} className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm report-muted mt-1">{copy.notProvided}</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50/45 p-5 md:p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            {copy.symptomSummary}
          </h2>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs uppercase tracking-wide report-muted">{copy.avgOverall}</p>
              <p className="text-lg font-semibold mt-1">{avgOverall !== null ? `${avgOverall}/10` : copy.noData}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs uppercase tracking-wide report-muted">{copy.latestOverall}</p>
              <p className="text-lg font-semibold mt-1">{latestSymptomEntry ? `${latestSymptomEntry.overallGut}/10` : copy.noData}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs uppercase tracking-wide report-muted">{copy.totalLogs}</p>
              <p className="text-lg font-semibold mt-1">{symptomEntries.length}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-medium">{copy.topBurdens}</h3>
              {topSymptomBurdens.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {topSymptomBurdens.map((item) => (
                    <li key={item.field} className="flex justify-between gap-3">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.average}/10</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm report-muted mt-2">{copy.noData}</p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="text-sm font-medium">{copy.symptomAverages}</h3>
              {symptomAverages.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {symptomAverages.map((item) => (
                    <li key={item.field} className="flex justify-between gap-3">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.average}/10</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm report-muted mt-2">{copy.noData}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">{copy.recentSymptomLog}</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="report-table min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-2 text-left">{copy.date}</th>
                    <th className="p-2 text-left">{copy.overall}</th>
                    <th className="p-2 text-left">{copy.pain}</th>
                    <th className="p-2 text-left">{copy.bloating}</th>
                    <th className="p-2 text-left">{copy.stress}</th>
                    <th className="p-2 text-left">{copy.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  {symptomEntries.slice(0, 14).map((entry, index) => (
                    <tr key={entry.id} className={`border-t border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                      <td className="p-2">{formatDate(entry.date, isHr)}</td>
                      <td className="p-2">{entry.overallGut}/10</td>
                      <td className="p-2">{entry.pain}/10</td>
                      <td className="p-2">{entry.bloating}/10</td>
                      <td className="p-2">{entry.stress}/10</td>
                      <td className="p-2">{entry.notes || '-'}</td>
                    </tr>
                  ))}
                  {symptomEntries.length === 0 && (
                    <tr>
                      <td className="p-2 report-muted" colSpan={6}>{copy.noData}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-amber-50/35 p-5 md:p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" />
            {copy.foodSummary}
          </h2>

          <div className="mt-4 rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-medium">{copy.topTriggers}</h3>
            {topTriggers.length > 0 ? (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {topTriggers.map((item) => (
                  <div key={item.label} className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-sm font-medium text-red-800">
                      {item.label} ({item.count}x)
                    </p>
                    {item.lastNote ? (
                      <p className="text-xs text-red-700/90 mt-1">{item.lastNote}</p>
                    ) : (
                      <p className="text-xs text-red-700/70 mt-1">{copy.notes}: -</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm report-muted mt-2">{copy.noData}</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">{copy.triggerLog}</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="report-table min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-2 text-left">{copy.date}</th>
                    <th className="p-2 text-left">{copy.food}</th>
                    <th className="p-2 text-left">{copy.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  {triggerLogs.slice(0, 14).map((item, index) => (
                    <tr key={item.id} className={`border-t border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-red-50/40'}`}>
                      <td className="p-2">{formatDate(item.createdAt, isHr)}</td>
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.notes?.trim() || '-'}</td>
                    </tr>
                  ))}
                  {triggerLogs.length === 0 && (
                    <tr>
                      <td className="p-2 report-muted" colSpan={3}>{copy.noData}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-indigo-50/30 p-5 md:p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Wind className="w-5 h-5 text-indigo-600" />
            {copy.breathSummary}
          </h2>

          <div className="mt-3 rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-medium">{copy.latestBreath}</h3>
            {latestBreathTest && latestBreathInterpretation ? (
              <div className="mt-2 text-sm space-y-1">
                <p>
                  <strong>{formatDate(latestBreathTest.testDate ?? latestBreathTest.createdAt, isHr)}</strong> -{' '}
                  <span className="capitalize">{latestBreathTest.substrate}</span>
                </p>
                <p>{latestBreathInterpretation.title}</p>
                <p className="report-muted">{latestBreathInterpretation.description}</p>
              </div>
            ) : (
              <p className="text-sm report-muted mt-2">{copy.noBreathTests}</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">{copy.breathHistory}</h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
              <table className="report-table min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-2 text-left">{copy.date}</th>
                    <th className="p-2 text-left">{copy.substrate}</th>
                    <th className="p-2 text-left">{copy.h2Rise}</th>
                    <th className="p-2 text-left">{copy.ch4Peak}</th>
                    <th className="p-2 text-left">{copy.interpretation}</th>
                  </tr>
                </thead>
                <tbody>
                  {breathTests.slice(0, 10).map((test, index) => {
                    const peaks = getPeaks(test);
                    const interpretation = getBreathInterpretation(test, isHr);
                    return (
                      <tr key={test.id} className={`border-t border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50/35'}`}>
                        <td className="p-2">{formatDate(test.testDate ?? test.createdAt, isHr)}</td>
                        <td className="p-2 capitalize">{test.substrate}</td>
                        <td className="p-2">{peaks.h2Rise} ppm</td>
                        <td className="p-2">{peaks.peakCH4} ppm</td>
                        <td className="p-2">{interpretation.title}</td>
                      </tr>
                    );
                  })}
                  {breathTests.length === 0 && (
                    <tr>
                      <td className="p-2 report-muted" colSpan={5}>{copy.noData}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-xs text-blue-900/80">{copy.medicalNotice}</p>
        </div>
      </article>
    </div>
  );
}


