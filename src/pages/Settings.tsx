import React, { useState } from 'react';
import { User, Download, Trash2, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleExportData = () => {
    if (!user) return;
    
    // Gather all user data from localStorage
    const data: Record<string, any> = {
      profile: user,
      onboarding: JSON.parse(localStorage.getItem(`sibolytics_onboarding_${user.id}`) || 'null'),
      breathTests: JSON.parse(localStorage.getItem(`sibolytics_breathtests_${user.id}`) || '[]'),
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
  };

  const handleClearData = () => {
    if (!user) return;

    const run = async () => {
      setError('');
      const result = await deleteAccount();
      if (!result.success) {
        setError(result.error || 'Could not delete account.');
        return;
      }

      localStorage.removeItem(`sibolytics_onboarding_${user.id}`);
      localStorage.removeItem(`sibolytics_breathtests_${user.id}`);
      localStorage.removeItem(`sibolytics_foodlog_${user.id}`);
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
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your profile, data, and privacy preferences.</p>
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
          Profile
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
          Data & Privacy
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
            <div>
              <h3 className="text-sm font-medium text-slate-200">Export My Data</h3>
              <p className="text-xs text-slate-500 mt-1">Download a JSON file containing all your saved tests and settings.</p>
            </div>
            <button 
              onClick={handleExportData}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-red-900/20">
            <div>
              <h3 className="text-sm font-medium text-red-400">Clear My Data</h3>
              <p className="text-xs text-slate-500 mt-1">Permanently delete all your data from this device.</p>
            </div>
            {!showClearConfirm ? (
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 bg-red-950/50 hover:bg-red-900/50 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear Data
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="text-slate-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClearData}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Confirm Delete
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
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
}
