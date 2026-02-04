import React from 'react';
import { MyCamp } from '../types';

interface MyCampProfilePageProps {
  camp: MyCamp;
  onBackToAccount: () => void;
}

const MyCampProfilePage: React.FC<MyCampProfilePageProps> = ({ camp, onBackToAccount }) => {
  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#b6e0de]/40 p-8 md:p-10">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2E4053] mb-6">
          Perfil de tu campamento
        </h1>
        <dl className="space-y-4 text-slate-700">
          <div>
            <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Nombre</dt>
            <dd className="mt-1 text-lg">{camp.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Ubicación</dt>
            <dd className="mt-1">{camp.location}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Descripción</dt>
            <dd className="mt-1 leading-relaxed">{camp.description || '—'}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Plan</dt>
            <dd className="mt-1">{camp.plan || '—'}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Contacto (teléfono)</dt>
            <dd className="mt-1">{camp.contact_phone || '—'}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Contacto (email)</dt>
            <dd className="mt-1">{camp.contact_email || '—'}</dd>
          </div>
        </dl>
        <div className="mt-8 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onBackToAccount}
            className="px-6 py-3 bg-[#2E4053] text-white rounded-full font-medium hover:bg-[#3d5a6e] transition-colors"
          >
            Volver a Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCampProfilePage;
