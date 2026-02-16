import React from 'react';

const PlantillaLoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-br from-[#E0F2F1] to-[#B2DFDB]">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6">
        <div className="w-14 h-14 border-4 border-[#2E4053] border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-medium text-[#2E4053]">Cargando plantilla de publicidad...</p>
      </div>
    </div>
  );
};

export default PlantillaLoadingPage;
