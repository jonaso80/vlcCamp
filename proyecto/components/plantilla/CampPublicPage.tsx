import React, { useState, useEffect } from 'react';
import { getPalette, type PaletteId } from './palettes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface CampPublicPageProps {
  campId: number;
  onBack: () => void;
}

const CampPublicPage: React.FC<CampPublicPageProps> = ({ campId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [camp, setCamp] = useState<any>(null);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !camp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">😕 Vaya...</h2>
          <p className="text-slate-600 mb-6">{error ?? 'Campamento no encontrado'}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Prioritize new builder data (camp_details), fallback to legacy data (publicidad_data)
  const details = camp.camp_details || {};
  const legacy = camp.publicidad_data || {};

  const identity = details.identity || {};
  const content = details.content || {};
  const trust = details.trust || {};
  const schedule = Array.isArray(details.schedule) ? details.schedule : [];

  const paletteId: PaletteId = identity.paletteId || legacy.paletteId || 'verde';
  const palette = getPalette(paletteId);

  const title = content.title || legacy.title || camp.name;
  const description = content.description || legacy.bodyText || '';
  // Merge images: content images first, then legacy
  const images = [...(content.images || []), ...(legacy.images || [])];
  const coverImage = images[0] || null;

  const contactEmail = trust.contactEmail || legacy.contactEmail;
  const contactPhone = trust.contactPhone || legacy.contactPhone;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: palette.background }}>
      {/* Navbar Overlay */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center transition-all bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold transition-all"
        >
          ← Volver
        </button>
        <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {camp.location || 'Campamento'}
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative h-[50vh] min-h-[400px]">
        {coverImage ? (
          <img src={coverImage} className="w-full h-full object-cover" alt={title} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-2xl">
            {title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            {identity.logoUrl && (
              <img src={identity.logoUrl} alt="Logo" className="h-16 w-16 md:h-20 md:w-20 object-contain mb-4 drop-shadow-lg" />
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-2 leading-tight drop-shadow-lg">{title}</h1>
            <div className="flex flex-wrap gap-3 mt-4">
              {trust.monitorRatio > 0 && (
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold border border-white/30">
                  🛡️ Ratio 1:{trust.monitorRatio}
                </span>
              )}
              {trust.certifications?.map((cert: string, idx: number) => (
                <span key={idx} className="bg-emerald-500/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold border border-emerald-400/50">
                  ✅ {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* Description Section */}
        <section className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: palette.text }}>
            <span className="w-8 h-1 rounded-full" style={{ backgroundColor: palette.primary }}></span>
            Sobre el campamento
          </h2>
          <div className="prose prose-lg prose-slate max-w-none leading-relaxed opacity-90" style={{ color: palette.text }}>
            {description ? (
              <p className="whitespace-pre-line">{description}</p>
            ) : (
              <p className="italic opacity-50">Sin descripción disponible.</p>
            )}
          </div>
        </section>

        {/* Gallery Preview (if more than 1 image) */}
        {images.length > 1 && (
          <section className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6" style={{ color: palette.text }}>Galería</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.slice(1, 5).map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-40 object-cover rounded-xl shadow-sm hover:scale-105 transition-transform duration-300" />
              ))}
            </div>
          </section>
        )}

        {/* Schedule Section */}
        {schedule.length > 0 && (
          <section className="animate-fade-in bg-white/50 dark:bg-black/10 rounded-3xl p-8 border border-slate-200/50">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: palette.secondary }}>
              📅 Un día típico
              <span className="text-sm font-normal py-1 px-3 bg-white rounded-full shadow-sm text-slate-500">Ejemplo de agenda</span>
            </h2>
            <div className="relative pl-8 space-y-8 border-l-2 border-slate-200 ml-3">
              {schedule.map((item: any, idx: number) => (
                <div key={idx} className="relative group">
                  <span
                    className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125"
                    style={{ backgroundColor: palette.primary }}
                  ></span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-bold text-lg text-slate-700">{item.time}</span>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
                    <span className="font-medium text-slate-600 text-lg">{item.activity}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trust & Contact Section */}
        <section className="grid md:grid-cols-2 gap-6 animate-fade-in">
          {(contactEmail || contactPhone) && (
            <div className="bg-slate-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 opacity-90">📞 Contacto Directo</h3>
                <div className="space-y-3">
                  {contactEmail && (
                    <p className="flex items-center gap-3 text-lg hover:text-emerald-300 transition-colors break-all">
                      <span>✉️</span> <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                    </p>
                  )}
                  {contactPhone && (
                    <p className="flex items-center gap-3 text-lg hover:text-emerald-300 transition-colors break-all">
                      <span>📱</span> <a href={`tel:${contactPhone}`}>{contactPhone}</a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {trust.protocols && (
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: palette.primary }}>
                🛡️ Seguridad y Protocolos
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm break-words whitespace-pre-wrap">
                {trust.protocols}
              </p>
            </div>
          )}
        </section>

      </main>

      {/* Footer CTA */}
      <div className="sticky bottom-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200 flex justify-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <button
          className="w-full max-w-md py-4 rounded-xl font-bold text-white text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          style={{ backgroundColor: palette.primary }}
        >
          Reservar Plaza Ahora
        </button>
      </div>

    </div>
  );
};

export default CampPublicPage;
