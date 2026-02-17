import React, { useState } from 'react';
import { useCampBuilder } from '../CampBuilderContext';
import { ScheduleItem } from '../types';

const ICONS = ['🍳', '⚽', '🎨', '🏊', '🚍', '🌙', '🎸', '🧠'];

const ScheduleStep: React.FC = () => {
    const { data, updateData } = useCampBuilder();
    const [newItem, setNewItem] = useState<Partial<ScheduleItem>>({ time: '', activity: '', icon: '⚽' });

    const addItem = () => {
        if (!newItem.time || !newItem.activity) return;
        const item: ScheduleItem = {
            id: Date.now().toString(),
            time: newItem.time || '00:00',
            activity: newItem.activity || '',
            icon: newItem.icon || '⚽'
        };
        const sortedSchedule = [...data.schedule, item].sort((a, b) => a.time.localeCompare(b.time));
        updateData('schedule', sortedSchedule);
        setNewItem({ time: '', activity: '', icon: '⚽' });
    };

    const removeItem = (id: string) => {
        updateData('schedule', data.schedule.filter(i => i.id !== id));
    };

    return (
        <div className="space-y-8 animate-fade-in p-1">
            <div className="bg-gradient-to-r from-violet-600 to-purple-500 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-xl font-bold mb-2">Agenda Típica</h2>
                <p className="text-violet-100 text-sm">
                    Ayuda a los padres a visualizar un día en el campamento. ¡La rutina da seguridad!
                </p>
            </div>

            <div className="flex gap-4 items-end bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Hora</label>
                    <input
                        type="time"
                        value={newItem.time}
                        onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                </div>
                <div className="flex-[2]">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Actividad</label>
                    <input
                        type="text"
                        placeholder="Ej: Desayuno energético"
                        value={newItem.activity}
                        onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Icono</label>
                    <div className="flex gap-1">
                        {ICONS.slice(0, 3).map(icon => (
                            <button
                                key={icon}
                                onClick={() => setNewItem({ ...newItem, icon })}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg hover:bg-slate-50 border ${newItem.icon === icon ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={addItem}
                    disabled={!newItem.time || !newItem.activity}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
                >
                    Añadir
                </button>
            </div>

            <div className="relative pl-8 border-l-2 border-slate-200 space-y-8">
                {data.schedule.length === 0 && (
                    <p className="text-slate-400 italic text-sm">No hay actividades añadidas aún.</p>
                )}
                {data.schedule.map((item) => (
                    <div key={item.id} className="relative bg-white p-4 rounded-xl border border-slate-100 shadow-sm group">
                        <span className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-violet-100 border-2 border-white ring-2 ring-violet-500"></span>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <p className="font-bold text-slate-800">{item.time}</p>
                                    <p className="text-slate-600">{item.activity}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors px-2"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleStep;
