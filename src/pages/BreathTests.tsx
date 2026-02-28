import React, { useState, useEffect } from 'react';
import { Activity, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BreathTest } from '../types/breathTest';
import BreathChart from '../components/breath/BreathChart';
import TestHistory from '../components/breath/TestHistory';
import AddTestModal from '../components/breath/AddTestModal';

export default function BreathTests() {
  const { user } = useAuth();
  const [tests, setTests] = useState<BreathTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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

    const hasSelected = selectedTestId && tests.some(test => test.id === selectedTestId);
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
      createdAt: new Date().toISOString()
    };
    const updatedTests = [newTest, ...tests];
    saveTests(updatedTests);
    setSelectedTestId(newTest.id);
    setIsAdding(false);
  };

  const handleDeleteTest = (id: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      const updatedTests = tests.filter(t => t.id !== id);
      saveTests(updatedTests);
      if (selectedTestId === id) {
        setSelectedTestId(updatedTests.length > 0 ? updatedTests[0].id : null);
      }
    }
  };

  const getInterpretation = (test: BreathTest) => {
    if (!test.data || test.data.length === 0) {
      return { title: 'Insufficient Data', desc: 'Cannot interpret empty test.' };
    }

    const baselineH2 = test.data[0]?.h2 || 0;
    const peakH2 = Math.max(...test.data.map(d => d.h2));
    const peakCH4 = Math.max(...test.data.map(d => d.ch4));
    const h2PeakData = test.data.find(d => d.h2 === peakH2);
    const h2PeakTime = h2PeakData ? h2PeakData.minute : 0;

    const h2Rise = peakH2 - baselineH2;
    const isH2Positive = h2Rise >= 20;
    const isCH4Positive = peakCH4 >= 10;
    const isEarlyRise = h2PeakTime <= 90;

    let title = 'Normal Pattern';
    let desc = 'Values remain within typical ranges. Discuss with your doctor if symptoms persist.';

    if (isH2Positive && isCH4Positive) {
      title = 'Mixed Pattern (H2 & CH4)';
      desc = `Both Hydrogen and Methane show significant elevations. Hydrogen rose by ${h2Rise} ppm and Methane peaked at ${peakCH4} ppm. This is often associated with mixed symptoms (bloating, altered bowel habits).`;
    } else if (isH2Positive) {
      title = 'Hydrogen Dominant Pattern';
      desc = `Hydrogen rose by ${h2Rise} ppm from baseline, peaking at minute ${h2PeakTime}. ${isEarlyRise ? 'An early rise (<=90 min) is classically associated with small intestinal bacterial overgrowth.' : 'A later rise (>90 min) may reflect colonic fermentation.'} This pattern is often associated with diarrhea-predominant symptoms.`;
    } else if (isCH4Positive) {
      title = 'Methane Dominant Pattern (IMO)';
      desc = `Methane peaked at ${peakCH4} ppm. Elevated methane at any point during the test is often associated with constipation-predominant symptoms (Intestinal Methanogen Overgrowth).`;
    }

    return { title, desc };
  };

  const formatTestOption = (test: BreathTest) => {
    const date = new Date(test.createdAt).toLocaleDateString();
    return `${date} - ${test.substrate}`;
  };

  const selectedTest = tests.find(t => t.id === selectedTestId);
  const selectedInterpretation = selectedTest ? getInterpretation(selectedTest) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-medium text-white">Your Breath Tests</h2>
          <p className="text-sm text-slate-400 mt-1">
            Choose a saved test, then review the chart and interpretation below.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" /> Add Test
        </button>
      </div>

      {tests.length > 0 && (
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
          <label htmlFor="selected-test" className="text-sm font-medium text-slate-200">
            Choose test to display
          </label>
          <div className="mt-2 flex flex-col lg:flex-row lg:items-center gap-3">
            <select
              id="selected-test"
              value={selectedTestId ?? ''}
              onChange={(e) => setSelectedTestId(e.target.value)}
              className="w-full lg:max-w-xl bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            >
              {tests.map(test => (
                <option key={test.id} value={test.id}>
                  {formatTestOption(test)}
                </option>
              ))}
            </select>
            {selectedTest && (
              <p className="text-xs text-slate-400">
                Substrate: <span className="capitalize text-slate-200">{selectedTest.substrate}</span>
              </p>
            )}
          </div>
        </section>
      )}

      {selectedTest ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="hidden xl:block xl:col-span-4">
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-slate-200 mb-4">Saved Tests</h3>
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
                  Interpretation <span className="text-xs text-slate-500 font-normal ml-2">(Educational)</span>
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
                    <strong>Educational heuristic. Not medical diagnosis.</strong> This interpretation is based on general guidelines (e.g., North American Consensus). Always discuss your results with your gastroenterologist.
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:hidden bg-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-slate-200 mb-4">Manage Saved Tests</h3>
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
          <h2 className="text-xl font-medium text-white mb-2">No test selected</h2>
          <p className="text-slate-400 max-w-md">
            Add your first breath test to unlock chart view and educational interpretation.
          </p>
        </div>
      )}

      {isAdding && (
        <AddTestModal
          onClose={() => setIsAdding(false)}
          onSave={handleSaveTest}
        />
      )}
    </div>
  );
}
