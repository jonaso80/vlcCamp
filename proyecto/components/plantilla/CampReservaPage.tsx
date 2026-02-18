import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface CampReservaPageProps {
  campId: number;
  onBack: () => void;
}

const CampReservaPage: React.FC<CampReservaPageProps> = ({ campId, onBack }) => {
  const [campName, setCampName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    padre_madre_tutor: '',
    edad: '',
    dias_en_campamento: '',
    limitaciones: '',
    alergias: '',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/public`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setCampName(data.name || 'Campamento');
        }
      } catch {
        if (!cancelled) setCampName('Campamento');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [campId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const body = {
        nombre: form.nombre.trim() || '',
        apellidos: form.apellidos.trim() || null,
        padre_madre_tutor: form.padre_madre_tutor.trim() || null,
        edad: form.edad === '' ? null : parseInt(form.edad, 10),
        dias_en_campamento: form.dias_en_campamento === '' ? null : parseInt(form.dias_en_campamento, 10),
        limitaciones: form.limitaciones.trim() || null,
        alergias: form.alergias.trim() || null,
      };
      const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/children`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error || 'Error al enviar la inscripción');
      }
      setSuccess(true);
      setForm({ nombre: '', apellidos: '', padre_madre_tutor: '', edad: '', dias_en_campamento: '', limitaciones: '', alergias: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la inscripción');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-[#8EB8BA] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-[#b6e0de]/40 overflow-hidden">
        <div className="bg-gradient-to-r from-[#2E4053] to-[#4a637d] px-6 py-6 text-white">
          <button
            type="button"
            onClick={onBack}
            className="text-white/90 hover:text-white text-sm font-medium mb-2 flex items-center gap-1"
          >
            ← Volver al campamento
          </button>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">
            Inscribir niño/a en el campamento
          </h1>
          <p className="text-white/80 mt-1">{campName}</p>
        </div>

        <div className="p-6 md:p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8EB8BA]/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8EB8BA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#2E4053] mb-2">Inscripción enviada</h2>
              <p className="text-slate-600 mb-6">
                Los datos del niño/a se han registrado correctamente y aparecerán en la gestión del campamento.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3 bg-[#8EB8BA] text-white rounded-xl font-semibold hover:bg-[#7aa8aa] transition-colors"
                >
                  Inscribir otro niño/a
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Volver al campamento
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  value={form.apellidos}
                  onChange={(e) => setForm((f) => ({ ...f, apellidos: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Padre/Madre/Tutor</label>
                <input
                  type="text"
                  value={form.padre_madre_tutor}
                  onChange={(e) => setForm((f) => ({ ...f, padre_madre_tutor: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
                  <input
                    type="number"
                    min={0}
                    value={form.edad}
                    onChange={(e) => setForm((f) => ({ ...f, edad: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Días en campamento</label>
                  <input
                    type="number"
                    min={0}
                    value={form.dias_en_campamento}
                    onChange={(e) => setForm((f) => ({ ...f, dias_en_campamento: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
                    placeholder="Nº de días"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Limitaciones</label>
                <input
                  type="text"
                  value={form.limitaciones}
                  onChange={(e) => setForm((f) => ({ ...f, limitaciones: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alergias</label>
                <input
                  type="text"
                  value={form.alergias}
                  onChange={(e) => setForm((f) => ({ ...f, alergias: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA]"
                  placeholder="Opcional"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                  style={{ backgroundColor: '#8EB8BA' }}
                >
                  {saving ? 'Enviando...' : 'Enviar inscripción'}
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampReservaPage;
