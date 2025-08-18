import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  StatusBar,
  ImageBackground, // Added
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tracker } from '@/types/types';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MilestoneCard } from '@/components/MilestoneCard'; // Import the card

const TRACKERS_STORAGE_KEY = 'trackersList';

// Added background image
const backgroundImage = require('../../assets/images/nature_green_background.png');

interface DisplayMilestone {
  id: string;
  trackerId: string;
  trackerName: string;
  trackerType: 'addiction' | 'habit';
  milestoneLabel: string;
  celebratoryMessage: string;
  achievedDate: Date;
  displayDate: Date;
  isJustForToday: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const STANDARD_MILESTONES = [
  { rawLabel: "24 Hours", durationMs: DAY_MS, celebratoryMessage: "24 Hours Strong!" },
  { rawLabel: "1 Week", durationMs: 7 * DAY_MS, celebratoryMessage: "1 Week of Progress!" },
  { rawLabel: "30 Days", durationMs: 30 * DAY_MS, celebratoryMessage: "30 Days - Incredible!" },
  { rawLabel: "60 Days", durationMs: 60 * DAY_MS, celebratoryMessage: "60 Days - Keep Going!" },
  { rawLabel: "90 Days", durationMs: 90 * DAY_MS, celebratoryMessage: "90 Days - Amazing Dedication!" },
  { rawLabel: "6 Months", durationMs: 182 * DAY_MS, celebratoryMessage: "6 Months - Half a Year!" },
  { rawLabel: "1 Year", durationMs: 365 * DAY_MS, celebratoryMessage: "1 Year - Phenomenal Achievement!" },
];

export default function MilestonesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMilestones, setDisplayMilestones] = useState<DisplayMilestone[]>([]);

  const calculateMilestones = async () => {
    setIsLoading(true);
    try {
      const storedTrackers = await AsyncStorage.getItem(TRACKERS_STORAGE_KEY);
      const trackers: Tracker[] = storedTrackers ? JSON.parse(storedTrackers) : [];
      const allAchievedMilestones: DisplayMilestone[] = [];
      const now = new Date();
      const nowMs = now.getTime();

      trackers.forEach(tracker => {
        const startDateMs = new Date(tracker.startDate).getTime();
        const durationActiveMs = nowMs - startDateMs;

        if (durationActiveMs < 0) return;

        if (durationActiveMs >= DAY_MS) {
          allAchievedMilestones.push({
            id: `${tracker.id}_justForToday`,
            trackerId: tracker.id,
            trackerName: tracker.name,
            trackerType: tracker.type as ('addiction' | 'habit'),
            milestoneLabel: "Just for Today",
            celebratoryMessage: `Just for Today: ${tracker.name} - You're Doing Great!`,
            achievedDate: new Date(startDateMs + DAY_MS),
            displayDate: now,
            isJustForToday: true,
          });
        }

        STANDARD_MILESTONES.forEach(milestoneDef => {
          if (durationActiveMs >= milestoneDef.durationMs) {
            allAchievedMilestones.push({
              id: `${tracker.id}_${milestoneDef.rawLabel.replace(/\s+/g, '')}`,
              trackerId: tracker.id,
              trackerName: tracker.name,
              trackerType: tracker.type as ('addiction' | 'habit'),
              milestoneLabel: milestoneDef.rawLabel,
              celebratoryMessage: `${milestoneDef.celebratoryMessage} (${tracker.name})`,
              achievedDate: new Date(startDateMs + milestoneDef.durationMs),
              displayDate: new Date(startDateMs + milestoneDef.durationMs),
              isJustForToday: false,
            });
          }
        });

        const yearsActive = durationActiveMs / (365 * DAY_MS);
        for (let year = 2; year <= yearsActive; year++) {
          allAchievedMilestones.push({
            id: `${tracker.id}_${year}Years`,
            trackerId: tracker.id,
            trackerName: tracker.name,
            trackerType: tracker.type as ('addiction' | 'habit'),
            milestoneLabel: `${year} Year${year > 1 ? 's' : ''}`,
            celebratoryMessage: `${year} Year${year > 1 ? 's' : ''} Strong with ${tracker.name}! Unstoppable!`,
            achievedDate: new Date(startDateMs + (year * 365 * DAY_MS)),
            displayDate: new Date(startDateMs + (year * 365 * DAY_MS)),
            isJustForToday: false,
          });
        }
      });

      allAchievedMilestones.sort((a, b) => {
        if (a.isJustForToday && !b.isJustForToday) return -1;
        if (!a.isJustForToday && b.isJustForToday) return 1;
        return b.displayDate.getTime() - a.displayDate.getTime();
      });

      setDisplayMilestones(allAchievedMilestones);
    } catch (error) {
      console.error("Failed to calculate milestones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      calculateMilestones();
    }, [])
  );

  if (isLoading) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
          <ThemedText style={{marginTop: 10, color: Colors[colorScheme].text}}>Loading milestones...</ThemedText>
        </ThemedView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Your Milestones</ThemedText>
        {displayMilestones.length === 0 ? (
          <ThemedView style={styles.emptyTextContainer}>
            <ThemedText style={styles.emptyText}>No milestones achieved yet. Keep up your great work with your trackers, and you'll see them here!
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={displayMilestones}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MilestoneCard milestone={item} />}
            contentContainerStyle={styles.listContentContainer}
            ListHeaderComponent={<View style={{height:10}}/>} // Small space at the top of list
            ListFooterComponent={<View style={{height:30}}/>} // Space at bottom
          />
        )}
      </ThemedView>
    </ImageBackground>
  );
}

const getStyles = (colorScheme: 'light' | 'dark') => {
  const currentColors = Colors[colorScheme];
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
      backgroundColor: 'transparent', // Make container transparent
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: 'transparent', // Make transparent
    },
    title: {
     // fontSize: 26, // Handled by ThemedText type="title"
     // fontWeight: 'bold', // Handled by ThemedText type="title"
      textAlign: 'center',
      marginBottom: 20,
      color: currentColors.text, // Ensure title text is visible on background
      backgroundColor: 'transparent', // Ensure no blocky background for title
    },
    listContentContainer: {
      paddingHorizontal: 15,
      // paddingBottom: 20, // ListFooterComponent used instead for bottom spacing
    },
    emptyTextContainer: {
        flex:1, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:'transparent'
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      color: currentColors.text, // Ensure empty text is visible
      marginTop: 10,
      paddingHorizontal: 20,
    },
  });
};
