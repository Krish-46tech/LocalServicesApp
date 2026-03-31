import { RADIUS, SPACING } from './spacing';

export const LIGHT_COLORS = {
  background: '#F4F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF3FA',
  primary: '#0B63F6',
  primaryDark: '#0649B8',
  accent: '#11B981',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#DDE6F2',
  shadow: '#1E293B',
  warning: '#F59E0B',
  danger: '#EF4444',
  success: '#16A34A'
};

export const DARK_COLORS = {
  background: '#0B1220',
  surface: '#121B2B',
  surfaceMuted: '#1A2538',
  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
  accent: '#22C55E',
  text: '#E5EDF8',
  textMuted: '#9FB0C6',
  border: '#22324B',
  shadow: '#020617',
  warning: '#F59E0B',
  danger: '#F87171',
  success: '#4ADE80'
};

const FONT = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  bold: 'Manrope_700Bold'
};

export function buildTheme(mode = 'light') {
  const colors = mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  return {
    mode,
    colors,
    spacing: SPACING,
    radius: RADIUS,
    shadow: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: mode === 'dark' ? 0.28 : 0.08,
      shadowRadius: 18,
      elevation: mode === 'dark' ? 2 : 4
    },
    font: FONT
  };
}

export const THEME = buildTheme('light');
