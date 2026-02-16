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
          capacity: capacity === '' ? null : parseInt(capacity, 10),
          workers: workers === '' ? null : parseInt(workers, 10),
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2E4053]">
          Datos extra
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-slate-600 hover:text-[#2E4053] font-medium"
        >
          ← Volver a Gestión
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#b6e0de]/40 p-6 md:p-8 space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-1">
            Ubicación del campamento
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej. Valencia, Paterna..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-semibold text-slate-700 mb-1">
            Capacidad
          </label>
          <input
            id="capacity"
            type="number"
            min={0}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Número de plazas"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
          />
        </div>

        <div>
          <label htmlFor="workers" className="block text-sm font-semibold text-slate-700 mb-1">
            Trabajadores
          </label>
          <input
            id="workers"
            type="number"
            min={0}
            value={workers}
            onChange={(e) => setWorkers(e.target.value)}
            placeholder="Número de trabajadores"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
          />
        </div>

        <div>
          <label htmlFor="contacto_corporativo" className="block text-sm font-semibold text-slate-700 mb-1">
            Contacto corporativo
          </label>
          <input
            id="contacto_corporativo"
            type="text"
            value={contactoCorporativo}
            onChange={(e) => setContactoCorporativo(e.target.value)}
            placeholder="Email, teléfono o datos de contacto corporativo"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm font-medium">Datos guardados correctamente.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 px-6 bg-[#2E4053] text-white rounded-xl font-semibold hover:bg-[#3d5a6e] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar datos'}
        </button>
      </form>
    </div>
  );
};

export default DatosExtraPage;
