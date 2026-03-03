import React, { useState, useEffect } from 'react';
import { Activity, Plus, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BreathTest } from '../types/breathTest';
import BreathChart from '../components/breath/BreathChart';
import TestHistory from '../components/breath/TestHistory';
import AddTestModal from '../components/breath/AddTestModal';

export default function BreathTests() {
  const { user } = useAuth();
  const { isHr } = useLanguage();
  const [tests, setTests] = useState<BreathTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  const copy = {
    insufficient: isHr ? 'Nedovoljno podataka' : 'Insufficient Data',
    emptyTest: isHr ? 'Nije moguće tumačenje praznog testa.' : 'Cannot interpret empty test.',
    normalPattern: isHr ? 'Normalan obrazac' : 'Normal Pattern',
    normalDesc: isHr ? 'Vrijednosti su unutar tipičnih granica. Razgovaraj s liječnikom ako simptomi traju.' : 'Values remain within typical ranges. Discuss with your doctor if symptoms persist.',
    mixedPattern: isHr ? 'Mješoviti obrazac (H2 i CH4)' : 'Mixed Pattern (H2 & CH4)',
    hydrogenPattern: isHr ? 'Hidrogen dominantan obrazac' : 'Hydrogen Dominant Pattern',
    methanePattern: isHr ? 'Metan dominantan obrazac (IMO)' : 'Methane Dominant Pattern (IMO)',
    yourTests: isHr ? 'Tvoji izdisajni testovi' : 'Your Breath Tests',
    subtitle: isHr ? 'Odaberi spremljeni test pa pregledaj graf i tumačenje ispod.' : 'Choose a saved test, then review the chart and interpretation below.',
    addTest: isHr ? 'Dodaj test' : 'Add Test',
    chooseTest: isHr ? 'Odaberi test za prikaz' : 'Choose test to display',
    substrate: isHr ? 'Supstrat' : 'Substrate',
    savedTests: isHr ? 'Spremljeni testovi' : 'Saved Tests',
    interpretation: isHr ? 'Tumačenje testa' : 'Interpretation',
    educational: isHr ? '(Edukativno)' : '(Educational)',
    educationalHint: isHr ? 'Edukativna procjena. Nije medicinska dijagnoza.' : 'Educational heuristic. Not medical diagnosis.',
    educationalDesc: isHr
      ? 'Tumačenje se temelji na općenitim smjernicama (npr. North American Consensus). Rezultate uvijek potvrdi sa svojim gastroenterologom.'
      : 'This interpretation is based on general guidelines (e.g., North American Consensus). Always discuss your results with your gastroenterologist.',
    manageSaved: isHr ? 'Upravljanje spremljenim testovima' : 'Manage Saved Tests',
    noTestSelected: isHr ? 'Nema odabranog testa' : 'No test selected',
    noTestText: isHr ? 'Dodaj prvi izdisajni test za prikaz grafa i edukativnog tumačenja.' : 'Add your first breath test to unlock chart view and educational interpretation.',
    deleteTitle: isHr ? 'Obrisati ovaj izdisajni test?' : 'Delete this breath test?',
    deleteBodyA: isHr ? 'Ova radnja se ne može poništiti. Brišeš' : 'This action cannot be undone. You are deleting the',
    testFrom: isHr ? 'test od' : 'test from',
    cancel: isHr ? 'Odustani' : 'Cancel',
    deleteTest: isHr ? 'Obriši test' : 'Delete Test',
  };

  useEffect(() => {
    if (user) {
      const storedTests = localStorage.getItem(`sibolytics_breathtests_${user.id}`);
      if (storedTests) {
        const parsed: BreathTest[] = JSON.parse(storedTests);
        setTests(parsed);
      } else {
        setTests([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (tests.length === 0) {
      setSelectedTestId(null);
      return;
    }

    const hasSelected = selectedTestId && tests.some((test) => test.id === selectedTestId);
    if (!hasSelected) {
      setSelectedTestId(tests[0].id);
    }
  }, [tests, selectedTestId]);

  const saveTests = (newTests: BreathTest[]) => {
    setTests(newTests);
    if (user) {
      localStorage.setItem(`sibolytics_breathtests_${user.id}`, JSON.stringify(newTests));
    }
  };

  const handleSaveTest = (testData: Omit<BreathTest, 'id' | 'createdAt'>) => {
    const newTest: BreathTest = {
      ...testData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedTests = [newTest, ...tests];
    saveTests(updatedTests);
    setSelectedTestId(newTest.id);
    setIsAdding(false);
  };

  const handleDeleteTest = (id: string) => {
    setDeleteCandidateId(id);
  };

  const confirmDeleteTest = () => {
    if (!deleteCandidateId) return;

    const updatedTests = tests.filter((t) => t.id !== deleteCandidateId);
    saveTests(updatedTests);
    if (selectedTestId === deleteCandidateId) {
      setSelectedTestId(updatedTests.length > 0 ? updatedTests[0].id : null);
    }
    setDeleteCandidateId(null);
  };

  const getInterpretation = (test: BreathTest) => {
    if (!test.data || test.data.length === 0) {
      return { title: copy.insufficient, desc: copy.emptyTest };
    }

    const baselineH2 = test.data[0]?.h2 || 0;
    const peakH2 = Math.max(...test.data.map((d) => d.h2));
    const peakCH4 = Math.max(...test.data.map((d) => d.ch4));
    const h2PeakData = test.data.find((d) => d.h2 === peakH2);
    const h2PeakTime = h2PeakData ? h2PeakData.minute : 0;

    const h2Rise = peakH2 - baselineH2;
    const isH2Positive = h2Rise >= 20;
    const isCH4Positive = peakCH4 >= 10;
    const isEarlyRise = h2PeakTime <= 90;

    let title = copy.normalPattern;
    let desc = copy.normalDesc;

    if (isH2Positive && isCH4Positive) {
      title = copy.mixedPattern;
      desc = isHr
        ? `I hidrogen i metan pokazuju značajan porast. Hidrogen je porastao za ${h2Rise} ppm, a metan je dosegao ${peakCH4} ppm. Ovakav obrazac je često povezan s kombiniranim simptomima.`
        : `Both Hydrogen and Methane show significant elevations. Hydrogen rose by ${h2Rise} ppm and Methane peaked at ${peakCH4} ppm. This is often associated with mixed symptoms (bloating, altered bowel habits).`;
    } else if (isH2Positive) {
      title = copy.hydrogenPattern;
      desc = isHr
        ? `Hidrogen je porastao za ${h2Rise} ppm od početne vrijednosti, s vrhom u ${h2PeakTime}. minuti. ${isEarlyRise ? 'Rani porast (<=90 min) se često povezuje sa SIBO.' : 'Kasniji porast (>90 min) može upućivati na fermentaciju u kolonu.'} Ovaj obrazac se često povezuje s proljevom.`
        : `Hydrogen rose by ${h2Rise} ppm from baseline, peaking at minute ${h2PeakTime}. ${isEarlyRise ? 'An early rise (<=90 min) is classically associated with small intestinal bacterial overgrowth.' : 'A later rise (>90 min) may reflect colonic fermentation.'} This pattern is often associated with diarrhea-predominant symptoms.`;
    } else if (isCH4Positive) {
      title = copy.methanePattern;
      desc = isHr
        ? `Metan je dosegao ${peakCH4} ppm. Povišen metan u bilo kojoj točki testa često je povezan sa zatvorom (Intestinal Methanogen Overgrowth).`
        : `Methane peaked at ${peakCH4} ppm. Elevated methane at any point during the test is often associated with constipation-predominant symptoms (Intestinal Methanogen Overgrowth).`;
    }
    return { title, desc };
  };

  const formatTestOption = (test: BreathTest) => {
    const dateSource = test.testDate ?? test.createdAt;
    const date = new Date(dateSource).toLocaleDateString(isHr ? 'hr-HR' : 'en-US');
    return `${date} - ${test.substrate}`;
  };

  const selectedTest = tests.find((t) => t.id === selectedTestId);
  const selectedInterpretation = selectedTest ? getInterpretation(selectedTest) : null;
  const deleteCandidate = tests.find((t) => t.id === deleteCandidateId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-medium text-white">{copy.yourTests}</h2>
          <p className="text-sm text-slate-400 mt-1">{copy.subtitle}</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" /> {copy.addTest}
        </button>
      </div>

      {tests.length > 0 && (
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
          <label htmlFor="selected-test" className="text-sm font-medium text-slate-200">
            {copy.chooseTest}
          </label>
          <div className="mt-2 flex flex-col lg:flex-row lg:items-center gap-3">
            <select
              id="selected-test"
              value={selectedTestId ?? ''}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="w-full lg:max-w-xl bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            >
              {tests.map((test) => (
                <option key={test.id} value={test.id}>
                  {formatTestOption(test)}
                </option>
              ))}
            </select>
            {selectedTest && (
              <p className="text-xs text-slate-400">
                {copy.substrate}: <span className="capitalize text-slate-200">{selectedTest.substrate}</span>
              </p>
            )}
          </div>
        </section>
      )}

      {selectedTest ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="hidden xl:block xl:col-span-4">
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-slate-200 mb-4">{copy.savedTests}</h3>
              <TestHistory
                tests={tests}
                selectedTestId={selectedTestId}
                onSelect={setSelectedTestId}
                onDelete={handleDeleteTest}
              />
            </div>
          </div>

          <div className="xl:col-span-8 space-y-6">
            <BreathChart test={selectedTest} />

            <div className="bg-linear-to-br from-blue-900/20 to-slate-900/40 border border-blue-900/30 rounded-2xl p-6 md:p-7 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <h2 className="text-lg font-medium text-white">
                  {copy.interpretation} <span className="text-xs text-slate-500 font-normal ml-2">{copy.educational}</span>
                </h2>
              </div>

              <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800/50">
                <h3 className="text-base font-medium text-blue-100 mb-2">{selectedInterpretation?.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {selectedInterpretation?.desc}
                </p>

                <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>{copy.educationalHint}</strong> {copy.educationalDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:hidden bg-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-slate-200 mb-4">{copy.manageSaved}</h3>
              <TestHistory
                tests={tests}
                selectedTestId={selectedTestId}
                onSelect={setSelectedTestId}
                onDelete={handleDeleteTest}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 md:p-12 flex flex-col items-center justify-center text-center">
          <Activity className="w-12 h-12 text-slate-600 mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">{copy.noTestSelected}</h2>
          <p className="text-slate-400 max-w-md">
            {copy.noTestText}
          </p>
        </div>
      )}

      {isAdding && (
        <AddTestModal
          onClose={() => setIsAdding(false)}
          onSave={handleSaveTest}
        />
      )}

      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{copy.deleteTitle}</h3>
                <p className="text-sm text-slate-400 mt-2">
                  {copy.deleteBodyA}{' '}
                  <span className="capitalize text-slate-200">{deleteCandidate.substrate}</span>{' '}
                  {copy.testFrom}{' '}
                  <span className="text-slate-200">{new Date(deleteCandidate.testDate ?? deleteCandidate.createdAt).toLocaleDateString(isHr ? 'hr-HR' : 'en-US')}</span>.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {copy.cancel}
              </button>
              <button
                onClick={confirmDeleteTest}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
              >
                {copy.deleteTest}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
