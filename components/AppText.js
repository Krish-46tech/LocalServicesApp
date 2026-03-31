import React from 'react';
import { Text } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export function AppText({ style, weight = 'regular', children, ...rest }) {
  const { theme } = useAppTheme();
  const fontFamily =
    weight === 'bold'
      ? theme.font.bold
      : weight === 'medium'
      ? theme.font.medium
      : theme.font.regular;

  return (
    <Text {...rest} style={[{ fontFamily, color: theme.colors.text }, style]}>
      {children}
    </Text>
  );
}
