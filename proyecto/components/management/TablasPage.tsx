import React, { useState, useEffect, useCallback } from 'react';
import { MyCamp } from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export interface CampChild {
  id: number;
  camp_id: number;
  nombre: string;
  apellidos: string | null;
  padre_madre_tutor: string | null;
  edad: number | null;
  dias_en_campamento: number | null;
  limitaciones: string | null;
  alergias: string | null;
}

export interface CampActivity {
  id: number;
  camp_id: number;
  nombre: string;
  categoria: string | null;
  capacidad_ninos: number | null;
  monitor_a_cargo: string | null;
}

interface TablasPageProps {
  camp: MyCamp;
  onBack: () => void;
}

const TablasPage: React.FC<TablasPageProps> = ({ camp, onBack }) => {
  const [children, setChildren] = useState<CampChild[]>([]);
  const [activities, setActivities] = useState<CampActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChildren = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/camps/${camp.id}/children`);
      if (!res.ok) throw new Error('Error al cargar niños');
      const data = await res.json();
      setChildren(Array.isArray(data) ? data : []);
    } catch (e) {
      setChildren([]);
      setError(e instanceof Error ? e.message : 'Error al cargar niños');
    }
  }, [camp.id]);

  const loadActivities = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/camps/${camp.id}/activities`);
      if (!res.ok) throw new Error('Error al cargar actividades');
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch (e) {
      setActivities([]);
      setError(e instanceof Error ? e.message : 'Error al cargar actividades');
    }
  }, [camp.id]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([loadChildren(), loadActivities()]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [loadChildren, loadActivities]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center animate-fade-in">
        <p className="text-slate-600">Cargando tablas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2E4053]">
          Tablas
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-slate-600 hover:text-[#2E4053] font-medium"
        >
          ← Volver a Gestión
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-amber-100 text-amber-800 text-sm">
          {error}
        </div>
      )}
      <ChildrenTable campId={camp.id} rows={children} onReload={loadChildren} />
      <ActivitiesTable campId={camp.id} rows={activities} onReload={loadActivities} />
    </div>
  );
};

export default TablasPage;

// --- Tabla Niños ---
interface ChildrenTableProps {
  campId: number;
  rows: CampChild[];
  onReload: () => void;
}

