// /Users/keremgokhan/dev/repos/lahmacun-tracker2/app/(tabs)/milestones.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Platform, StatusBar } from 'react-native';

export default function MilestonesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Milestones</ThemedText>
      <View style={styles.content}>
        <ThemedText style={styles.placeholderText}>
          Track your achievements and significant moments here!
        </ThemedText>
        <ThemedText style={styles.placeholderTextSmall}>
          (Coming Soon)
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const getStyles = (colorScheme: 'light' | 'dark') => {
  const currentColors = Colors[colorScheme];
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 70,
      paddingHorizontal: 20,
    },
    title: {
      textAlign: 'center',
      marginBottom: 20,
      color: currentColors.text, 
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 10,
      color: currentColors.text, 
    },
    placeholderTextSmall: {
        fontSize: 14,
        textAlign: 'center',
        color: currentColors.gray,
    },
  });
};