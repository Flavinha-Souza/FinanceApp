import { Animated } from 'react-native';

export const fadeIn = (animatedValue, duration = 300) => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  });
};

export const scaleIn = (animatedValue, duration = 200) => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    useNativeDriver: true,
    tension: 100,
    friction: 8,
  });
};

export const slideUp = (animatedValue, duration = 300) => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};