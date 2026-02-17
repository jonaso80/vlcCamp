import React from 'react';
import { MyCamp } from '../../types';

interface CampSelectorPageProps {
    camps: MyCamp[];
    onSelect: (campId: number) => void;
}

const CampSelectorPage: React.FC<CampSelectorPageProps> = ({ camps, onSelect }) => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E4053] mb-4">
                Tus Campamentos
            </h1>
            <p className="text-slate-600 mb-10 max-w-2xl mx-auto">
                Hemos detectado que tienes varios campamentos registrados con este email.
                Selecciona el que deseas gestionar ahora.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {camps.map((camp) => (
                    <button
                        key={camp.id}
                        onClick={() => onSelect(camp.id)}
                        className="group relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-[#b6e0de]/40 p-6 text-left hover:scale-[1.02] transition-all duration-300 hover:shadow-xl overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-6xl">🏕</span>
                        </div>

                        <h2 className="text-xl font-bold text-[#2E4053] mb-1 pr-8">
                            {camp.name}
                        </h2>
                        <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            {camp.location}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${camp.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {camp.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                            </span>
                            <span className="text-[#2E4053] font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Gestionar →
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CampSelectorPage;
