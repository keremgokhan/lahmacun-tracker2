import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function SolidTabBarBackground() {
  const colorScheme = useColorScheme() ?? 'light';
  const cardBackgroundColor = Colors[colorScheme].cardBackground;

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: cardBackgroundColor },
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
