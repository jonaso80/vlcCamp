import React, { useState, useCallback } from 'react';
import { PALETTES, type PaletteId } from './palettes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface PublicidadPageProps {
  campId: number;
  campName: string;
  onBack: () => void;
  onPublished?: () => void;
}

const PublicidadPage: React.FC<PublicidadPageProps> = ({ campId, campName, onBack, onPublished }) => {
  const [paletteId, setPaletteId] = useState<PaletteId>('verde');
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newUrls.push(URL.createObjectURL(files[i]));
    }
    setImages((prev) => [...prev, ...newUrls]);
    e.target.value = '';
  }, []);

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setCarouselIndex((i) => (i >= next.length && next.length > 0 ? next.length - 1 : i));
      return next;
    });
  };

  const blobUrlToBase64 = (url: string): Promise<string> => {
    return fetch(url)
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(fr.result as string);
            fr.onerror = reject;
            fr.readAsDataURL(blob);
          })
      );
  };

  const handleSubir = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const imageBase64List = await Promise.all(images.map(blobUrlToBase64));
      const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/publicidad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paletteId,
          title,
          bodyText,
          contactEmail,
          contactPhone,
          images: imageBase64List,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }
      setSubmitSuccess(true);
      onPublished?.();
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Error al publicar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2E4053]">
          Plantilla de publicidad
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-slate-600 hover:text-[#2E4053] font-medium"
        >
          ← Volver a Gestión
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Editor */}
        <div className="space-y-8">
          <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#b6e0de]/40 p-6">
            <h2 className="text-lg font-semibold text-[#2E4053] mb-4">Paleta de colores</h2>
            <div className="flex flex-wrap gap-3">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaletteId(p.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                    paletteId === p.id
                      ? 'border-[#2E4053] bg-[#def1f0]'
                      : 'border-slate-200 hover:border-[#8EB8BA]'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-slate-300"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span className="text-sm font-medium text-slate-700">{p.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#b6e0de]/40 p-6">
            <h2 className="text-lg font-semibold text-[#2E4053] mb-4">Carrusel de fotos</h2>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#8EB8BA] file:text-white file:font-medium hover:file:bg-[#7aa8aa]"
            />
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {images.map((url, i) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#b6e0de]/40 p-6">
            <h2 className="text-lg font-semibold text-[#2E4053] mb-4">Texto</h2>
            <input
              type="text"
              placeholder="Título de la página"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 mb-3 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
            />
            <textarea
              placeholder="Descripción o contenido principal..."
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
            />
          </section>

          <section className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#b6e0de]/40 p-6">
            <h2 className="text-lg font-semibold text-[#2E4053] mb-4">Contacto</h2>
            <input
              type="email"
              placeholder="Email de contacto"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 mb-3 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
            />
          </section>

          <div className="flex flex-col gap-2">
            {submitError && (
              <p className="text-red-600 text-sm">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-green-600 text-sm font-medium">Publicado correctamente. Tu campamento aparecerá en &quot;Campamentos que confían en nosotros&quot;.</p>
            )}
            <button
              type="button"
              onClick={handleSubir}
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[#2E4053] text-white rounded-xl font-semibold hover:bg-[#3d5a6e] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Subiendo...' : 'Subir y publicar'}
            </button>
          </div>
        </div>

        {/* Vista previa */}
        <div className="lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-[#2E4053] mb-4">Vista previa</h2>
          <div
            className="rounded-2xl shadow-xl overflow-hidden border border-slate-200"
            style={{
              backgroundColor: palette.background,
              color: palette.text,
            }}
          >
            <header
              className="px-6 py-4"
              style={{ backgroundColor: palette.primary, color: '#fff' }}
            >
              <h3 className="font-semibold text-lg">{campName || 'Tu campamento'}</h3>
            </header>

            {images.length > 0 && (
              <div className="relative aspect-[16/9] bg-slate-200">
                <img
                  src={images[carouselIndex]}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCarouselIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setCarouselIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                    >
                      ›
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCarouselIndex(i)}
                          className={`w-2 h-2 rounded-full ${
                            i === carouselIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="p-6">
              {title && (
                <h4 className="text-xl font-semibold mb-2" style={{ color: palette.primary }}>
                  {title}
                </h4>
              )}
              {bodyText && <p className="text-sm leading-relaxed whitespace-pre-wrap">{bodyText}</p>}
            </div>

            {(contactEmail || contactPhone) && (
              <footer
                className="px-6 py-4 text-sm"
                style={{ backgroundColor: palette.secondary, color: '#fff' }}
              >
                <p className="font-medium mb-1">Contacto</p>
                {contactEmail && <p>{contactEmail}</p>}
                {contactPhone && <p>{contactPhone}</p>}
              </footer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicidadPage;
