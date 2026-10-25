import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Activity,
  FileText,
  LayoutDashboard,
  Utensils,
  BookOpen,
  Settings,
  Wind,
  Bot,
  Home,
  Menu,
  X,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import UserMenu from './UserMenu';

const routePrefetchers: Record<string, () => void> = {
  '/home': () => { void import('../pages/Home'); },
  '/dashboard': () => { void import('../pages/Dashboard'); },
  '/symptom-diary': () => { void import('../pages/SymptomDiary'); },
  '/breath-tests': () => { void import('../pages/BreathTests'); },
  '/food-hub': () => { void import('../pages/FoodHub'); },
  '/education': () => { void import('../pages/Education'); },
  '/nih-evidence': () => { void import('../pages/NIHEvidence'); },
  '/summary': () => { void import('../pages/DoctorReport'); },
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
      doctorReport: 'Clinical Summary',
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
      doctorReportTitle: 'Summary',
      doctorReportSubtitle: 'Personalized overview for patients and clinicians you can print or export.',
      settingsTitle: 'Settings',
      settingsSubtitle: 'Manage your profile, data, and privacy preferences.',
    },
    misc: {
      guest: 'Guest',
      medicalDisclaimer: 'Medical Disclaimer',
      disclaimerText: 'SIBOlytics is an educational tool. Always consult your gastroenterologist before changing your treatment.',
      disclaimerShort: 'Educational tool. Not medical advice.',
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
      doctorReport: 'Sažetak',
      settings: 'Postavke',
    },
    header: {
      home: 'Početna',
      dashboardTitle: (name: string) => `Dobro jutro, ${name}`,
      dashboardSubtitle: 'Ovdje je tvoj dnevni pregled probave.',
      symptomDiaryTitle: 'Dnevnik simptoma',
      symptomDiarySubtitle: 'Biljezi dnevne simptome kako bi pratio trendove kroz vrijeme.',
      breathTestsTitle: 'Izdisajni testovi',
      breathTestsSubtitle: 'Prati i analiziraj svoje rezultate izdisajnih testova kroz vrijeme.',
      foodHubTitle: 'Prehrana',
      foodHubSubtitle: 'Biljezi obroke, skeniraj sastojke i otkrij osobne triggere.',
      educationTitle: 'Edukacija i istrazivanja',
      educationSubtitle: 'Istrazi informacije o SIBO i IBS temeljene na dokazima.',
      nihTitle: 'NIH AI Asistent',
      nihSubtitle: 'Postavi pitanje i dobij odgovor koristeci samo NIH izvore.',
      doctorReportTitle: 'Sažetak',
      doctorReportSubtitle: 'Personalizirani pregled za pacijenta i kliničara koji možeš ispisati ili izvesti.',
      settingsTitle: 'Postavke',
      settingsSubtitle: 'Upravljaj profilom, podacima i privatnoscu.',
    },
    misc: {
      guest: 'Gost',
      medicalDisclaimer: 'Medicinsko upozorenje',
      disclaimerText: 'SIBOlytics je edukativni alat. Uvijek se posavjetujte s gastroenterologom prije promjene terapije.',
      disclaimerShort: 'Edukativni alat. Nije medicinski savjet.',
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
      className={({ isActive }) => `w-full flex items-center gap-2.5 px-2.5 py-[9px] rounded-[9px] text-[13.5px] font-semibold transition-colors ${isActive
          ? 'bg-[#14203d] text-white'
          : 'text-[#8a94ab] hover:text-slate-200 hover:bg-[#111a30]'
        }`}
    >
      {({ isActive }) => (
        <>
          <span className={isActive ? 'text-[#5b9bff]' : ''}>
            {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function Layout() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const copy = languageCopy[language];
  const { user } = useAuth();
  const isHome = location.pathname === '/home';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
      case '/summary':
      case '/doctor-report':
        return { title: copy.header.doctorReportTitle, subtitle: copy.header.doctorReportSubtitle };
      case '/settings':
        return { title: copy.header.settingsTitle, subtitle: copy.header.settingsSubtitle };
      default:
        return { title: 'SIBOlytics', subtitle: '' };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen md:h-screen bg-[#060a16] text-slate-50 font-sans flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden">
      {isMobileSidebarOpen && (
        <button
          className="md:hidden fixed inset-0 z-40 bg-slate-950/60"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#0a1020] border-r border-[#172038] flex flex-col overflow-y-auto sidebar-no-scrollbar px-3.5 py-5 font-['Manrope',ui-sans-serif,system-ui,sans-serif] transform transition-transform duration-200 md:static md:z-auto md:w-[216px] md:flex-none md:max-w-none md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="md:hidden flex justify-end pb-2">
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 px-2 pb-6">
          <div className="w-7 h-7 rounded-lg bg-[#1f6bff] flex items-center justify-center">
            <Wind className="w-4 h-4 text-white" />
          </div>
          <span className="text-[17px] font-extrabold tracking-[-.02em]">SIBOlytics</span>
        </div>

        <nav className="flex flex-col gap-0.5">
          <NavItem icon={<Home />} label={copy.nav.home} to="/home" onPrefetch={routePrefetchers['/home']} />
          <NavItem icon={<LayoutDashboard />} label={copy.nav.dashboard} to="/dashboard" onPrefetch={routePrefetchers['/dashboard']} />
          <NavItem icon={<FileText />} label={copy.nav.symptomLog} to="/symptom-diary" onPrefetch={routePrefetchers['/symptom-diary']} />
          <NavItem icon={<Activity />} label={copy.nav.breathTests} to="/breath-tests" onPrefetch={routePrefetchers['/breath-tests']} />
          <NavItem icon={<Utensils />} label={copy.nav.foodHub} to="/food-hub" onPrefetch={routePrefetchers['/food-hub']} />
          <NavItem icon={<BookOpen />} label={copy.nav.education} to="/education" onPrefetch={routePrefetchers['/education']} />
          <NavItem icon={<Bot />} label={copy.nav.nihAssistant} to="/nih-evidence" onPrefetch={routePrefetchers['/nih-evidence']} />
          <NavItem icon={<ClipboardList />} label={copy.nav.doctorReport} to="/summary" onPrefetch={routePrefetchers['/summary']} />
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-2.5">
          <div className="flex items-center gap-1">
            <div className="flex-1 min-w-0">
              <NavItem icon={<Settings />} label={copy.nav.settings} to="/settings" onPrefetch={routePrefetchers['/settings']} />
            </div>
            <div className="relative" ref={languageDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLanguageMenuOpen((open) => !open)}
                className="font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] px-1.5 py-0.5 border border-[#1f2a45] rounded-[5px] text-[#6b7690] hover:text-slate-200 hover:border-[#2a4a8a] transition-colors"
                aria-haspopup="menu"
                aria-expanded={isLanguageMenuOpen ? 'true' : 'false'}
                aria-controls="language-menu"
                aria-label={copy.misc.language}
              >
                {language === 'en' ? 'EN' : 'HR'}
              </button>

              {isLanguageMenuOpen && (
                <div
                  id="language-menu"
                  role="menu"
                  className="absolute right-0 bottom-full mb-1 z-20 w-32 rounded-lg border border-[#1f2a45] bg-[#070c1a] p-1"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full text-left rounded-md px-2 py-1.5 text-xs transition-colors ${language === 'en' ? 'bg-[#1f6bff] text-white' : 'text-slate-300 hover:bg-[#121a33]'
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
                    className={`w-full text-left rounded-md px-2 py-1.5 text-xs transition-colors ${language === 'hr' ? 'bg-[#1f6bff] text-white' : 'text-slate-300 hover:bg-[#121a33]'
                      }`}
                  >
                    {copy.misc.croatian}
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="m-0 p-2.5 border-t border-[#172038] text-[11px] leading-[1.45] text-[#56617a]" title={copy.misc.disclaimerText}>
            {copy.misc.disclaimerShort}
          </p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-auto md:h-screen overflow-visible md:overflow-y-auto relative">
        <header className={`sticky top-0 z-30 isolate bg-[#060a16]/90 supports-backdrop-filter:bg-[#060a16]/70 backdrop-blur-xl border-b border-[#172038] px-4 md:px-8 py-4 flex items-center justify-between shadow-lg shadow-slate-950/40 ${isHome ? 'md:hidden' : ''}`}>
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

          <UserMenu showName />
        </header>

        <div className={`max-w-7xl mx-auto w-full ${isHome ? 'flex flex-1 flex-col p-6 md:px-16 md:pt-[52px] md:pb-10' : 'p-8'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
