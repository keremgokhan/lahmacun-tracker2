import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const cardBackgroundColor = Colors[colorScheme].cardBackground;
  const textColor = Colors[colorScheme].text;
  const activeTintColor = Colors[colorScheme].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        headerShown: true,
        headerStyle: {
          backgroundColor: cardBackgroundColor,
        },
        headerTintColor: textColor,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground, // For iOS, this uses TabBarBackground.ios.tsx
        tabBarStyle: {
          backgroundColor: cardBackgroundColor, // For Android and Web
          borderTopWidth: 0, // Potentially remove border if not desired
          elevation: 0, // Potentially remove shadow on Android if not desired
          ...(Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          })),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lahmacun Tracker',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="milestones"
        options={{
          title: 'Milestones',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="flag.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Daily Wisdom',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="quote.bubble.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
