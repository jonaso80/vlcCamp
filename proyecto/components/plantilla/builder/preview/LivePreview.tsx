import React from 'react';
import { useCampBuilder } from '../CampBuilderContext';
import { getPalette } from '../../palettes';

const LivePreview: React.FC = () => {
    const { data } = useCampBuilder();
    const palette = getPalette(data.identity.paletteId);

    return (
        <div className="sticky top-24 self-start select-none transform scale-90 sm:scale-100 transition-transform origin-top">
            {/* iPhone 15 Pro Frame Simulation */}
            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl overflow-hidden flex flex-col">
                {/* Dynamic Notch */}
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800 relative z-10 flex flex-col" style={{ backgroundColor: palette.background }}>

                    {/* Status Bar Mockup */}
                    <div className="flex justify-between px-6 py-3 text-xs font-semibold" style={{ color: palette.text }}>
                        <span>9:41</span>
                        <div className="flex gap-1">
                            <span>Signal</span>
                            <span>Wifi</span>
                            <span>Bat</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar relative">
                        {/* Header */}
                        <div className="h-40 bg-slate-200 relative">
                            {data.content.images[0] ? (
                                <img src={data.content.images[0]} className="w-full h-full object-cover" alt="Camp cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                                    Cover Image
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <h2 className="font-bold text-lg drop-shadow-md leading-tight">{data.content.title || 'Nombre Campamento'}</h2>
                            </div>
                        </div>

                        {/* Palette Preview (Identity) */}
                        <div className="p-4 space-y-6">

                            {/* Description (Content) */}
                            <div className="text-sm" style={{ color: palette.text }}>
                                <p className="font-semibold mb-1">Sobre nosotros</p>
                                {data.content.description ? (
                                    <p className="text-xs opacity-80 leading-relaxed">{data.content.description}</p>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-current opacity-10 rounded"></div>
                                        <div className="h-2 w-3/4 bg-current opacity-10 rounded"></div>
                                        <div className="h-2 w-5/6 bg-current opacity-10 rounded"></div>
                                    </div>
                                )}
                            </div>

                            {/* Trust Info (Trust) */}
                            {(data.trust.monitorRatio > 0 || data.trust.contactPhone) && (
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                                    <h4 className="font-bold text-xs mb-2" style={{ color: palette.secondary }}>Confianza</h4>
                                    <div className="grid grid-cols-2 gap-2 text-center">
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                            <div className="text-lg font-bold" style={{ color: palette.primary }}>1:{data.trust.monitorRatio}</div>
                                            <div className="text-[9px] text-slate-400 uppercase tracking-wider">Ratio</div>
                                        </div>
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                            <div className="text-lg">📞</div>
                                            <div className="text-[9px] text-slate-400 uppercase tracking-wider">24/7</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Schedule (Agenda) */}
                            {Array.isArray(data.schedule) && data.schedule.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-xs mb-3" style={{ color: palette.secondary }}>Agenda Típica</h4>
                                    <div className="relative pl-4 space-y-4 border-l-2 border-slate-100 dark:border-slate-700 ml-2">
                                        {data.schedule.map((item) => (
                                            <div key={item.id} className="relative">
                                                <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full border-2 border-white ring-1 ring-slate-200" style={{ backgroundColor: palette.primary }}></span>
                                                <div className="flex items-start gap-2">
                                                    <span className="text-sm">{item.icon}</span>
                                                    <div>
                                                        <p className="text-xs font-bold opacity-90" style={{ color: palette.text }}>{item.time}</p>
                                                        <p className="text-xs opacity-70" style={{ color: palette.text }}>{item.activity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Call to Action */}
                            <button
                                className="w-full py-3 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all text-sm mt-4"
                                style={{ backgroundColor: palette.primary }}
                            >
                                Reservar Plaza
                            </button>

                        </div>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full"></div>
                </div>
            </div>
            <p className="text-center text-slate-400 text-sm mt-4 font-medium">Vista previa en tiempo real</p>
        </div>
    );
};

export default LivePreview;
