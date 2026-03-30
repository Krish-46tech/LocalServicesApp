import { COLORS } from './colors';
import { RADIUS, SPACING } from './spacing';

export const SHADOW = {
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 4
};

export const THEME = {
  colors: COLORS,
  spacing: SPACING,
  radius: RADIUS,
  shadow: SHADOW,
  font: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    bold: 'Manrope_700Bold'
  }
};
