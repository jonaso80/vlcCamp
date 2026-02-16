export type PaletteId = 'verde' | 'azul' | 'tierra' | 'coral' | 'noche';

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
  { id: 'azul', name: 'Azul marino', primary: '#1e3a5f', secondary: '#3b82f6', background: '#f0f9ff', text: '#0f172a' },
  { id: 'tierra', name: 'Tierra', primary: '#78350f', secondary: '#d97706', background: '#fef3c7', text: '#451a03' },
  { id: 'coral', name: 'Coral', primary: '#9f1239', secondary: '#fb7185', background: '#ffe4e6', text: '#4c0519' },
  { id: 'noche', name: 'Noche', primary: '#0f172a', secondary: '#64748b', background: '#f1f5f9', text: '#0f172a' },
];

export function getPalette(id: PaletteId): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
