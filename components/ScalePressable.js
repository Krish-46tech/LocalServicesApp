import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

export function ScalePressable({ children, style, scaleTo = 0.97, ...pressableProps }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <Pressable
      {...pressableProps}
      onPressIn={(event) => {
        // Fast spring-in gives a tactile press feel without delaying taps.
        scale.value = withSpring(scaleTo, { damping: 20, stiffness: 280 });
        pressableProps.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        // Slightly softer spring-out avoids a harsh bounce.
        scale.value = withSpring(1, { damping: 18, stiffness: 220 });
        pressableProps.onPressOut?.(event);
      }}
      android_ripple={{ color: 'rgba(15,23,42,0.08)' }}
      style={style}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
