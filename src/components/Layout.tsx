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
  X,
  Languages,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const routePrefetchers: Record<string, () => void> = {
  '/home': () => { void import('../pages/Home'); },
  '/dashboard': () => { void import('../pages/Dashboard'); },
  '/symptom-diary': () => { void import('../pages/SymptomDiary'); },
  '/breath-tests': () => { void import('../pages/BreathTests'); },
  '/food-hub': () => { void import('../pages/FoodHub'); },
  '/education': () => { void import('../pages/Education'); },
  '/nih-evidence': () => { void import('../pages/NIHEvidence'); },
  '/sibo-success': () => { void import('../pages/SiboSuccess'); },
  '/settings': () => { void import('../pages/Settings'); },
  '/onboarding': () => { void import('../pages/Onboarding'); },
};

const languageCopy = {
  en: {
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      symptomLog: 'Symptom Log',
      breathTests: 'Breath Tests',
      foodHub: 'Food Hub',
      education: 'Education',
      nihAssistant: 'NIH AI Assistant',
      siboSuccess: 'SIBO Success',
      settings: 'Settings',
    },
    header: {
      home: 'Home',
      dashboardTitle: (name: string) => `Good morning, ${name}`,
      dashboardSubtitle: 'Here is your daily digestive overview.',
      symptomDiaryTitle: 'Daily Symptom Diary',
      symptomDiarySubtitle: 'Log your daily symptoms to track trends over time.',
      breathTestsTitle: 'Breath Tests',
      breathTestsSubtitle: 'Track and analyze your SIBO breath test results over time.',
      foodHubTitle: 'Food Hub',
      foodHubSubtitle: 'Log meals, scan ingredients, and discover your personal triggers.',
      educationTitle: 'Education & Research',
      educationSubtitle: 'Explore evidence-based information about SIBO and IBS.',
      nihTitle: 'NIH AI Assistant',
      nihSubtitle: 'Ask questions answered strictly using NIH sources.',
      successTitle: 'SIBO Success',
      successSubtitle: 'Success stories and relapse prevention strategies.',
      settingsTitle: 'Settings',
      settingsSubtitle: 'Manage your profile, data, and privacy preferences.',
    },
    misc: {
      guest: 'Guest',
      medicalDisclaimer: 'Medical Disclaimer',
      disclaimerText: 'SIBOlytics is an educational tool. Always consult your gastroenterologist before changing your treatment.',
      language: 'Language',
      english: 'English',
      croatian: 'Croatian',
      profile: 'Profile',
      logout: 'Logout',
    },
  },
  hr: {
    nav: {
      home: 'Početna',
      dashboard: 'Nadzorna ploča',
      symptomLog: 'Dnevnik simptoma',
      breathTests: 'Izdisajni testovi',
      foodHub: 'Prehrana',
      education: 'Edukacija',
      nihAssistant: 'NIH AI Asistent',
      siboSuccess: 'SIBO Uspjesi',
      settings: 'Postavke',
    },
    header: {
      home: 'Početna',
      dashboardTitle: (name: string) => `Dobro jutro, ${name}`,
      dashboardSubtitle: 'Ovdje je tvoj dnevni pregled probave.',
      symptomDiaryTitle: 'Dnevnik simptoma',
      symptomDiarySubtitle: 'Bilježi dnevne simptome kako bi pratio trendove kroz vrijeme.',
      breathTestsTitle: 'Izdisajni testovi',
      breathTestsSubtitle: 'Prati i analiziraj svoje rezultate izdisajnih testova kroz vrijeme.',
      foodHubTitle: 'Prehrana',
      foodHubSubtitle: 'Bilježi obroke, skeniraj sastojke i otkrij osobne triggere.',
      educationTitle: 'Edukacija i istraživanja',
      educationSubtitle: 'Istraži informacije o SIBO i IBS temeljene na dokazima.',
      nihTitle: 'NIH AI Asistent',
      nihSubtitle: 'Postavi pitanje i dobij odgovor koristeći samo NIH izvore.',
      successTitle: 'SIBO Uspjesi',
      successSubtitle: 'Priče o uspjehu i strategije prevencije relapsa.',
      settingsTitle: 'Postavke',
      settingsSubtitle: 'Upravljaj profilom, podacima i privatnošću.',
    },
    misc: {
      guest: 'Gost',
      medicalDisclaimer: 'Medicinsko upozorenje',
      disclaimerText: 'SIBOlytics je edukativni alat. Uvijek se posavjetujte s gastroenterologom prije promjene terapije.',
      language: 'Jezik',
      english: 'Engleski',
      croatian: 'Hrvatski',
      profile: 'Profil',
      logout: 'Odjava',
    },
  },
} as const;

