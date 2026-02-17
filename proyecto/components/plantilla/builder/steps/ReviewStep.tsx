import React, { useState } from 'react';
import { useCampBuilder } from '../CampBuilderContext';
import FeedbackModal from '../../../ui/FeedbackModal';

const ReviewStep: React.FC = () => {
    const { data, saveCamp, isSaving } = useCampBuilder();
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

    // Calculate completion score
    const calculateScore = () => {
        let score = 0;
        let total = 0;

        // Identity
        total += 2;
        if (data.identity.paletteId) score++;
        if (data.identity.logoUrl) score++;

        // Content
        total += 3;
        if (data.content.title) score++;
        if (data.content.description) score++;
        if (data.content.images.length > 0) score++;

        // Trust
        total += 3;
        if (data.trust.monitorRatio > 0) score++;
        if (data.trust.contactEmail) score++;
        if (data.trust.protocols) score++;

        // Schedule
        total += 1;
        if (data.schedule.length > 0) score++;

        return Math.round((score / total) * 100);
    };

    const completionScore = calculateScore();
    const isVerified = completionScore >= 80;

    const closeFeedback = () => {
        setFeedback(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="space-y-8 animate-fade-in p-1">
            <div className="bg-slate-800 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">{completionScore}% Completado</h2>
                    <p className="text-slate-400 mb-6">Nivel de calidad de tu página</p>

                    <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden max-w-md mx-auto mb-6">
                        <div
                            className={`h-full transition-all duration-1000 ease-out ${completionScore < 50 ? 'bg-orange-500' :
                                completionScore < 80 ? 'bg-yellow-400' : 'bg-green-500'
                                }`}
                            style={{ width: `${completionScore}%` }}
                        ></div>
                    </div>

                    {isVerified ? (
                        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/50">
                            <span>✅</span>
                            <span className="font-bold">Badge VERIFICADO desbloqueado</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full border border-orange-500/50">
                            <span>⚠️</span>
                            <span className="font-bold">Completa más campos para verificar</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">Resumen</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex justify-between">
                            <span>Fotos subidas:</span>
                            <span className="font-bold">{data.content.images.length}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Actividades en agenda:</span>
                            <span className="font-bold">{data.schedule.length}</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Ratio monitores:</span>
                            <span className="font-bold">1:{data.trust.monitorRatio}</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h3 className="font-bold text-emerald-900 mb-2">¡Casi listo!</h3>
                    <p className="text-sm text-emerald-800 mb-4">
                        Tu campamento está listo para ser publicado. Recuerda que siempre podrás editar esta información desde tu panel de gestión.
                    </p>
                    <button
                        onClick={async () => {
                            const success = await saveCamp();
                            if (success) {
                                setFeedback({
                                    isOpen: true,
                                    type: 'success',
                                    title: '¡Publicado!',
                                    message: 'Campamento guardado y publicado con éxito'
                                });
                            } else {
                                setFeedback({
                                    isOpen: true,
                                    type: 'error',
                                    title: 'Error',
                                    message: 'Error al guardar. Por favor, inténtalo de nuevo.'
                                });
                            }
                        }}
                        disabled={isSaving}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-70 disabled:cursor-wait flex justify-center items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                Guardando...
                            </>
                        ) : (
                            <>🚀 Publicar Ahora</>
                        )}
                    </button>
                </div>
            </div>

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

export default ReviewStep;
