import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CampBuilderData, INITIAL_DATA } from './types';
import { supabase } from '../../../supabaseClient';

interface CampBuilderContextType {
    data: CampBuilderData;
    updateData: (section: keyof CampBuilderData, payload: Partial<CampBuilderData[keyof CampBuilderData]>) => void;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    totalSteps: number;
    campId: number;
    saveCamp: () => Promise<boolean>;
    isSaving: boolean;
    isLoading: boolean;
}

const CampBuilderContext = createContext<CampBuilderContextType | undefined>(undefined);

export const CampBuilderProvider: React.FC<{ children: ReactNode; campId: number; onPublished?: () => void }> = ({ children, campId, onPublished }) => {
    const [data, setData] = useState<CampBuilderData>(INITIAL_DATA);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const totalSteps = 5;

    useEffect(() => {
        const loadCampData = async () => {
            if (!campId) return;
            setIsLoading(true);
            try {
                const { data: camp, error } = await supabase
                    .from('camps')
                    .select('camp_details')
                    .eq('id', campId)
                    .single();

                if (error) {
                    console.error('Error loading camp details:', error);
                } else if (camp?.camp_details && Object.keys(camp.camp_details).length > 0) {
                    // Merge with initial data to ensure all fields exist even if schema updates
                    setData(prev => ({ ...prev, ...camp.camp_details }));
                }
            } catch (err) {
                console.error('Unexpected error loading camp:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCampData();
    }, [campId]);

    const updateData = (section: keyof CampBuilderData, payload: any) => {
        setData((prev) => {
            const currentSection = prev[section];

            // If the section is an array (like schedule), replace it entirely
            if (Array.isArray(currentSection)) {
                return {
                    ...prev,
                    [section]: payload
                };
            }

            // Otherwise merge it (for objects like identity, content, trust)
            return {
                ...prev,
                [section]: {
                    ...currentSection,
                    ...payload,
                },
            };
        });
    };

    const saveCamp = async (): Promise<boolean> => {
        if (!campId) return false;
        setIsSaving(true);
        try {
            // Prepare public data for home page visibility
            const publicData = {
                images: data.content.images,
                title: data.content.title,
                description: data.content.description,
            };

            // Use Backend API to bypass RLS issues
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
            const res = await fetch(`${API_BASE_URL}/api/camps/${campId}/builder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    camp_details: data,
                    description: data.content.description,
                    publicidad_data: publicData
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error('Error returned from backend:', errData);
                throw new Error(errData.error || 'Error al guardar');
            }

            if (onPublished) onPublished();
            return true;
        } catch (error) {
            console.error('Error saving camp:', error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <CampBuilderContext.Provider value={{
            data,
            updateData,
            currentStep,
            setCurrentStep,
            totalSteps,
            campId,
            saveCamp,
            isSaving,
            isLoading
        }}>
            {children}
        </CampBuilderContext.Provider>
    );
};

export const useCampBuilder = () => {
    const context = useContext(CampBuilderContext);
    if (!context) {
        throw new Error('useCampBuilder must be used within a CampBuilderProvider');
    }
    return context;
};
