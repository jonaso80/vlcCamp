import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { EditIcon, SwitchUserIcon, LogoutIcon, UserIcon } from './icons/Icons';
import { useTranslations } from '../context/LanguageContext';
import { User, MyCamp } from '../types';

/** Rutas que usa el header para enlaces y estado activo */
export const HEADER_ROUTES = {
  home: '/',
  comunidad: '/comunidad',
  contacto: '/contacto',
  cuentaPersonal: '/cuentaPersonal',
  cuentaCamp: '/cuentaCamp',
  gestion: '/gestion',
} as const;

interface HeaderProps {
    onHomeClick: () => void;
    onAuthClick: () => void;
    isAuthenticated: boolean;
    currentUser: User | null;
    onLogout: () => void;
    onAccountClick: () => void;
    onSwitchAccount: () => void;
    onCommunityClick: () => void;
    onContactClick: () => void;
    userCamp: MyCamp | null;
    onMyCampClick: () => void;
    /** Vista actual para mostrar la opción activa (cuenta personal vs campamento) */
    currentView: string;
    onManagementClick: () => void;
    /** Ruta actual (ej. /comunidad, /contacto) para marcar el enlace activo en el nav */
    currentPath: string;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, onAuthClick, isAuthenticated, currentUser, onLogout, onAccountClick, onSwitchAccount, onCommunityClick, onContactClick, userCamp, onMyCampClick, currentView, onManagementClick, currentPath }) => {
  const isActive = (path: string) => currentPath === path || (path === HEADER_ROUTES.gestion && (currentPath.startsWith('/gestion')));
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const { t, setLang, lang } = useTranslations();

  const languages = {
    en: 'English',
    es: 'Español',
    va: 'Valencià'
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setIsUserMenuOpen(prev => !prev);
    } else {
      onAuthClick();
    }
  };

  const handleLangChange = (langKey: 'en' | 'es' | 'va') => {
    setLang(langKey);
    setIsLangMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/70 backdrop-blur-lg shadow-lg border-b border-white/20' 
          : 'bg-white/30 backdrop-blur-sm shadow-md'
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <a href={HEADER_ROUTES.home} onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="cursor-pointer block">
          <Logo width={40} height={40} />
        </a>
        <nav className="flex items-center space-x-4 md:space-x-6 text-slate-600">
          <a
            href={HEADER_ROUTES.home}
            onClick={(e) => { e.preventDefault(); onHomeClick(); }}
            className={`transition-colors p-2 rounded-lg px-2 py-1.5 text-sm font-semibold uppercase tracking-wide ${isActive(HEADER_ROUTES.home) ? 'text-[#8EB8BA] bg-white/50' : 'hover:text-[#8EB8BA] hover:bg-white/50'}`}
            title={t('footer.home')}
          >
            Inicio
          </a>
          {isAuthenticated && (
            <a
              href={HEADER_ROUTES.gestion}
              onClick={(e) => { e.preventDefault(); onManagementClick(); }}
              className={`transition-colors p-2 rounded-lg px-2 py-1.5 text-sm font-semibold uppercase tracking-wide ${isActive(HEADER_ROUTES.gestion) ? 'text-[#8EB8BA] bg-white/50' : 'hover:text-[#8EB8BA] hover:bg-white/50'}`}
            >
              Gestión
            </a>
          )}
          <a
            href={HEADER_ROUTES.comunidad}
            onClick={(e) => { e.preventDefault(); onCommunityClick(); }}
            className={`transition-colors p-2 rounded-lg px-2 py-1.5 text-sm font-semibold uppercase tracking-wide ${isActive(HEADER_ROUTES.comunidad) ? 'text-[#8EB8BA] bg-white/50' : 'hover:text-[#8EB8BA] hover:bg-white/50'}`}
            title={t('header.community')}
          >
            Comunidad
          </a>
          <a
            href={HEADER_ROUTES.contacto}
            onClick={(e) => { e.preventDefault(); onContactClick(); }}
            className={`transition-colors p-2 rounded-lg px-2 py-1.5 text-sm font-semibold uppercase tracking-wide ${isActive(HEADER_ROUTES.contacto) ? 'text-[#8EB8BA] bg-white/50' : 'hover:text-[#8EB8BA] hover:bg-white/50'}`}
            title={t('footer.contact')}
          >
            Contacto
          </a>
          <div className="relative" ref={userMenuRef}>
            <button onClick={handleUserIconClick} className="flex items-center gap-2 hover:text-[#8EB8BA] transition-colors p-2 rounded-lg hover:bg-white/50 px-2 py-1.5 text-sm font-semibold uppercase tracking-wide" title={t('account.title')}>
              <span className="flex-shrink-0 inline-flex [&_svg]:h-5 [&_svg]:w-5" aria-hidden>
                <UserIcon />
              </span>
              <span className={isAuthenticated && currentUser?.name && !userCamp ? 'normal-case' : ''}>
                {!isAuthenticated
                  ? 'Mi cuenta'
                  : userCamp
                    ? currentView === 'my-camp-profile'
                      ? 'Cuenta campamento'
                      : 'Cuenta personal'
                    : currentUser?.name ?? 'Mi cuenta'}
              </span>
            </button>
            {isAuthenticated && isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-md rounded-xl shadow-xl py-1 z-50 animate-fade-in-fast border border-white/50">
                {userCamp && (
                  <>
                    <a
                      href={HEADER_ROUTES.cuentaPersonal}
                      onClick={(e) => { e.preventDefault(); onAccountClick(); setIsUserMenuOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${currentView === 'account' ? 'bg-[#def1f0] text-[#2E4053] font-semibold' : 'text-slate-700 hover:bg-[#def1f0]'}`}
                    >
                      <span className="inline-flex [&_svg]:h-4 [&_svg]:w-4"><UserIcon /></span> Cuenta personal
                    </a>
                    <a
                      href={HEADER_ROUTES.cuentaCamp}
                      onClick={(e) => { e.preventDefault(); onMyCampClick(); setIsUserMenuOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${currentView === 'my-camp-profile' ? 'bg-[#def1f0] text-[#2E4053] font-semibold' : 'text-slate-700 hover:bg-[#def1f0]'}`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center text-base">🏕</span> Cuenta campamento
                    </a>
                    <div className="border-t border-slate-200 my-1" />
                  </>
                )}
                {!userCamp && (
                  <button onClick={() => { onAccountClick(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-[#def1f0] flex items-center gap-2 transition-colors">
                    <EditIcon /> {t('header.editAccount')}
                  </button>
                )}
                <button onClick={() => { onSwitchAccount(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-[#def1f0] flex items-center gap-2 transition-colors">
                  <SwitchUserIcon /> {t('header.switchAccount')}
                </button>
                <button onClick={() => { onLogout(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                 <LogoutIcon /> {t('header.logout')}
                </button>
              </div>
            )}
          </div>
          <div className="relative" ref={langMenuRef}>
            <button onClick={() => setIsLangMenuOpen(prev => !prev)} className="flex items-center cursor-pointer hover:text-[#8EB8BA] transition-colors p-2 rounded-lg hover:bg-white/50">
              <span className="text-sm font-semibold">{lang.toUpperCase()}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isLangMenuOpen && (
               <div className="absolute right-0 mt-2 w-28 bg-white/90 backdrop-blur-md rounded-xl shadow-xl py-1 z-50 animate-fade-in-fast border border-white/50">
                {(Object.keys(languages) as Array<keyof typeof languages>).map((key) => (
                  <button 
                    key={key} 
                    onClick={() => handleLangChange(key)} 
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      lang === key 
                        ? 'bg-[#def1f0] text-[#2E4053] font-semibold' 
                        : 'text-slate-700 hover:bg-[#def1f0]'
                    }`}
                  >
                    {languages[key]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in-fast {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-fast {
    animation: fade-in-fast 0.2s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default Header;
