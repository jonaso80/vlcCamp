import React, { useState } from 'react';
import { MyCamp } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface DatosExtraPageProps {
  camp: MyCamp;
  onBack: () => void;
  onSaved?: (updated: MyCamp) => void;
}

const DatosExtraPage: React.FC<DatosExtraPageProps> = ({ camp, onBack, onSaved }) => {
  const [location, setLocation] = useState(camp.location ?? '');
  const [capacity, setCapacity] = useState(camp.capacity ?? '');
  const [workers, setWorkers] = useState(camp.workers ?? '');
  const [contactoCorporativo, setContactoCorporativo] = useState(camp.contacto_corporativo ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/camps/${camp.id}/extra`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: location.trim() || null,
          capacity: capacity === '' ? null : parseInt(capacity.toString(), 10),
          workers: workers === '' ? null : parseInt(workers.toString(), 10),
          contacto_corporativo: contactoCorporativo.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }
      const updated = await res.json();
      setSuccess(true);
      onSaved?.(updated);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#2E4053] mb-1">
            Datos del campamento
          </h1>
          <p className="text-slate-500 text-sm">Actualiza la información operativa y de contacto</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#2E4053] font-semibold rounded-xl border border-slate-200 hover:border-[#8EB8BA] hover:shadow-md transition-all group"
        >
          <span className="group-hover:-translate-x-1 transition-transform text-lg">←</span>
          Volver
        </button>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-xl border border-[#b6e0de]/30 overflow-hidden">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-[#2E4053] to-[#45627d] p-8 md:p-10 text-white relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <span className="text-3xl">📋</span> {camp.name}
            </h2>
            <p className="text-slate-200 max-w-lg">
              Esta información ayuda a organizar mejor las actividades y a mantener una comunicación fluida con los coordinadores.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-full bg-white/5 -skew-x-12 transform translate-x-32"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ubicación */}
            <div className="group">
              <label htmlFor="location" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-[#8EB8BA]">
                <span className="text-lg">📍</span> Ubicación operativa
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Valencia, Paterna..."
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-[#8EB8BA]/20 focus:border-[#8EB8BA] focus:bg-white outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Contacto Corporativo */}
            <div className="group">
              <label htmlFor="contacto_corporativo" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-[#8EB8BA]">
                <span className="text-lg">📞</span> Contacto corporativo
              </label>
              <input
                id="contacto_corporativo"
                type="text"
                value={contactoCorporativo}
                onChange={(e) => setContactoCorporativo(e.target.value)}
                placeholder="Email o teléfono de empresa"
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-[#8EB8BA]/20 focus:border-[#8EB8BA] focus:bg-white outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Capacidad */}
            <div className="group">
              <label htmlFor="capacity" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-[#8EB8BA]">
                <span className="text-lg">👥</span> Plazas disponibles
              </label>
              <div className="relative">
                <input
                  id="capacity"
                  type="number"
                  min={0}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Número de plazas"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-[#8EB8BA]/20 focus:border-[#8EB8BA] focus:bg-white outline-none transition-all placeholder:text-slate-300"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">personas</span>
              </div>
            </div>

            {/* Trabajadores */}
            <div className="group">
              <label htmlFor="workers" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 transition-colors group-focus-within:text-[#8EB8BA]">
                <span className="text-lg">🛠️</span> Equipo técnico
              </label>
              <div className="relative">
                <input
                  id="workers"
                  type="number"
                  min={0}
                  value={workers}
                  onChange={(e) => setWorkers(e.target.value)}
                  placeholder="Número de coordinadores"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-[#8EB8BA]/20 focus:border-[#8EB8BA] focus:bg-white outline-none transition-all placeholder:text-slate-300"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">miembros</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex items-center gap-3 animate-shake">
                <span className="text-xl">⚠️</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-r-xl flex items-center gap-3 animate-bounce-in">
                <span className="text-xl">✅</span>
                <span className="text-sm font-medium">¡Datos actualizados con éxito!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 px-8 bg-[#2E4053] text-white rounded-[1.25rem] font-bold text-lg shadow-lg shadow-[#2E4053]/20 hover:bg-[#3d5a6e] hover:-translate-y-1 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              {saving ? (
                <>
                  <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Guardando cambios...
                </>
              ) : (
                <>✨ Guardar información</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DatosExtraPage;
