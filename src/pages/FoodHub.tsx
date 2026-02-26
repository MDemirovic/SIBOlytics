import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle2, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { foods, FoodItem } from '../data/foods_from_file';
import { useAuth } from '../context/AuthContext';

interface LoggedFood {
  id: string;
  name: string;
  amount: string;
  status: 'safe' | 'caution' | 'trigger';
  notes?: string;
  createdAt: string;
}

export default function FoodHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'database' | 'log'>('database');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Personal Log State
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', amount: '', status: 'safe' as const, notes: '' });

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`sibolytics_foodlog_${user.id}`);
      if (stored) {
        setLoggedFoods(JSON.parse(stored));
      }
    }
  }, [user]);

  const saveLoggedFoods = (newFoods: LoggedFood[]) => {
    setLoggedFoods(newFoods);
    if (user) {
      localStorage.setItem(`sibolytics_foodlog_${user.id}`, JSON.stringify(newFoods));
    }
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    const food: LoggedFood = {
      ...newFood,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    saveLoggedFoods([food, ...loggedFoods]);
    setIsAddingFood(false);
    setNewFood({ name: '', amount: '', status: 'safe', notes: '' });
  };

  const handleDeleteFood = (id: string) => {
    if (window.confirm('Delete this logged food?')) {
      saveLoggedFoods(loggedFoods.filter(f => f.id !== id));
    }
  };

  const filteredDatabase = foods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLog = loggedFoods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (food.notes && food.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getBadgeConfig = (level: FoodItem['fodmapLevel']) => {
    switch (level) {
      case 'low':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          label: 'Low FODMAP'
        };
      case 'caution':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          label: 'Caution / Portion'
        };
      case 'high':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          label: 'High FODMAP'
        };
    }
  };

  const getLogBadgeConfig = (status: LoggedFood['status']) => {
    switch (status) {
      case 'safe':
        return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Safe' };
      case 'caution':
        return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Caution' };
      case 'trigger':
        return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Trigger' };
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Food Hub</h1>
        <p className="text-slate-400 max-w-3xl">
          A "low FODMAP" diet temporarily restricts certain fermentable carbs to help identify symptom triggers. 
          Use this database to check foods during your elimination phase. 
        </p>
        <div className="mt-3 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 max-w-3xl">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Educational; individual tolerance varies; consult a dietitian/clinician.</p>
        </div>
      </header>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800 w-full sm:w-auto shrink-0">
          <button 
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'database' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Low FODMAP Database
          </button>
          <button 
            onClick={() => setActiveTab('log')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'log' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Personal Food Log
          </button>
        </div>

        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder={activeTab === 'database' ? "Search foods..." : "Search your log..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === 'database' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDatabase.map(food => {
              const badge = getBadgeConfig(food.fodmapLevel);
              return (
                <div key={food.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm hover:bg-slate-900/60 transition-colors flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-white">{food.name}</h3>
                      <p className="text-xs text-slate-500">{food.category}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${badge.bg} ${badge.color} ${badge.border}`}>
                      {badge.icon}
                      {badge.label}
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-2">
                    {food.fodmapLevel === 'low' && (
                      <div className="text-sm text-emerald-400 font-medium">
                        {food.limitText ? `Limit to: ${food.limitText}` : 'Low FODMAP (limit not specified)'}
                      </div>
                    )}
                    
                    {food.fodmapLevel === 'caution' && (
                      <div className="text-sm text-amber-400 font-medium">
                        {food.limitText ? `Limit to: ${food.limitText}` : 'Portion-dependent (limit not specified)'}
                      </div>
                    )}

                    {food.note && (
                      <div className="mt-3 pt-3 border-t border-slate-800/50 text-xs text-slate-400 leading-relaxed">
                        {food.note}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDatabase.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No foods found matching "{searchQuery}".</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setIsAddingFood(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Food
            </button>
          </div>

          {filteredLog.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-400">No foods logged yet. Add your first food.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredLog.map(food => {
                const badge = getLogBadgeConfig(food.status);
                return (
                  <div key={food.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm flex flex-col group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-white">{food.name}</h3>
                        <p className="text-xs text-slate-500">{new Date(food.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-1 rounded-md border text-xs font-medium ${badge.bg} ${badge.color} ${badge.border}`}>
                          {badge.label}
                        </div>
                        <button 
                          onClick={() => handleDeleteFood(food.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-auto space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-slate-200 font-medium">{food.amount}</span>
                      </div>
                      {food.notes && (
                        <div className="mt-3 pt-3 border-t border-slate-800/50 text-xs text-slate-400 leading-relaxed">
                          {food.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Food Modal */}
      {isAddingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-medium text-white">Log Personal Food</h2>
            </div>
            <form onSubmit={handleAddFood} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Food Name *</label>
                <input 
                  type="text" 
                  required
                  value={newFood.name}
                  onChange={e => setNewFood({...newFood, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Avocado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Amount *</label>
                <input 
                  type="text" 
                  required
                  value={newFood.amount}
                  onChange={e => setNewFood({...newFood, amount: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 1/4 whole, 20g"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Reaction Status *</label>
                <select 
                  value={newFood.status}
                  onChange={e => setNewFood({...newFood, status: e.target.value as any})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="safe">Safe (Green)</option>
                  <option value="caution">Caution (Orange)</option>
                  <option value="trigger">Trigger (Red)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes (Optional)</label>
                <textarea 
                  value={newFood.notes}
                  onChange={e => setNewFood({...newFood, notes: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                  placeholder="e.g., Felt bloated 2 hours later"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddingFood(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Save Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
