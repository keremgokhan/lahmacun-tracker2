import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tracker } from '../types/types';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CustomDateTimePicker } from '@/components/CustomDateTimePicker';

const TRACKERS_STORAGE_KEY = 'trackersList';
const availableTrackerTypes: ('addiction' | 'habit')[] = ['addiction', 'habit'];

export default function AddTrackerScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? 'light';
  const [name, setName] = useState('');
  const [type, setType] = useState<'addiction' | 'habit'>(availableTrackerTypes[0]);
  const cardBackgroundColor = Colors[colorScheme].cardBackground;
  const textColor = Colors[colorScheme].text;

  // Only this state is needed for the date now
  const [currentStartDate, setCurrentStartDate] = useState(new Date());

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add New Tracker',
      headerStyle: { backgroundColor: cardBackgroundColor },
      headerTintColor: textColor,
      headerTitleStyle: { fontWeight: 'bold' },
    });
  }, [navigation, colorScheme, cardBackgroundColor, textColor]);

  const handleAddTracker = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter a name for the tracker.');
      return;
    }
    const newTracker: Tracker = {
      id: Date.now().toString(),
      name: name.trim(),
      type: type,
      startDate: currentStartDate.toISOString(),
    };
    try {
      const existingTrackers = await AsyncStorage.getItem(TRACKERS_STORAGE_KEY);
      const trackersList = existingTrackers ? JSON.parse(existingTrackers) : [];
      trackersList.push(newTracker);
      await AsyncStorage.setItem(TRACKERS_STORAGE_KEY, JSON.stringify(trackersList));
      Alert.alert('Success', 'Tracker added successfully.');
      router.back();
    } catch (error) {
      console.error('Failed to save tracker', error);
      Alert.alert('Error', 'Error saving tracker.');
    }
  };

  const styles = getStyles(colorScheme, cardBackgroundColor);

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
        <ThemedView style={styles.segmentedControlContainer}>
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
        </ThemedView>

        {/* Use the CustomDateTimePicker component */}
        <CustomDateTimePicker
          currentDate={currentStartDate}
          onDateChange={setCurrentStartDate}
          label="Start Date & Time:"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddTracker}>
          <ThemedText style={styles.buttonText}>Add Tracker</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const getStyles = (colorScheme: 'light' | 'dark', cardBgColor: string) => {
  const currentColors = Colors[colorScheme];
  // Styles remain largely the same, but dateDisplay, iosPickerDismissButton styles can be removed
  // if they are only used by the picker logic now encapsulated in CustomDateTimePicker.
  // The CustomDateTimePicker's internal styles will handle its appearance.
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cardBgColor
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 50,
    },
    label: { // Kept for general labels
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
    // The styles for dateDisplay, dateDisplayText, iosPickerDismissButton,
    // and iosPickerDismissButtonText are no longer needed here as they
    // are now part of the CustomDateTimePicker component.
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
