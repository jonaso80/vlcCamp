import React, { useCallback, useState } from 'react';
import { useCampBuilder } from '../CampBuilderContext';
import { PALETTES } from '../../palettes';
import { uploadImage } from '../uploadUtils';
import FeedbackModal from '../../../ui/FeedbackModal';

const IdentityStep: React.FC = () => {
    const { data, updateData, campId } = useCampBuilder();
    const [isUploading, setIsUploading] = React.useState(false);
    const [feedback, setFeedback] = useState<{
        isOpen: boolean;
        type: 'success' | 'error' | 'info';
        title?: string;
        message: string
    }>({
        isOpen: false,
        type: 'info',
        message: ''
    });

    const closeFeedback = () => setFeedback(prev => ({ ...prev, isOpen: false }));

    const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && campId) {
            setIsUploading(true);
            try {
                const url = await uploadImage(file, campId, 'logo');
                updateData('identity', { logoUrl: url });
            } catch (error) {
                console.error('Error uploading logo:', error);
                setFeedback({
                    isOpen: true,
                    type: 'error',
                    title: 'Error',
                    message: 'Error al subir el logo. Inténtalo de nuevo.'
                });
            } finally {
                setIsUploading(false);
            }
        }
    }, [updateData, campId]);

    return (
        <div className="space-y-8 p-1">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-xl font-bold mb-2">Identidad Visual</h2>
                <p className="text-slate-200 text-sm">
                    Elige los colores que mejor representen la energía de tu campamento.
                    Esta será la primera impresión que tendrán los padres.
                </p>
            </div>

            {/* Palette Selector */}
            <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">1</span>
                    Elige una Paleta
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PALETTES.map((palette) => (
                        <button
                            key={palette.id}
                            onClick={() => updateData('identity', { paletteId: palette.id })}
                            className={`group relative p-4 rounded-xl border-2 transition-all hover:scale-[1.02] text-left ${data.identity.paletteId === palette.id
                                ? 'border-slate-800 bg-slate-50 shadow-md ring-1 ring-slate-800'
                                : 'border-slate-100 hover:border-slate-300 bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`font-bold ${data.identity.paletteId === palette.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {palette.name}
                                </span>
                                {data.identity.paletteId === palette.id && (
                                    <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded-full font-bold">Activo</span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 h-8 rounded-lg shadow-sm flex items-center justify-center text-[10px] items-end font-mono text-white/80" style={{ backgroundColor: palette.primary }}>Pri</div>
                                <div className="flex-1 h-8 rounded-lg shadow-sm flex items-center justify-center text-[10px] items-end font-mono text-white/80" style={{ backgroundColor: palette.secondary }}>Sec</div>
                                <div className="flex-1 h-8 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-[10px] items-end font-mono text-slate-400" style={{ backgroundColor: palette.background }}>Bg</div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Logo Uploader */}
            <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">2</span>
                    Sube tu Logo
                </h3>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors relative group">
                    <input
                        type="file"
                        accept="image/png, image/svg+xml"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {data.identity.logoUrl ? (
                        <div className="flex flex-col items-center">
                            <img src={data.identity.logoUrl} alt="Logo preview" className="h-24 object-contain mb-4" />
                            <p className="text-sm text-emerald-600 font-medium">¡Logo subido con éxito!</p>
                            <p className="text-xs text-slate-400 mt-1">Haz clic para cambiarlo</p>
                        </div>
                    ) : isUploading ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                ⏳
                            </div>
                            <p className="text-slate-700 font-medium">Subiendo...</p>
                        </div>
                    ) : (
                        <div>
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform">
                                📂
                            </div>
                            <p className="text-slate-700 font-medium">Arrastra tu logo aquí o haz clic</p>
                            <p className="text-slate-400 text-sm mt-1">Recomendado: PNG o SVG con fondo transparente</p>
                        </div>
                    )}
                </div>
            </section>

            {feedback.isOpen && (
                <FeedbackModal
                    type={feedback.type}
                    title={feedback.title}
                    message={feedback.message}
                    onClose={closeFeedback}
                />
            )}
        </div>
    );
};

export default IdentityStep;
