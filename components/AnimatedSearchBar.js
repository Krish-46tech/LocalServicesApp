import React, { useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useAppTheme } from '../context/ThemeContext';

export function AnimatedSearchBar({ value, onChangeText, placeholder = 'Search services...' }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const focusProgress = useSharedValue(0);

  useEffect(() => {
    focusProgress.value = withTiming(value ? 1 : 0, { duration: 250 });
  }, [focusProgress, value]);

  const animatedContainer = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(focusProgress.value, [0, 1], [1, 1.02]) }],
      borderColor: focusProgress.value > 0.1 ? theme.colors.primary : theme.colors.border
    };
  });

  return (
    <Animated.View style={[styles.container, animatedContainer]}>
      <Ionicons name="search" size={20} color={theme.colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        onFocus={() => {
          focusProgress.value = withTiming(1, { duration: 220 });
        }}
        onBlur={() => {
          if (!value) {
            focusProgress.value = withTiming(0, { duration: 220 });
          }
        }}
      />
    </Animated.View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      ...theme.shadow
    },
    input: {
      flex: 1,
      fontFamily: theme.font.medium,
      color: theme.colors.text,
      fontSize: 15,
      paddingVertical: 8
    }
  });
}
