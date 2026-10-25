import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const menuCopy = {
  en: { profile: 'Profile', settings: 'Settings', logout: 'Logout' },
  hr: { profile: 'Profil', settings: 'Postavke', logout: 'Odjava' },
} as const;

export default function UserMenu({ showName = false }: { showName?: boolean }) {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const copy = menuCopy[language];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const goToSettings = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  return (
    <div className="flex items-center gap-4 relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-slate-900 p-1.5 rounded-full transition-colors"
        aria-label={copy.profile}
      >
        {showName && <span className="text-sm font-medium hidden sm:block">{user?.name}</span>}
        <div className="w-10 h-10 rounded-full bg-[#1f6bff] flex items-center justify-center text-white font-extrabold">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-50">
          <button
            onClick={goToSettings}
            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
          >
            <UserIcon className="w-4 h-4" /> {copy.profile}
          </button>
          <button
            onClick={goToSettings}
            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> {copy.settings}
          </button>
          <div className="h-px bg-slate-800 my-2"></div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> {copy.logout}
          </button>
        </div>
      )}
    </div>
  );
}
