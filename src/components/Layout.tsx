import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Activity, 
  FileText, 
  Table, 
  Utensils, 
  BookOpen, 
  Settings, 
  AlertCircle,
  Wind,
  LogOut,
  User as UserIcon,
  Heart,
  Bot,
  Home,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const routePrefetchers: Record<string, () => void> = {
  '/home': () => { void import('../pages/Home'); },
  '/dashboard': () => { void import('../pages/Dashboard'); },
  '/breath-tests': () => { void import('../pages/BreathTests'); },
  '/food-hub': () => { void import('../pages/FoodHub'); },
  '/education': () => { void import('../pages/Education'); },
  '/nih-evidence': () => { void import('../pages/NIHEvidence'); },
  '/sibo-success': () => { void import('../pages/SiboSuccess'); },
  '/settings': () => { void import('../pages/Settings'); },
  '/onboarding': () => { void import('../pages/Onboarding'); },
};

function NavItem({ icon, label, to, onPrefetch }: { icon: React.ReactNode, label: string, to: string, onPrefetch?: () => void }) {
  return (
    <NavLink 
      to={to}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? 'text-white' : 'text-slate-500'}>
            {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getHeaderContent = () => {
    switch (location.pathname) {
      case '/home':
        return { title: 'Home' };
      case '/dashboard':
        return { title: `Good morning, ${user?.name || 'Guest'}`, subtitle: 'Here is your daily digestive overview.' };
      case '/breath-tests':
        return { title: 'Breath Tests', subtitle: 'Track and analyze your SIBO breath test results over time.' };
      case '/food-hub':
        return { title: 'Food Hub', subtitle: 'Log meals, scan ingredients, and discover your personal triggers.' };
      case '/education':
        return { title: 'Education & Research', subtitle: 'Explore evidence-based information about SIBO and IBS.' };
      case '/nih-evidence':
        return { title: 'NIH Evidence Bot', subtitle: 'Ask questions answered strictly using NIH sources.' };
      case '/sibo-success':
        return { title: 'SIBO Success', subtitle: 'Success stories and relapse prevention strategies.' };
      case '/settings':
        return { title: 'Settings', subtitle: 'Manage your profile, data, and privacy preferences.' };
      default:
        return { title: 'SIBOlytics', subtitle: '' };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen md:h-screen bg-slate-950 text-slate-50 font-sans flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden">
      {isMobileSidebarOpen && (
        <button
          className="md:hidden fixed inset-0 z-30 bg-slate-950/60"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col overflow-y-auto transform transition-transform duration-200 md:static md:z-auto md:w-64 md:max-w-none md:bg-slate-900/50 md:border-b-0 md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 md:hidden flex justify-end">
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Wind className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">SIBOlytics</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem icon={<Home />} label="Home" to="/home" onPrefetch={routePrefetchers['/home']} />
          <NavItem icon={<Table />} label="Dashboard" to="/dashboard" onPrefetch={routePrefetchers['/dashboard']} />
          <NavItem icon={<Activity />} label="Breath Tests" to="/breath-tests" onPrefetch={routePrefetchers['/breath-tests']} />
          <NavItem icon={<Utensils />} label="Food Hub" to="/food-hub" onPrefetch={routePrefetchers['/food-hub']} />
          <NavItem icon={<BookOpen />} label="Education" to="/education" onPrefetch={routePrefetchers['/education']} />
          <NavItem icon={<Bot />} label="NIH Evidence" to="/nih-evidence" onPrefetch={routePrefetchers['/nih-evidence']} />
          <NavItem icon={<Heart />} label="SIBO Success" to="/sibo-success" onPrefetch={routePrefetchers['/sibo-success']} />
        </nav>

        <div className="p-4 mt-auto space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Medical Disclaimer</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              SIBOlytics is an educational tool. Always consult your gastroenterologist before changing your treatment.
            </p>
          </div>
          
          <nav className="space-y-1">
            <NavItem icon={<Settings />} label="Settings" to="/settings" onPrefetch={routePrefetchers['/settings']} />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-auto md:h-screen overflow-visible md:overflow-y-auto relative">
        {/* Top Header */}
        <header className="sticky top-0 z-40 isolate bg-slate-950/90 supports-[backdrop-filter]:bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/60 px-4 md:px-8 py-4 flex items-center justify-between shadow-lg shadow-slate-950/40">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden mt-0.5 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{headerContent.title}</h1>
              {headerContent.subtitle && <p className="text-sm text-slate-400 mt-1">{headerContent.subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-slate-900 p-1.5 rounded-full transition-colors"
            >
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-50">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" /> Profile
                </button>
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <div className="h-px bg-slate-800 my-2"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
