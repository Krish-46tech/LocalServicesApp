import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/theme';
import { AppText } from './AppText';
import { ScalePressable } from './ScalePressable';

export function PrimaryButton({ label, onPress, icon, style, disabled = false }) {
  return (
    <ScalePressable onPress={onPress} style={[style, disabled && styles.disabled]} disabled={disabled}>
      <LinearGradient
        colors={[THEME.colors.primary, THEME.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <View style={styles.content}>
          {icon}
          <AppText weight="bold" style={styles.label}>
            {label}
          </AppText>
        </View>
      </LinearGradient>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: THEME.radius.md,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: THEME.spacing.xs
  },
  label: {
    color: '#fff',
    fontSize: 16
  },
  disabled: {
    opacity: 0.7
  }
});
