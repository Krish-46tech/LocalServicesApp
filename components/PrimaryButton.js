import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from './AppText';
import { ScalePressable } from './ScalePressable';
import { useAppTheme } from '../context/ThemeContext';

export function PrimaryButton({ label, onPress, icon, style, disabled = false }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <ScalePressable onPress={onPress} style={[style, disabled && styles.disabled]} disabled={disabled}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
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

function createStyles(theme) {
  return StyleSheet.create({
    button: {
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.xs
    },
    label: {
      color: '#fff',
      fontSize: 16
    },
    disabled: {
      opacity: 0.7
    }
  });
}
