import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  style,
  ...props 
}) {
  const { theme } = useTheme();

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.();
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: variant === 'primary' ? theme.primary : theme.cardSecondary,
      borderColor: theme.border,
    };

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = () => ({
    color: variant === 'primary' ? '#fff' : theme.text,
    fontSize: size === 'large' ? 18 : size === 'small' ? 14 : 16,
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        onPressIn={() => {
          Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}
        style={[
          styles.button,
          styles[size],
          getButtonStyle(),
          style,
        ]}
        {...props}
      >
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  text: {
    fontWeight: '600',
  },
});