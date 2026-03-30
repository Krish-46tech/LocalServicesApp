import React from 'react';
import { Text } from 'react-native';
import { THEME } from '../constants/theme';

export function AppText({ style, weight = 'regular', children, ...rest }) {
  const fontFamily =
    weight === 'bold'
      ? THEME.font.bold
      : weight === 'medium'
      ? THEME.font.medium
      : THEME.font.regular;

  return (
    <Text {...rest} style={[{ fontFamily, color: THEME.colors.text }, style]}>
      {children}
    </Text>
  );
}
