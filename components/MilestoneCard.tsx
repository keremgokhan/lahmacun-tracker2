import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';

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

interface MilestoneCardProps {
  milestone: DisplayMilestone;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const currentColors = Colors[colorScheme]; // For direct color access

  // Ensure milestone and its properties are available before rendering
  if (!milestone || !milestone.achievedDate) {
    return null;
  }

  const iconName = milestone.trackerType === 'addiction' ? 'shield-alt' : 'spa';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <FontAwesome5 name={iconName} size={22} color={currentColors.accentBold} style={styles.icon} />
        <ThemedText style={styles.trackerName}>{milestone.trackerName}</ThemedText>
      </View>
      <ThemedText style={styles.celebratoryMessage}>{milestone.celebratoryMessage}</ThemedText>
      <ThemedText style={styles.milestoneDetail}>
        Achieved: {new Date(milestone.achievedDate).toLocaleDateString()}
      </ThemedText>
      {milestone.isJustForToday ? (
        <View style={styles.justForTodayBanner}>
          <FontAwesome5 name="star" size={14} color={currentColors.buttonText} style={{marginRight: 6}}/>
          <ThemedText style={styles.justForTodayText}>JUST FOR TODAY!</ThemedText>
        </View>
      ) : null}
    </View>
  );
};

const getStyles = (colorScheme: 'light' | 'dark') => {
  const currentColors = Colors[colorScheme];
  return StyleSheet.create({
    card: {
      backgroundColor: currentColors.cardBackground, // Beige/Ivory
      borderRadius: 12,
      padding: 18, // Increased padding for "breathing room"
      marginBottom: 16,
      shadowColor: currentColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.15, // Slightly softer shadow
      shadowRadius: Platform.OS === 'ios' ? 3 : 4,   // Slightly softer shadow
      elevation: Platform.OS === 'ios' ? 3 : 4,       // Slightly softer shadow
      borderColor: currentColors.accentSoft ? currentColors.accentSoft + '50' : currentColors.separator,
      borderWidth: 1,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10, // Increased margin
    },
    icon: {
      marginRight: 10,
    },
    trackerName: { // Sub-heading for tracker name
      fontSize: 14,
      fontWeight: '600',
      color: currentColors.textNeutral, // Dark neutral
    },
    celebratoryMessage: { // Main milestone text
      fontSize: 17, // Slightly larger, more emphasis
      fontWeight: 'bold',
      color: currentColors.accentBold, // Bolder green
      marginBottom: 8, // Increased margin
      lineHeight: 24,
    },
    milestoneDetail: { // Achieved date
      fontSize: 14,
      color: currentColors.textSecondary, // Gray
      marginBottom: 3,
    },
    justForTodayBanner: {
      marginTop: 12, // Increased margin
      backgroundColor: currentColors.accentMedium, // Medium green (like buttons)
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6, // Rounded like time badges
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
    justForTodayText: {
      fontSize: 13,
      fontWeight: 'bold',
      color: currentColors.buttonText, // White text on medium green
    },
  });
};

