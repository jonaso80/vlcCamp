import React from 'react';
import { Camp } from '../types';
import { useTranslations } from '../context/LanguageContext';
import Logo from './Logo';

interface HomePageProps {
  camps: Camp[];
  onSelectCamp: (camp: Camp) => void;
}

const HomePage: React.FC<HomePageProps> = () => {
  const { t } = useTranslations();

  return (
    <div className="animate-fade-in py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-xl max-w-2xl text-center border border-white">
        <Logo width={100} height={100} className="mx-auto mb-8" />
        <h1 className="text-4xl font-brand text-[#2E4053] mb-6">
          {t('header.community')}
        </h1>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          Bienvenido al espacio exclusivo para familias vlcCamp.
          <br />
          Inicia sesión para acceder a fotos, actualizaciones y comunicados de los campamentos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="http://localhost:3000/"
            className="px-8 py-3 bg-white text-[#5a9a9c] font-semibold rounded-full shadow-md hover:bg-slate-50 transition-all border border-[#5a9a9c]/30"
          >
            Volver a Inicio
          </a>
          {/* El botón de login está en el header, pero podríamos añadir uno aquí que active el modal si tuviéramos acceso a esa función */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;