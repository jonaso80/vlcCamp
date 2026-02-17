import React from 'react';
import { InstagramIcon, PhoneIcon } from './icons/Icons';
import Logo from './Logo';
import { useTranslations } from '../context/LanguageContext';

interface FooterProps {
  onAuthClick: () => void;
  onHomeClick: () => void;
  onContactClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAuthClick, onHomeClick, onContactClick }) => {
  const { t } = useTranslations();

  return (
    <footer className="text-slate-700 mt-auto border-t border-slate-200/50" style={{ backgroundColor: '#98BCB9' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo width={48} height={48} className="mb-3" />
            <h3 className="text-slate-800 font-semibold text-lg mb-2">{t('footer.aboutUs')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/" onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                  {t('footer.home')}
                </a>
              </li>
              <li>
                <a href="/contacto" onClick={(e) => { e.preventDefault(); onContactClick(); }} className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                  {t('footer.contact')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onAuthClick(); }}
                  className="text-slate-600 hover:text-slate-900 transition-colors text-sm"
                >
                  {t('footer.createAccount')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.contactTitle')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-0.5 text-[#2E4053]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <a href="mailto:info.campvlc@gmail.com" className="text-slate-600 hover:text-slate-900 transition-colors break-all">
                  info.campvlc@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-[#2E4053]">
                  <PhoneIcon />
                </span>
                <a href="tel:+34123456789" className="text-slate-600 hover:text-slate-900 transition-colors">
                  +34 123 456 789
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-[#2E4053]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-slate-600">{t('footer.addressValue')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 text-[#2E4053]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-slate-600">{t('footer.hoursValue')}</span>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.followUs')}
            </h3>
            <div className="flex gap-4 mb-6">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-white/30"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-white/30"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-white/30"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
            <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wider mb-3">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">
                  {t('footer.termsOfService')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/10 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} vlcCamp. {t('footer.copyright')}
          </p>
          <div className="flex items-center">
            <Logo width={32} height={32} className="opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
