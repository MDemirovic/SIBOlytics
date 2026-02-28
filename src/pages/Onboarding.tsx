import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    primarySymptom: '',
    severity: 5,
    stoolPattern: '',
    suspectedTriggers: ''
  });

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setError('');
      setIsSubmitting(true);
      const result = await completeOnboarding(formData);
      setIsSubmitting(false);
      if (!result.success) {
        setError(result.error || 'Could not complete onboarding.');
        return;
      }
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Wind className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-white">Welcome, {user?.name}</span>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? 'Symptoms' : 'Triggers'}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold text-white">Let's establish your baseline</h2>
            <p className="text-sm text-slate-400">This helps us personalize your dashboard.</p>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">What is your primary symptom?</label>
              <div className="grid grid-cols-2 gap-3">
                {['Bloating', 'Abdominal Pain', 'Gas', 'Brain Fog'].map(sym => (
                  <button
                    key={sym}
                    onClick={() => setFormData({...formData, primarySymptom: sym})}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.primarySymptom === sym 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Overall severity (1-10): <span className="text-white">{formData.severity}</span>
              </label>
              <input 
                type="range" 
                min="1" max="10" 
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: parseInt(e.target.value)})}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Typical stool pattern</label>
              <div className="grid grid-cols-3 gap-3">
                {['Constipation', 'Diarrhea', 'Mixed/Normal'].map(pat => (
                  <button
                    key={pat}
                    onClick={() => setFormData({...formData, stoolPattern: pat})}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.stoolPattern === pat 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {pat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold text-white">Suspected Triggers</h2>
            <p className="text-sm text-slate-400">Do you already know any foods that bother you?</p>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">List suspected triggers (optional)</label>
              <textarea 
                rows={4}
                value={formData.suspectedTriggers}
                onChange={(e) => setFormData({...formData, suspectedTriggers: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                placeholder="e.g., Garlic, onion, lactose, apples..."
              />
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs text-blue-300 leading-relaxed">
                <strong>Note:</strong> We will use this to highlight potential risks when you scan your meals.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleNext}
            disabled={isSubmitting || (step === 1 && (!formData.primarySymptom || !formData.stoolPattern))}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            {step === 1 ? 'Next Step' : (isSubmitting ? 'Saving...' : 'Go to Dashboard')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
