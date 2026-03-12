import React, { useState } from 'react';
import { User, Download, Trash2, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getBreathTests, getFoodLogs, getOnboardingData, getSymptomEntries } from '../services/healthApi';

export default function Settings() {
  const { user, logout, deleteAccount } = useAuth();
  const { isHr } = useLanguage();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const copy = {
    settings: isHr ? 'Postavke' : 'Settings',
    subtitle: isHr ? 'Upravljaj profilom, podacima i privatnoscu.' : 'Manage your profile, data, and privacy preferences.',
    deleteError: isHr ? 'Brisanje racuna nije uspjelo.' : 'Could not delete account.',
    profile: isHr ? 'Profil' : 'Profile',
    dataPrivacy: isHr ? 'Podaci i privatnost' : 'Data & Privacy',
    exportData: isHr ? 'Izvezi moje podatke' : 'Export My Data',
    exportDesc: isHr ? 'Preuzmi JSON datoteku sa svim spremljenim testovima i postavkama.' : 'Download a JSON file containing all your saved tests and settings.',
    exportBtn: isHr ? 'Izvezi' : 'Export',
    clearData: isHr ? 'Obrisi moje podatke' : 'Clear My Data',
    clearDesc: isHr ? 'Trajno obrisi sve svoje podatke s ovog uredaja.' : 'Permanently delete all your data from this device.',
    clearBtn: isHr ? 'Obrisi podatke' : 'Clear Data',
    cancel: isHr ? 'Odustani' : 'Cancel',
    confirmDelete: isHr ? 'Potvrdi brisanje' : 'Confirm Delete',
    logout: isHr ? 'Odjavi se' : 'Log out',
    exportError: isHr ? 'Izvoz podataka nije uspio.' : 'Could not export data.',
    exporting: isHr ? 'Izvoz...' : 'Exporting...',
  };

  const handleExportData = async () => {
    if (!user) return;

    setError('');
    setIsExporting(true);
    try {
      const [onboarding, symptoms, foodLogs, breathTests] = await Promise.all([
        getOnboardingData(),
        getSymptomEntries(),
        getFoodLogs(),
        getBreathTests(),
      ]);

      const data: Record<string, any> = {
        profile: user,
        onboarding,
        symptoms,
        foodLogs,
        breathTests,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sibolytics_data_${user.email}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError(copy.exportError);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = () => {
    if (!user) return;

    const run = async () => {
      setError('');
      const result = await deleteAccount();
      if (!result.success) {
        setError(result.error || copy.deleteError);
        return;
      }

      navigate('/');

    };

    run();
  };

  const handleLogout = () => {
    const run = async () => {
      await logout();
      navigate('/');
    };
    run();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">{copy.settings}</h1>
        <p className="text-slate-400">{copy.subtitle}</p>
      </header>

      {error && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-blue-400" />
          {copy.profile}
        </h2>
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-semibold shadow-lg shadow-blue-900/20">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-medium text-white">{user?.name}</h3>
            <p className="text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Data & Privacy Section */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-indigo-400" />
          {copy.dataPrivacy}
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
            <div>
                <h3 className="text-sm font-medium text-slate-200">{copy.exportData}</h3>
                <p className="text-xs text-slate-500 mt-1">{copy.exportDesc}</p>
              </div>
            <button 
              onClick={handleExportData}
              disabled={isExporting}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" /> {isExporting ? copy.exporting : copy.exportBtn}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-red-900/20">
            <div>
              <h3 className="text-sm font-medium text-red-400">{copy.clearData}</h3>
              <p className="text-xs text-slate-500 mt-1">{copy.clearDesc}</p>
            </div>
            {!showClearConfirm ? (
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 bg-red-950/50 hover:bg-red-900/50 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" /> {copy.clearBtn}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="text-slate-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  {copy.cancel}
                </button>
                <button 
                  onClick={handleClearData}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {copy.confirmDelete}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="pt-4">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-2 py-1"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{copy.logout}</span>
        </button>
      </div>
    </div>
  );
}

