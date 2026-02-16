import React, { useState, useEffect } from 'react';
import { getPalette, type PaletteId } from './palettes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface PublicidadData {
  paletteId?: PaletteId;
  title?: string;
  bodyText?: string;
  contactEmail?: string;
  contactPhone?: string;
  images?: string[];
}

interface CampPublicPageProps {
  campId: number;
  onBack: () => void;
}

const CampPublicPage: React.FC<CampPublicPageProps> = ({ campId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [camp, setCamp] = useState<{ id: number; name: string; location: string; publicidad_data: PublicidadData | null } | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/public`);
        if (!res.ok) {
          if (res.status === 404) setError('Campamento no encontrado');
          else setError('Error al cargar');
          return;
        }
        const data = await res.json();
        if (!cancelled) setCamp(data);
      } catch {
        if (!cancelled) setError('Error de conexión');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [campId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#2E4053] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !camp) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-slate-600 mb-4">{error ?? 'Campamento no encontrado'}</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-[#2E4053] font-medium hover:underline"
        >
          ← Volver al inicio
        </button>
      </div>
    );
  }

  const data = camp.publicidad_data || {};
  const palette = getPalette((data.paletteId as PaletteId) || 'verde');
  const images = data.images || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.background, color: palette.text }}>
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 shadow-sm"
        style={{ backgroundColor: palette.primary, color: '#fff' }}
      >
        <h1 className="font-semibold text-lg">{camp.name}</h1>
        <button
          type="button"
          onClick={onBack}
          className="text-white/90 hover:text-white text-sm font-medium"
        >
          ← Inicio
        </button>
      </header>

      {images.length > 0 && (
        <div className="relative w-full aspect-[16/9] bg-slate-200 max-h-[70vh]">
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
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center text-xl"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setCarouselIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center text-xl"
              >
                ›
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCarouselIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === carouselIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        {data.title && (
          <h2 className="text-2xl font-semibold mb-4" style={{ color: palette.primary }}>
            {data.title}
          </h2>
        )}
        {data.bodyText && (
          <div className="prose prose-slate max-w-none whitespace-pre-wrap mb-8">
            {data.bodyText}
          </div>
        )}

        {(data.contactEmail || data.contactPhone) && (
          <footer
            className="rounded-xl px-6 py-4 text-white"
            style={{ backgroundColor: palette.secondary }}
          >
            <p className="font-semibold mb-2">Contacto</p>
            {data.contactEmail && <p>{data.contactEmail}</p>}
            {data.contactPhone && <p>{data.contactPhone}</p>}
          </footer>
        )}
      </div>
    </div>
  );
};

export default CampPublicPage;
