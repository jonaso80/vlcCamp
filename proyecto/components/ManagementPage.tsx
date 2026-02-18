import React from 'react';
import { MyCamp, User } from '../types';

interface ManagementPageProps {
  isAuthenticated: boolean;
  currentUser: User | null;
  userCamp: MyCamp | null;
  onPlantillaPublicidadClick: () => void;
  onDatosExtraClick: () => void;
  onTablasClick: () => void;
  onSwitchCamp?: () => void;
}

const ManagementPage: React.FC<ManagementPageProps> = ({ isAuthenticated, currentUser, userCamp, onPlantillaPublicidadClick, onDatosExtraClick, onTablasClick, onSwitchCamp }) => {
  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E4053] mb-4">
          Gestión de campamentos
        </h1>
        <p className="text-slate-600 mb-6">
          Inicia sesión en tu cuenta de vlcCamp para acceder al área de gestión de tu campamento.
        </p>
      </div>
    );
  }

  if (!userCamp) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E4053] mb-4">
          Gestión de campamentos
        </h1>
        <p className="text-slate-600 mb-4">
          Hola {currentUser?.name ?? ''}, todavía no tenemos asociado ningún campamento a tu usuario.
        </p>
        <p className="text-slate-500">
          Próximamente, desde aquí podrás iniciar el proceso de registro de tu campamento y gestionar todos sus
          detalles.
        </p>
      </div>
    );
  }

  const managementOptions = [
    { id: 'plantilla-publicidad', label: 'Plantilla de publicidad', icon: '📢', onClick: onPlantillaPublicidadClick },
    { id: 'datos-extra', label: 'Datos extra', icon: '📋', onClick: onDatosExtraClick },
    { id: 'tablas', label: 'Tablas', icon: '📊', onClick: onTablasClick },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2E4053] mb-2">
        Panel de gestión
      </h1>
      <p className="text-slate-600 mb-10">
        Aquí podrás gestionar la información y operaciones de tu campamento en vlcCamp.
      </p>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#b6e0de]/40 p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#2E4053] mb-1">
              {userCamp.name}
            </h2>
            <p className="text-slate-600">
              Este es el campamento que estás gestionando.
            </p>
          </div>
          {onSwitchCamp && (
            <button
              onClick={onSwitchCamp}
              className="px-4 py-2 bg-white border border-[#8EB8BA] text-[#8EB8BA] rounded-xl text-sm font-semibold hover:bg-[#def1f0] transition-colors flex items-center gap-2 self-start md:self-center"
            >
              ↻ Cambiar campamento
            </button>
          )}
        </div>
        {userCamp.status && (
          <p className="text-sm text-slate-500">
            Estado actual: <span className="font-semibold">{userCamp.status}</span>
          </p>
        )}
      </div>

      <h2 className="text-xl font-semibold text-[#2E4053] mb-4">Opciones de gestión</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {managementOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={option.onClick}
            className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-[#b6e0de]/40 text-left hover:bg-[#def1f0]/60 hover:border-[#8EB8BA]/50 transition-colors"
          >
            <span className="text-2xl" aria-hidden>{option.icon}</span>
            <span className="font-medium text-slate-800">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManagementPage;

