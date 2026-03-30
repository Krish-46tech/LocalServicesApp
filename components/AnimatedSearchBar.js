import React, { useEffect } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { THEME } from '../constants/theme';

export function AnimatedSearchBar({ value, onChangeText, placeholder = 'Search services...' }) {
  const focusProgress = useSharedValue(0);

  useEffect(() => {
    // Keep the input in the "expanded" visual state when it has content.
    focusProgress.value = withTiming(value ? 1 : 0, { duration: 250 });
  }, [focusProgress, value]);

  const animatedContainer = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(focusProgress.value, [0, 1], [1, 1.02]) }],
      borderColor: focusProgress.value > 0.1 ? THEME.colors.primary : THEME.colors.border
    };
  });

  return (
    <Animated.View style={[styles.container, animatedContainer]}>
      <Ionicons name="search" size={20} color={THEME.colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={THEME.colors.textMuted}
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

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.md,
    ...THEME.shadow
  },
  input: {
    flex: 1,
    fontFamily: THEME.font.medium,
    color: THEME.colors.text,
    fontSize: 15,
    paddingVertical: 8
  }
});
