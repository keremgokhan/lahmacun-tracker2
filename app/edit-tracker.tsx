// /Users/keremgokhan/dev/repos/lahmacun-tracker2/app/edit-tracker.tsx
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tracker } from '../types/types';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
// Import the new CustomDateTimePicker
import { CustomDateTimePicker } from '@/components/CustomDateTimePicker';

const TRACKERS_STORAGE_KEY = 'trackersList';
const availableTrackerTypes: ('addiction' | 'habit')[] = ['addiction', 'habit'];

export default function EditTrackerScreen() {
  const navigation = useNavigation();
  const { trackerId } = useLocalSearchParams<{ trackerId: string }>();
  const colorScheme = useColorScheme() ?? 'light';

  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'addiction' | 'habit'>(availableTrackerTypes[0]);

  // This state will be managed by the CustomDateTimePicker
  const [currentStartDate, setCurrentStartDate] = useState(new Date());

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name ? `Edit: ${name}` : (tracker ? `Edit: ${tracker.name}`: 'Edit Tracker'),
      headerStyle: { backgroundColor: Colors[colorScheme].background },
      headerTintColor: Colors[colorScheme].text,
      headerTitleStyle: { fontWeight: 'bold' },
    });
  }, [navigation, name, tracker, colorScheme]);

  useEffect(() => {
    const loadTracker = async () => {
      if (!trackerId) return;
      try {
        const storedTrackers = await AsyncStorage.getItem(TRACKERS_STORAGE_KEY);
        if (storedTrackers) {
          const trackersList: Tracker[] = JSON.parse(storedTrackers);
          const currentTracker = trackersList.find(t => t.id === trackerId);
          if (currentTracker) {
            setTracker(currentTracker);
            setName(currentTracker.name);
            setCurrentStartDate(new Date(currentTracker.startDate)); // Initialize currentStartDate
            if (availableTrackerTypes.includes(currentTracker.type as ('addiction' | 'habit'))) {
              setType(currentTracker.type as ('addiction' | 'habit'));
            } else {
              setType(availableTrackerTypes[0]);
            }
          } else {
            Alert.alert('Error', 'Tracker not found.');
            router.back();
          }
        }
      } catch (error) {
        console.error('Failed to load tracker for editing', error);
        Alert.alert('Error', 'Failed to load tracker details.');
      }
    };
    loadTracker();
  }, [trackerId]);

  const handleUpdateTracker = async () => {
    if (!tracker) return;
    if (!name.trim()) {
      Alert.alert('Validation', 'Tracker name cannot be empty.');
      return;
    }
    const updatedTrackerData: Tracker = {
        ...tracker,
        name: name.trim(),
        type: type,
        startDate: currentStartDate.toISOString()
    };
    try {
      const storedTrackers = await AsyncStorage.getItem(TRACKERS_STORAGE_KEY);
      let trackersList: Tracker[] = storedTrackers ? JSON.parse(storedTrackers) : [];
      trackersList = trackersList.map(t => t.id === trackerId ? updatedTrackerData : t);
      await AsyncStorage.setItem(TRACKERS_STORAGE_KEY, JSON.stringify(trackersList));
      Alert.alert('Success', 'Tracker updated successfully.');
      router.back();
    } catch (error) {
      console.error('Failed to update tracker', error);
      Alert.alert('Error', 'Failed to update tracker.');
    }
  };

  const styles = getStyles(colorScheme);

  if (!tracker) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading tracker...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.label}>Tracker Name:</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="e.g., No Sugar, Morning Meditation"
          value={name}
          onChangeText={setName}
          placeholderTextColor={Colors[colorScheme].gray}
        />

        <ThemedText style={styles.label}>Tracker Type:</ThemedText>
        <View style={styles.segmentedControlContainer}>
          {availableTrackerTypes.map((trackerType) => (
             <TouchableOpacity
             key={trackerType}
             style={[
               styles.segmentButton,
               type === trackerType && styles.segmentButtonActive,
             ]}
             onPress={() => setType(trackerType)}
           >
             <ThemedText style={[styles.segmentButtonText, type === trackerType && styles.segmentButtonTextActive]}>
               {trackerType.charAt(0).toUpperCase() + trackerType.slice(1)}
             </ThemedText>
           </TouchableOpacity>
          ))}
        </View>

        {/* Use the CustomDateTimePicker component */}
        <CustomDateTimePicker
          currentDate={currentStartDate}
          onDateChange={setCurrentStartDate}
          label="Edit Start Date & Time:"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdateTracker}>
          <ThemedText style={styles.buttonText}>Update Tracker</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const getStyles = (colorScheme: 'light' | 'dark') => {
  const currentColors = Colors[colorScheme];
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 50,
    },
    loadingText: {
      padding: 20,
      textAlign: 'center',
      fontSize: 16,
      color: currentColors.text,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: currentColors.text,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: currentColors.separator,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      fontSize: 16,
      marginBottom: 20,
      color: currentColors.text,
      backgroundColor: currentColors.cardBackground,
    },
    segmentedControlContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      marginTop: 5,
      borderRadius: 8,
      borderColor: currentColors.tint,
      borderWidth: 1,
      overflow: 'hidden',
    },
    segmentButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: currentColors.background,
    },
    segmentButtonActive: {
      backgroundColor: currentColors.tint,
    },
    segmentButtonText: {
      color: currentColors.tint,
    },
    segmentButtonTextActive: {
      color: currentColors.primaryButtonText,
    },
    // Styles like dateDisplay, iosPickerDismissButton are no longer needed here
    button: {
      backgroundColor: currentColors.tint,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: currentColors.primaryButtonText,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};
