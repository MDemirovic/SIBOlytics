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
        const parsed = JSON.parse(storedTests);
        setTests(parsed);
        if (parsed.length > 0 && !selectedTestId) {
          setSelectedTestId(parsed[0].id);
        }
      }
    }
  }, [user]);

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

  const selectedTest = tests.find(t => t.id === selectedTestId);

  // Educational Interpretation Logic
  const getInterpretation = (test: BreathTest) => {
    if (!test.data || test.data.length === 0) return { title: 'Insufficient Data', desc: 'Cannot interpret empty test.' };
    
    const baselineH2 = test.data[0]?.h2 || 0;
    const peakH2 = Math.max(...test.data.map(d => d.h2));
    const peakCH4 = Math.max(...test.data.map(d => d.ch4));
    
    // Find timing of peaks
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
      desc = `Hydrogen rose by ${h2Rise} ppm from baseline, peaking at minute ${h2PeakTime}. ${isEarlyRise ? 'An early rise (≤90 min) is classically associated with small intestinal bacterial overgrowth.' : 'A later rise (>90 min) may reflect colonic fermentation.'} This pattern is often associated with diarrhea-predominant symptoms.`;
    } else if (isCH4Positive) {
      title = 'Methane Dominant Pattern (IMO)';
      desc = `Methane peaked at ${peakCH4} ppm. Elevated methane at any point during the test is often associated with constipation-predominant symptoms (Intestinal Methanogen Overgrowth).`;
    }

    return { title, desc };
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-xl font-medium text-white">Your Breath Tests</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" /> Add Test
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Left Column: History */}
        <div className="w-1/3 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <TestHistory 
              tests={tests} 
              selectedTestId={selectedTestId} 
              onSelect={setSelectedTestId}
              onDelete={handleDeleteTest}
            />
          </div>
        </div>

        {/* Right Column: Chart & Interpretation */}
        <div className="w-2/3 flex flex-col min-h-0 gap-6">
          {selectedTest ? (
            <>
              <div className="shrink-0">
                <BreathChart test={selectedTest} />
              </div>
              
              {/* Interpretation Card */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-linear-to-br from-blue-900/20 to-slate-900/40 border border-blue-900/30 rounded-2xl p-6 backdrop-blur-sm h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-medium text-white">Interpretation <span className="text-xs text-slate-500 font-normal ml-2">(Educational)</span></h2>
                  </div>
                  
                  <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800/50">
                    <h3 className="text-base font-medium text-blue-100 mb-2">{getInterpretation(selectedTest).title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {getInterpretation(selectedTest).desc}
                    </p>
                    
                    <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p>
                        <strong>Educational heuristic. Not medical diagnosis.</strong> This interpretation is based on general guidelines (e.g., North American Consensus). Always discuss your results with your gastroenterologist.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full">
              <Activity className="w-12 h-12 text-slate-600 mb-4" />
              <h2 className="text-xl font-medium text-white mb-2">No test selected</h2>
              <p className="text-slate-400 max-w-md">Select a test from the history or add a new one to view insights.</p>
            </div>
          )}
        </div>
      </div>

      {isAdding && (
        <AddTestModal 
          onClose={() => setIsAdding(false)} 
          onSave={handleSaveTest} 
        />
      )}
    </div>
  );
}
