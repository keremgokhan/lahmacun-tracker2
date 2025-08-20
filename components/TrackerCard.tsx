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
      backgroundColor: currentColors.cardBackground,
      borderRadius: 12,
      padding: 16, // Reverted from 18
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
      marginRight: 8, // Reverted from 10
    },
    trackerName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: currentColors.textNeutral,
      marginBottom: 5, // Reverted from 6
    },
    trackerType: {
      fontSize: 14,
      color: currentColors.textSecondary,
      marginBottom: 8, // Reverted from 10
      fontWeight: '600',
    },
    timeBadgesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 6, // Changed from 8 to 6
      marginTop: 2,
    },
    timeBadge: {
      backgroundColor: currentColors.accentSoft,
      paddingHorizontal: 8, // Reverted from 10
      paddingVertical: 4,   // Reverted from 5
      borderRadius: 6,
      marginRight: 6,
      marginBottom: 6,
    },
    timeBadgeText: {
      color: currentColors.textAccent,
      fontSize: 13,
      fontWeight: '600',
    },
    trackerStartDate: {
      fontSize: 14,
      color: currentColors.textSecondary,
      marginBottom: 4, // Reverted from 6
    },
    progressContainer: {
      marginTop: 4,  // Reverted from 6
      marginBottom: 5,
    },
    progressLabel: {
      fontSize: 12,
      color: currentColors.textSecondary,
      marginBottom: 3, // Reverted from 4
    },
    progressBarTrack: {
      height: 8,
      backgroundColor: currentColors.separator,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: currentColors.accentMedium,
      borderRadius: 4,
    },
    actionsContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between', // Reverted from space-around
      alignItems: 'center',
      backgroundColor: 'transparent',
      // Removed height: '100%' and paddingVertical: 5
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
  const currentColors = Colors[colorScheme];

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
          <FontAwesome5 name="sync-alt" size={18} color={currentColors.accentSoft} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeleteTracker(item.id)} style={styles.actionButton}>
          <FontAwesome5 name="trash-alt" size={18} color={currentColors.accentSoft} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

