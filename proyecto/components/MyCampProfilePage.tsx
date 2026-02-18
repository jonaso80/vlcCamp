import React from 'react';
import { useTranslations } from '../context/LanguageContext';
import { MyCamp } from '../types';

interface MyCampProfilePageProps {
  camp: MyCamp;
  onBackToAccount: () => void;
}

const PLAN_KEYS = ['monthly', 'semester', 'annual'] as const;

const MyCampProfilePage: React.FC<MyCampProfilePageProps> = ({ camp, onBackToAccount }) => {
  const { t } = useTranslations();
  const planLabelMap: Record<(typeof PLAN_KEYS)[number], string> = {
    monthly: t('campRegistration.plans.monthly'),
    semester: t('campRegistration.plans.semester'),
    annual: t('campRegistration.plans.annual'),
  };
  const planLabel = camp.plan && PLAN_KEYS.includes(camp.plan as (typeof PLAN_KEYS)[number])
    ? planLabelMap[camp.plan as (typeof PLAN_KEYS)[number]]
    : (camp.plan || 'No asignado');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-[#b6e0de]/30 overflow-hidden">
        {/* Banner Section */}
        <div className="h-32 bg-gradient-to-r from-[#2E4053] to-[#4a637d] relative">
          <div className="absolute -bottom-10 left-8 md:left-12">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white text-[#2E4053]">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M10 12v0" /><path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" /><path d="M10 5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" /><path d="M9 11h6" /><path d="M9 15h6" /></svg>
            </div>
          </div>
        </div>

        <div className="pt-14 pb-8 px-8 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E4053]">
                {camp.name}
              </h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                {camp.location}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#b6e0de]/20 text-[#2E4053] rounded-full text-sm font-semibold border border-[#b6e0de]/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="m4.93 4.93 14.14 14.14" /><path d="M2 12h20" /><path d="m4.93 19.07 14.14-14.14" /></svg>
              Plan: <span>{planLabel}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Details */}
            <div className="space-y-6">
              <section>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  Descripción del Campamento
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  "{camp.description || 'Sin descripción disponible actualmente.'}"
                </p>
              </section>
            </div>

            {/* Right Column - Contact & Plan */}
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                Información de Contacto
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Email</p>
                    <p className="text-slate-700 font-medium">{camp.contact_email || 'No proporcionado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase">Teléfono</p>
                    <p className="text-slate-700 font-medium">{camp.contact_phone || 'No proporcionado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
            <button
              type="button"
              onClick={onBackToAccount}
              className="group flex items-center gap-2 px-8 py-3.5 bg-[#2E4053] text-white rounded-2xl font-semibold shadow-lg shadow-[#2E4053]/20 hover:bg-[#3d5a6e] hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
              Volver a Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCampProfilePage;
