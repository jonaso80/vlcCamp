
import React from 'react';
import { CloseIcon } from '../icons/Icons';

interface FeedbackModalProps {
    type: 'success' | 'error' | 'info';
    title?: string;
    message: string;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ type, title, message, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                );
        }
    };

    const getTitle = () => {
        if (title) return title;
        switch (type) {
            case 'success': return '¡Éxito!';
            case 'error': return 'Error';
            default: return 'Información';
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case 'success': return 'bg-green-500 hover:bg-green-600';
            case 'error': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-[#8EB8BA] hover:bg-teal-600';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm m-4 p-6 relative animate-slide-up text-center transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors">
                    <CloseIcon />
                </button>

                {getIcon()}

                <h3 className="text-xl font-bold text-slate-800 mb-2">{getTitle()}</h3>
                <p className="text-slate-600 mb-6">{message}</p>

                <button
                    onClick={onClose}
                    className={`w-full text-white py-3 rounded-xl font-semibold transition shadow-md ${getButtonClass()}`}
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;
