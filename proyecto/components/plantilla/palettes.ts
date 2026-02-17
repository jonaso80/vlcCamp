export type PaletteId = 'verde' | 'aventura' | 'zen' | 'tecno' | 'eco' | 'oceano' | 'solar' | 'creatividad' | 'deporte' | 'explorador' | 'noche';

export interface Palette {
  id: PaletteId;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const PALETTES: Palette[] = [
  { id: 'verde', name: 'Verde vlcCamp', primary: '#2E4053', secondary: '#8EB8BA', background: '#E0F2F1', text: '#1e293b' },
  { id: 'aventura', name: 'Aventura Total', primary: '#E67E22', secondary: '#27AE60', background: '#FDF2E9', text: '#5D4037' },
  { id: 'zen', name: 'Calma Zen', primary: '#607D8B', secondary: '#B0BEC5', background: '#ECEFF1', text: '#37474F' },
  { id: 'tecno', name: 'Tecno-Futuro', primary: '#6200EA', secondary: '#00E5FF', background: '#F3E5F5', text: '#311B92' },
  { id: 'eco', name: 'Eco-Bosque', primary: '#2E7D32', secondary: '#8D6E63', background: '#E8F5E9', text: '#1B5E20' },
  { id: 'oceano', name: 'Océano Profundo', primary: '#01579B', secondary: '#4FC3F7', background: '#E1F5FE', text: '#0D47A1' },
  { id: 'solar', name: 'Energía Solar', primary: '#FBC02D', secondary: '#FF5722', background: '#FFFDE7', text: '#BF360C' },
  { id: 'creatividad', name: 'Creatividad', primary: '#D81B60', secondary: '#8E24AA', background: '#FCE4EC', text: '#880E4F' },
  { id: 'deporte', name: 'Deporte Puro', primary: '#D32F2F', secondary: '#212121', background: '#FAFAFA', text: '#B71C1C' },
  { id: 'explorador', name: 'Explorador', primary: '#5D4037', secondary: '#827717', background: '#EFEBE9', text: '#3E2723' },
  { id: 'noche', name: 'Noche Estelar', primary: '#1A237E', secondary: '#FDD835', background: '#E8EAF6', text: '#1A237E' },
];

export function getPalette(id: PaletteId): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