const ChildrenTable: React.FC<ChildrenTableProps> = ({ campId, rows, onReload }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CampChild | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    padre_madre_tutor: '',
    edad: '',
    dias_en_campamento: '',
    limitaciones: '',
    alergias: '',
  });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', apellidos: '', padre_madre_tutor: '', edad: '', dias_en_campamento: '', limitaciones: '', alergias: '' });
    setModalOpen(true);
  };

  const openEdit = (row: CampChild) => {
    setEditing(row);
    setForm({
      nombre: row.nombre ?? '',
      apellidos: row.apellidos ?? '',
      padre_madre_tutor: row.padre_madre_tutor ?? '',
      edad: row.edad != null ? String(row.edad) : '',
      dias_en_campamento: row.dias_en_campamento != null ? String(row.dias_en_campamento) : '',
      limitaciones: row.limitaciones ?? '',
      alergias: row.alergias ?? '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (editing) {
        const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/children/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Error al actualizar');
      } else {
        const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/children`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Error al crear');
      }
      closeModal();
      onReload();
    } catch {
      setSaving(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este niño de la lista?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/children/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      onReload();
    } catch {
      // ignore
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#2E4053]">Niños</h2>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-[#8EB8BA] text-white rounded-lg hover:bg-[#7aa8aa] transition-colors"
        >
          Añadir niño
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#b6e0de]/40 bg-white/90 shadow">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="p-3 font-semibold text-slate-700">Id</th>
              <th className="p-3 font-semibold text-slate-700">Nombre</th>
              <th className="p-3 font-semibold text-slate-700">Apellidos</th>
              <th className="p-3 font-semibold text-slate-700">Padre/Madre/Tutor</th>
              <th className="p-3 font-semibold text-slate-700">Edad</th>
              <th className="p-3 font-semibold text-slate-700">Días en campamento</th>
              <th className="p-3 font-semibold text-slate-700">Limitaciones</th>
              <th className="p-3 font-semibold text-slate-700">Alergias</th>
              <th className="p-3 font-semibold text-slate-700 w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-4 text-slate-500 text-center">
                  No hay niños registrados. Añade el primero.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-3">{row.id}</td>
                  <td className="p-3">{row.nombre || '—'}</td>
                  <td className="p-3">{row.apellidos ?? '—'}</td>
                  <td className="p-3">{row.padre_madre_tutor ?? '—'}</td>
                  <td className="p-3">{row.edad ?? '—'}</td>
                  <td className="p-3">{row.dias_en_campamento ?? '—'}</td>
                  <td className="p-3 max-w-[120px] truncate" title={row.limitaciones ?? ''}>{row.limitaciones ?? '—'}</td>
                  <td className="p-3 max-w-[120px] truncate" title={row.alergias ?? ''}>{row.alergias ?? '—'}</td>
                  <td className="p-3">
                    <button type="button" onClick={() => openEdit(row)} className="text-[#8EB8BA] hover:underline mr-2">Editar</button>
                    <button type="button" onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#2E4053] mb-4">{editing ? 'Editar niño' : 'Añadir niño'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
                <input type="text" value={form.apellidos} onChange={(e) => setForm((f) => ({ ...f, apellidos: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Padre/Madre/Tutor</label>
                <input type="text" value={form.padre_madre_tutor} onChange={(e) => setForm((f) => ({ ...f, padre_madre_tutor: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
                  <input type="number" min={0} value={form.edad} onChange={(e) => setForm((f) => ({ ...f, edad: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Días en campamento</label>
                  <input type="number" min={0} value={form.dias_en_campamento} onChange={(e) => setForm((f) => ({ ...f, dias_en_campamento: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Limitaciones</label>
                <input type="text" value={form.limitaciones} onChange={(e) => setForm((f) => ({ ...f, limitaciones: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alergias</label>
                <input type="text" value={form.alergias} onChange={(e) => setForm((f) => ({ ...f, alergias: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-[#8EB8BA] text-white rounded-lg hover:bg-[#7aa8aa] disabled:opacity-60">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

// --- Tabla Actividades ---
interface ActivitiesTableProps {
  campId: number;
  rows: CampActivity[];
  onReload: () => void;
}

const ActivitiesTable: React.FC<ActivitiesTableProps> = ({ campId, rows, onReload }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CampActivity | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    categoria: '',
    capacidad_ninos: '',
    monitor_a_cargo: '',
  });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', categoria: '', capacidad_ninos: '', monitor_a_cargo: '' });
    setModalOpen(true);
  };

  const openEdit = (row: CampActivity) => {
    setEditing(row);
    setForm({
      nombre: row.nombre ?? '',
      categoria: row.categoria ?? '',
      capacidad_ninos: row.capacidad_ninos != null ? String(row.capacidad_ninos) : '',
      monitor_a_cargo: row.monitor_a_cargo ?? '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        nombre: form.nombre.trim() || '',
        categoria: form.categoria.trim() || null,
        capacidad_ninos: form.capacidad_ninos === '' ? null : parseInt(form.capacidad_ninos, 10),
        monitor_a_cargo: form.monitor_a_cargo.trim() || null,
      };
      if (editing) {
        const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/activities/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Error al actualizar');
      } else {
        const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Error al crear');
      }
      closeModal();
      onReload();
    } catch {
      setSaving(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta actividad?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/activities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      onReload();
    } catch {
      // ignore
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#2E4053]">Actividades</h2>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-[#8EB8BA] text-white rounded-lg hover:bg-[#7aa8aa] transition-colors"
        >
          Añadir actividad
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#b6e0de]/40 bg-white/90 shadow">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="p-3 font-semibold text-slate-700">Id</th>
              <th className="p-3 font-semibold text-slate-700">Nombre</th>
              <th className="p-3 font-semibold text-slate-700">Categoría</th>
              <th className="p-3 font-semibold text-slate-700">Capacidad niños</th>
              <th className="p-3 font-semibold text-slate-700">Monitor a cargo</th>
              <th className="p-3 font-semibold text-slate-700 w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-slate-500 text-center">
                  No hay actividades. Añade la primera.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-3">{row.id}</td>
                  <td className="p-3">{row.nombre || '—'}</td>
                  <td className="p-3">{row.categoria ?? '—'}</td>
                  <td className="p-3">{row.capacidad_ninos ?? '—'}</td>
                  <td className="p-3">{row.monitor_a_cargo ?? '—'}</td>
                  <td className="p-3">
                    <button type="button" onClick={() => openEdit(row)} className="text-[#8EB8BA] hover:underline mr-2">Editar</button>
                    <button type="button" onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#2E4053] mb-4">{editing ? 'Editar actividad' : 'Añadir actividad'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <input type="text" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacidad niños</label>
                <input type="number" min={0} value={form.capacidad_ninos} onChange={(e) => setForm((f) => ({ ...f, capacidad_ninos: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monitor a cargo</label>
                <input type="text" value={form.monitor_a_cargo} onChange={(e) => setForm((f) => ({ ...f, monitor_a_cargo: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving} className="px-4 py-2 bg-[#8EB8BA] text-white rounded-lg hover:bg-[#7aa8aa] disabled:opacity-60">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
