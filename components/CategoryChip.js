import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { ScalePressable } from './ScalePressable';
import { useAppTheme } from '../context/ThemeContext';

export function CategoryChip({ label, active, onPress }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScalePressable onPress={onPress} scaleTo={0.95}>
      <AppText
        weight={active ? 'bold' : 'medium'}
        style={[styles.chip, active ? styles.activeChip : styles.inactiveChip]}
      >
        {label}
      </AppText>
    </ScalePressable>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    chip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.pill,
      marginRight: theme.spacing.sm,
      overflow: 'hidden'
    },
    activeChip: {
      color: '#fff',
      backgroundColor: theme.colors.primary
    },
    inactiveChip: {
      color: theme.colors.textMuted,
      backgroundColor: theme.colors.surfaceMuted
    }
  });
}
