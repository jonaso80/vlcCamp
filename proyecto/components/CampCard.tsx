import React from 'react';
import { Camp } from '../types';

interface CampCardProps {
  camp: Camp;
  onClick: () => void;
}

const CampCard: React.FC<CampCardProps> = ({ camp, onClick }) => {
  return (
    <div 
      className="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-3 hover:scale-[1.02] transition-all duration-300 cursor-pointer group border border-white/50"
      onClick={onClick}
    >
      <div className="p-5">
        <h3 className="text-2xl font-brand text-center text-slate-700 mb-4 group-hover:text-[#2E4053] transition-colors">{camp.name}</h3>
        <div className="relative overflow-hidden rounded-xl shadow-inner">
           <img 
             src={`${camp.mainImage.replace('/800/250', '/400/300')}`} 
             alt={camp.name} 
             className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{camp.location}</span>
        </div>
      </div>
    </div>
  );
};

export default CampCard;
