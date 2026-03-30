import React from 'react';
import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import { AppText } from './AppText';
import { ScalePressable } from './ScalePressable';

export function CategoryChip({ label, active, onPress }) {
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

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.radius.pill,
    marginRight: THEME.spacing.sm,
    overflow: 'hidden'
  },
  activeChip: {
    color: '#fff',
    backgroundColor: THEME.colors.primary
  },
  inactiveChip: {
    color: THEME.colors.textMuted,
    backgroundColor: THEME.colors.surfaceMuted
  }
});
