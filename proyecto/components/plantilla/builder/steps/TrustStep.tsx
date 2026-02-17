import React from 'react';
import { useCampBuilder } from '../CampBuilderContext';

const TrustStep: React.FC = () => {
    const { data, updateData } = useCampBuilder();

    return (
        <div className="space-y-8 animate-fade-in p-1">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-xl font-bold mb-2">Confianza y Seguridad</h2>
                <p className="text-emerald-100 text-sm">
                    Para los padres, la seguridad es lo primero. Muestra tus credenciales y políticas claras.
                </p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ratio Monitores/Niños</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={data.trust.monitorRatio}
                            onChange={(e) => updateData('trust', { monitorRatio: parseInt(e.target.value) || 0 })}
                            className="w-20 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-center font-bold text-lg text-slate-700"
                        />
                        <span className="text-slate-500">niños por cada monitor</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Recomendado: 1 monitor cada 10-15 niños.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contacto Directo</label>
                    <div className="space-y-3">
                        <input
                            type="email"
                            value={data.trust.contactEmail}
                            onChange={(e) => updateData('trust', { contactEmail: e.target.value })}
                            placeholder="Email de soporte"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <input
                            type="tel"
                            value={data.trust.contactPhone}
                            onChange={(e) => updateData('trust', { contactPhone: e.target.value })}
                            placeholder="Teléfono de emergencias"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>
            </section>

            <section>
                <label className="block text-sm font-medium text-slate-700 mb-2">Protocolos de Seguridad</label>
                <textarea
                    value={data.trust.protocols}
                    onChange={(e) => updateData('trust', { protocols: e.target.value })}
                    placeholder="Describe seguros, protocolos médicos, alergias..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-50 focus:bg-white transition-colors"
                />
            </section>

            <section className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-4">
                <div className="text-2xl">🛡️</div>
                <div>
                    <h4 className="font-bold text-amber-900 text-sm">Badge de Verificación</h4>
                    <p className="text-amber-800 text-xs mt-1">
                        Al completar esta sección al 100%, tu campamento obtendrá el sello de "Campamento Verificado" en el listado principal.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default TrustStep;
