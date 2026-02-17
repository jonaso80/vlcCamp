import React, { useCallback, useState } from 'react';
import { useCampBuilder } from '../CampBuilderContext';
import { uploadImage } from '../uploadUtils';
import FeedbackModal from '../../../ui/FeedbackModal';

const ContentStep: React.FC = () => {
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

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && campId) {
            setIsUploading(true);
            try {
                const uploadPromises = Array.from(files).map(file =>
                    uploadImage(file, campId, 'gallery')
                );
                const newUrls = await Promise.all(uploadPromises);
                updateData('content', { images: [...data.content.images, ...newUrls] });
            } catch (error) {
                console.error('Error uploading images:', error);
                setFeedback({
                    isOpen: true,
                    type: 'error',
                    title: 'Error',
                    message: 'Error al subir alguna imagen. Inténtalo de nuevo.'
                });
            } finally {
                setIsUploading(false);
            }
        }
    }, [data.content.images, updateData, campId]);

    const removeImage = (index: number) => {
        const newImages = data.content.images.filter((_, i) => i !== index);
        updateData('content', { images: newImages });
    };

    return (
        <div className="space-y-8 animate-fade-in p-1">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-xl font-bold mb-2">Información y Multimedia</h2>
                <p className="text-blue-100 text-sm">
                    Una imagen vale más que mil palabras. Sube fotos de alta calidad y un vídeo para enamorar a los padres.
                </p>
            </div>

            <section className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Título del Campamento</label>
                    <input
                        type="text"
                        value={data.content.title}
                        onChange={(e) => updateData('content', { title: e.target.value })}
                        placeholder="Ej: Campamento de Verano Aventura 2024"
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                    <textarea
                        value={data.content.description}
                        onChange={(e) => updateData('content', { description: e.target.value })}
                        placeholder="Describe la experiencia mágica que vivirán los niños..."
                        rows={5}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    />
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                    Galería de Fotos
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {data.content.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-slate-100">
                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <label className={`border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors aspect-square text-slate-400 hover:text-slate-600 hover:border-slate-300 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {isUploading ? (
                            <>
                                <span className="text-2xl mb-1 animate-spin">⌛</span>
                                <span className="text-xs font-medium">Subiendo...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-2xl mb-1">+</span>
                                <span className="text-xs font-medium">Añadir</span>
                            </>
                        )}
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                    </label>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                    Vídeo Promocional (Opcional)
                </h3>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400">📺</span>
                    </div>
                    <input
                        type="text"
                        value={data.content.videoUrl || ''}
                        onChange={(e) => updateData('content', { videoUrl: e.target.value })}
                        placeholder="https://youtube.com/..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-1">
                    💡 Los campamentos con vídeo tienen un <strong>40% más de inscripciones</strong>.
                </p>
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

export default ContentStep;