function NavItem({
  icon,
  label,
  to,
  onPrefetch,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  onPrefetch?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
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
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const copy = languageCopy[language];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setIsLanguageMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getHeaderContent = () => {
    switch (location.pathname) {
      case '/home':
        return { title: copy.header.home };
      case '/dashboard':
        return { title: copy.header.dashboardTitle(user?.name || copy.misc.guest), subtitle: copy.header.dashboardSubtitle };
      case '/symptom-diary':
        return { title: copy.header.symptomDiaryTitle, subtitle: copy.header.symptomDiarySubtitle };
      case '/breath-tests':
        return { title: copy.header.breathTestsTitle, subtitle: copy.header.breathTestsSubtitle };
      case '/food-hub':
        return { title: copy.header.foodHubTitle, subtitle: copy.header.foodHubSubtitle };
      case '/education':
        return { title: copy.header.educationTitle, subtitle: copy.header.educationSubtitle };
      case '/nih-evidence':
        return { title: copy.header.nihTitle, subtitle: copy.header.nihSubtitle };
      case '/sibo-success':
        return { title: copy.header.successTitle, subtitle: copy.header.successSubtitle };
      case '/settings':
        return { title: copy.header.settingsTitle, subtitle: copy.header.settingsSubtitle };
      default:
        return { title: 'SIBOlytics', subtitle: '' };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen md:h-screen bg-slate-950 text-slate-50 font-sans flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden">
      {isMobileSidebarOpen && (
        <button
          className="md:hidden fixed inset-0 z-40 bg-slate-950/60"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col overflow-y-auto transform transition-transform duration-200 md:static md:z-auto md:w-64 md:max-w-none md:bg-slate-900/50 md:border-b-0 md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
          <NavItem icon={<Home />} label={copy.nav.home} to="/home" onPrefetch={routePrefetchers['/home']} />
          <NavItem icon={<Table />} label={copy.nav.dashboard} to="/dashboard" onPrefetch={routePrefetchers['/dashboard']} />
          <NavItem icon={<FileText />} label={copy.nav.symptomLog} to="/symptom-diary" onPrefetch={routePrefetchers['/symptom-diary']} />
          <NavItem icon={<Activity />} label={copy.nav.breathTests} to="/breath-tests" onPrefetch={routePrefetchers['/breath-tests']} />
          <NavItem icon={<Utensils />} label={copy.nav.foodHub} to="/food-hub" onPrefetch={routePrefetchers['/food-hub']} />
          <NavItem icon={<BookOpen />} label={copy.nav.education} to="/education" onPrefetch={routePrefetchers['/education']} />
          <NavItem icon={<Bot />} label={copy.nav.nihAssistant} to="/nih-evidence" onPrefetch={routePrefetchers['/nih-evidence']} />
          <NavItem icon={<Heart />} label={copy.nav.siboSuccess} to="/sibo-success" onPrefetch={routePrefetchers['/sibo-success']} />
        </nav>

        <div className="p-4 mt-auto space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">{copy.misc.medicalDisclaimer}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {copy.misc.disclaimerText}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
              <Languages className="w-3.5 h-3.5" />
              {copy.misc.language}
            </label>
            <div className="relative" ref={languageDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLanguageMenuOpen((open) => !open)}
                className="w-full flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-900 transition-colors"
                aria-haspopup="menu"
                aria-expanded={isLanguageMenuOpen ? 'true' : 'false'}
                aria-controls="language-menu"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-semibold text-blue-300">
                    {language === 'en' ? 'EN' : 'HR'}
                  </span>
                  <span className="truncate text-slate-400">
                    {language === 'en' ? copy.misc.english : copy.misc.croatian}
                  </span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageMenuOpen && (
                <div
                  id="language-menu"
                  role="menu"
                  className="absolute inset-x-0 top-full mt-1 z-20 rounded-lg border border-slate-800 bg-slate-950 p-1"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full text-left rounded-md px-2 py-1.5 text-xs transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                  >
                    {copy.misc.english}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('hr');
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full text-left rounded-md px-2 py-1.5 text-xs transition-colors ${language === 'hr' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                  >
                    {copy.misc.croatian}
                  </button>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem icon={<Settings />} label={copy.nav.settings} to="/settings" onPrefetch={routePrefetchers['/settings']} />
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-auto md:h-screen overflow-visible md:overflow-y-auto relative">
        <header className="sticky top-0 z-30 isolate bg-slate-950/90 supports-backdrop-filter:bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/60 px-4 md:px-8 py-4 flex items-center justify-between shadow-lg shadow-slate-950/40">
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
                  <UserIcon className="w-4 h-4" /> {copy.misc.profile}
                </button>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> {copy.nav.settings}
                </button>
                <div className="h-px bg-slate-800 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> {copy.misc.logout}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
