import React from 'react';
import { CampBuilderProvider, useCampBuilder } from './CampBuilderContext';
import LivePreview from './preview/LivePreview';
import IdentityStep from './steps/IdentityStep';
import ContentStep from './steps/ContentStep';
import TrustStep from './steps/TrustStep';
import ScheduleStep from './steps/ScheduleStep';
import ReviewStep from './steps/ReviewStep';

const STEPS = [
    { id: 'identity', label: 'Identidad Visual' },
    { id: 'content', label: 'Información' },
    { id: 'trust', label: 'Confianza' },
    { id: 'schedule', label: 'Agenda' },
    { id: 'review', label: 'Revisión' },
];

const BuilderContent: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { currentStep, setCurrentStep } = useCampBuilder();

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <IdentityStep />;
            case 1: return <ContentStep />;
            case 2: return <TrustStep />;
            case 3: return <ScheduleStep />;
            case 4: return <ReviewStep />;
            default: return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 min-h-screen bg-slate-50">
            {/* Left Column: Builder Controls */}
            <div className="flex-1 flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 text-sm font-medium mb-1">← Volver</button>
                        <h1 className="text-3xl font-bold text-slate-800">Diseña tu Campamento</h1>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full border border-emerald-200">BETA PRO</span>
                    </div>
                </div>

                {/* Stepper Navigation */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
                    {STEPS.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(index)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${currentStep === index ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === index ? 'bg-white text-slate-800' : 'bg-slate-200'}`}>
                                {index + 1}
                            </span>
                            <span className="font-medium text-sm hidden md:inline">{step.label}</span>
                        </button>
                    ))}
                </div>

                {/* Step Content */}
                <div className="flex-1 animate-fade-in relative">
                    {renderStep()}
                </div>

                {/* Navigation Actions */}
                <div className="flex justify-between mt-auto bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                        className="px-6 py-2 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 shadow-lg shadow-slate-200"
                    >
                        {currentStep === STEPS.length - 1 ? 'Publicar' : 'Siguiente'}
                    </button>
                </div>
            </div>

            {/* Right Column: Live Mirror */}
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col items-center">
                <LivePreview />
            </div>
        </div>
    );
};

// Wrapper with Provider
interface CampBuilderProps {
    onBack: () => void;
    campId: number;
    onPublished?: () => void;
}

const CampBuilder: React.FC<CampBuilderProps> = ({ onBack, campId, onPublished }) => (
    <CampBuilderProvider campId={campId} onPublished={onPublished}>
        <BuilderContent onBack={onBack} />
    </CampBuilderProvider>
);

export default CampBuilder;
