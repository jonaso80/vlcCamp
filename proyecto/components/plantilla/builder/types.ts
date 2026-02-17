import { PaletteId } from '../palettes';

export interface IdentityData {
    paletteId: PaletteId;
    fontPairing: string;
    logoUrl?: string;
}

export interface ContentData {
    videoUrl?: string;
    images: string[];
    description: string;
    title: string;
}

export interface TrustData {
    monitorRatio: number;
    insuranceUrl?: string;
    certifications: string[];
    protocols: string;
    contactEmail: string;
    contactPhone: string;
}

export interface ScheduleItem {
    id: string;
    time: string;
    activity: string;
    icon: string;
}

export interface CampBuilderData {
    identity: IdentityData;
    content: ContentData;
    trust: TrustData;
    schedule: ScheduleItem[];
}

export const INITIAL_DATA: CampBuilderData = {
    identity: {
        paletteId: 'verde',
        fontPairing: 'modern',
    },
    content: {
        images: [],
        description: '',
        title: '',
    },
    trust: {
        monitorRatio: 10,
        certifications: [],
        protocols: '',
        contactEmail: '',
        contactPhone: '',
    },
    schedule: [],
};
