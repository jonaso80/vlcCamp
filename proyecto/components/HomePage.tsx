import React, { useEffect, useRef, useState } from 'react';
import { Camp } from '../types';
import CampCard from './CampCard';
import { useTranslations } from '../context/LanguageContext';
import { ClipboardIcon, UsersIcon, MapIcon, HeartIcon } from './icons/Icons';

interface HomePageProps {
  clientCamps: Camp[];
  onSelectCamp: (camp: Camp) => void;
  onCampRegistrationClick: () => void;
}

// Hook para animaciones con Intersection Observer
const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};

// Componente para sección animada
const AnimatedSection: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const CAMPS_PER_PAGE = 6;

const HomePage: React.FC<HomePageProps> = ({ clientCamps, onSelectCamp, onCampRegistrationClick }) => {
  const { t } = useTranslations();
  const [pageIndex, setPageIndex] = useState(0);
  const totalPages = Math.max(1, Math.ceil(clientCamps.length / CAMPS_PER_PAGE));
  const effectivePage = Math.min(pageIndex, totalPages - 1);
  const visibleCamps = clientCamps.slice(effectivePage * CAMPS_PER_PAGE, effectivePage * CAMPS_PER_PAGE + CAMPS_PER_PAGE);
  const showArrows = clientCamps.length > CAMPS_PER_PAGE;
  const canGoPrev = effectivePage > 0;
  const canGoNext = effectivePage < totalPages - 1;

  return (
    <div className="space-y-20">
      {/* Hero Section - Sin logo redundante */}
      <AnimatedSection className="text-center py-16">
        <h1 className="text-6xl md:text-8xl font-brand text-[#2E4053] mb-6 drop-shadow-sm lowercase reveal-from-left">
          {t('home.heroTitle')}
        </h1>
        <p className="text-2xl md:text-3xl text-slate-700 font-serif font-medium tracking-wide">
          {t('home.heroSubtitle')}
        </p>
        <div className="mt-8 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-[#b6e0de] to-[#def1f0] rounded-full"></div>
        </div>
      </AnimatedSection>

      {/* Quiénes somos Section - Mejorada */}
      <AnimatedSection className="max-w-5xl mx-auto" delay={100}>
        <section className="bg-[#def1f0] rounded-3xl p-10 md:p-14 shadow-lg">
          <h2 className="text-4xl font-serif font-bold text-[#2E4053] mb-8 text-center tracking-tight">
            {t('home.aboutTitle')}
          </h2>
          <div className="space-y-6">
            <p className="text-slate-700 text-lg leading-8 font-light">
              {t('home.intro1')}
            </p>
            <p className="text-slate-700 text-lg leading-8 font-light">
              {t('home.intro2')}
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Campamentos que confían en nosotros Section */}
      <AnimatedSection delay={150}>
        <section>
          <h2 className="text-4xl font-serif font-bold text-[#2E4053] mb-10 text-center tracking-tight">
            {t('home.campsTitle')}
          </h2>
          {clientCamps.length > 0 ? (
            <div className="flex items-stretch gap-4 md:gap-6">
              {showArrows && (
                <button
                  type="button"
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                  disabled={!canGoPrev}
                  aria-label="Ver campamentos anteriores"
                  className="flex-shrink-0 self-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 shadow-md border border-[#b6e0de]/40 flex items-center justify-center text-[#2E4053] hover:bg-[#def1f0] hover:border-[#8EB8BA]/50 disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleCamps.map((camp, index) => (
                  <AnimatedSection key={camp.id} delay={200 + index * 100}>
                    <CampCard camp={camp} onClick={() => onSelectCamp(camp)} />
                  </AnimatedSection>
                ))}
              </div>
              {showArrows && (
                <button
                  type="button"
                  onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={!canGoNext}
                  aria-label="Ver más campamentos"
                  className="flex-shrink-0 self-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 shadow-md border border-[#b6e0de]/40 flex items-center justify-center text-[#2E4053] hover:bg-[#def1f0] hover:border-[#8EB8BA]/50 disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-[#b6e0de]/30 shadow-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#b6e0de] to-[#def1f0] rounded-full flex items-center justify-center shadow-inner">
                <MapIcon className="w-10 h-10 text-white" />
              </div>
              <p className="text-slate-600 text-xl font-light">{t('home.campsEmpty')}</p>
            </div>
          )}
        </section>
      </AnimatedSection>

      {/* Nuestras soluciones Section */}
      <AnimatedSection delay={200}>
        <section>
          <h2 className="text-4xl font-serif font-bold text-[#2E4053] mb-10 text-center tracking-tight">
            {t('home.solutionsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: ClipboardIcon, titleKey: 'solutionManagementTitle', descKey: 'solutionManagementDesc' },
              { icon: UsersIcon, titleKey: 'solutionSocialTitle', descKey: 'solutionSocialDesc' },
              { icon: MapIcon, titleKey: 'solutionLogisticsTitle', descKey: 'solutionLogisticsDesc' },
              { icon: HeartIcon, titleKey: 'solutionSupportTitle', descKey: 'solutionSupportDesc' },
            ].map((solution, index) => (
              <AnimatedSection key={solution.titleKey} delay={250 + index * 100}>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border border-white/50 group">
                  <div className="w-14 h-14 mb-5 bg-gradient-to-br from-[#b6e0de] to-[#8EB8BA] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <solution.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#2E4053] mb-3">
                    {t(`home.${solution.titleKey}`)}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-light">
                    {t(`home.${solution.descKey}`)}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section - Rediseño Total B2B */}
      <AnimatedSection delay={300}>
        <section className="relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Fondo con degradado corporativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#b6e0de] via-[#9ecfcd] to-[#def1f0]"></div>
          
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="relative z-10 p-10 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2E4053] mb-4 tracking-tight">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-xl md:text-2xl text-[#2E4053]/80 font-medium mb-6">
              {t('home.ctaSubtitle')}
            </p>
            <p className="text-lg text-[#2E4053]/70 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              {t('home.ctaText')}
            </p>
            
            <button 
              onClick={onCampRegistrationClick}
              className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-[#2E4053] rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#3d5a6e] to-[#2E4053] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                {t('home.ctaButton')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;
