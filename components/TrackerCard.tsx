import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { Tracker } from '@/types/types';
import { formatTimeSince, TimePart } from '@/utils/timeUtils';
import { router } from 'expo-router';

interface TrackerCardProps {
  item: Tracker;
  colorScheme: 'light' | 'dark';
  onResetTracker: (id: string) => void;
  onDeleteTracker: (id: string) => void;
}

const getStyles = (colorScheme: 'light' | 'dark') => {
  const currentColors = Colors[colorScheme];
  return StyleSheet.create({
    card: {
      backgroundColor: currentColors.cardBackground, // Will use the new lighter color from Colors.ts
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: currentColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    trackerDetails: {
      flex: 1,
      backgroundColor: 'transparent',
      marginRight: 8,
    },
    trackerName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: currentColors.text,
      marginBottom: 5,
    },
    trackerType: {
      fontSize: 13,
      color: currentColors.tint,
      marginBottom: 8,
      fontWeight: '600',
    },
    timeBadgesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 3,
      marginTop: 2,
    },
    timeBadge: {
      backgroundColor: currentColors.tint, // Your original serene green
      paddingHorizontal: 6, // More compact
      paddingVertical: 3,   // More compact
      borderRadius: 6,
      marginRight: 5,
      marginBottom: 5,
    },
    timeBadgeText: {
      color: currentColors.primaryButtonText, // Your original text color for badges
      fontSize: 12, // More compact
      fontWeight: '600',
    },
    trackerStartDate: {
      fontSize: 13,
      color: currentColors.text, // Darker for better contrast
      marginBottom: 4,
    },
    progressContainer: {
      marginTop: 4,
      marginBottom: 5,
    },
    progressLabel: {
      fontSize: 12,
      color: currentColors.text, // Darker for better contrast
      marginBottom: 3,
    },
    progressBarTrack: {
      height: 8,
      backgroundColor: currentColors.separator,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: currentColors.tint,
      borderRadius: 4,
    },
    actionsContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    actionButton: {
      padding: 8,
    },
  });
};

export const TrackerCard: React.FC<TrackerCardProps> = ({
  item,
  colorScheme,
  onResetTracker,
  onDeleteTracker,
}) => {
  const styles = getStyles(colorScheme);
  const timeParts = formatTimeSince(item.startDate);

  const calculateDailyProgress = () => {
    const now = new Date();
    const startDate = new Date(item.startDate);
    const diffMs = now.getTime() - startDate.getTime();
    const msInADay = 24 * 60 * 60 * 1000;
    if (diffMs < 0) return 0;
    const progressInCurrentDayMs = diffMs % msInADay;
    return (progressInCurrentDayMs / msInADay) * 100;
  };

  const dailyProgress = calculateDailyProgress();

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.trackerDetails}
        onPress={() => router.push({ pathname: "/edit-tracker", params: { trackerId: item.id } })}
      >
        <ThemedText style={styles.trackerName}>{item.name}</ThemedText>
        <ThemedText style={styles.trackerType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</ThemedText>
        <View style={styles.timeBadgesContainer}>
          {timeParts.map((part: TimePart) => (
            <View key={part.key} style={styles.timeBadge}>
              <ThemedText style={styles.timeBadgeText}>{part.text}</ThemedText>
            </View>
          ))}
        </View>
        <ThemedText style={styles.trackerStartDate}>
          Started: {new Date(item.startDate).toLocaleDateString()}
        </ThemedText>
        <View style={styles.progressContainer}>
          <ThemedText style={styles.progressLabel}>Today's Progress:</ThemedText>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${dailyProgress}%` }]} />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => onResetTracker(item.id)} style={styles.actionButton}>
          <FontAwesome5 name="sync-alt" size={18} color={Colors[colorScheme].text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteTracker(item.id)} style={styles.actionButton}>
          <FontAwesome5 name="trash-alt" size={18} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

