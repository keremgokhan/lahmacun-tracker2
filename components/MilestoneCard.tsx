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
  const currentColors = Colors[colorScheme]; // Get current colors for direct use if needed

  const iconName = milestone.trackerType === 'addiction' ? 'shield-alt' : 'spa';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <FontAwesome5 name={iconName} size={22} color={currentColors.tint} style={styles.icon} />
        <ThemedText style={styles.trackerName}>{milestone.trackerName}</ThemedText>
      </View>
      <ThemedText style={styles.celebratoryMessage}>{milestone.celebratoryMessage}</ThemedText>
      <ThemedText style={styles.milestoneDetail}>
        Achieved: {milestone.achievedDate.toLocaleDateString()}
      </ThemedText>
      {milestone.isJustForToday ? (
        <View style={styles.justForTodayBanner}>
          <FontAwesome5 name="star" size={14} color={currentColors.primaryButtonText} style={{marginRight: 6}}/>
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
      backgroundColor: currentColors.cardBackground, // Will use new lighter color
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: currentColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.25,
      shadowRadius: Platform.OS === 'ios' ? 4 : 5,
      elevation: Platform.OS === 'ios' ? 4 : 5,
      borderColor: currentColors.tint + '50',
      borderWidth: 1,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    icon: {
      marginRight: 10,
    },
    trackerName: {
      fontSize: 14,
      fontWeight: '600',
      color: currentColors.text, // Uses your main text color
    },
    celebratoryMessage: {
      fontSize: 16, // Smaller for a more compact feel
      fontWeight: 'bold',
      color: currentColors.text, // Your darker, serene text green
      marginBottom: 6,
      lineHeight: 22, // Adjusted line height for smaller font
    },
    milestoneDetail: {
      fontSize: 13, // Changed from 14 to 13 for consistency
      color: currentColors.text, // Uses your main text color
      marginBottom: 3,
    },
    justForTodayBanner: {
      marginTop: 10,
      backgroundColor: currentColors.tint, // Your serene green
      paddingVertical: 3,   // More compact
      paddingHorizontal: 6, // More compact
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
    justForTodayText: {
      fontSize: 12, // More compact
      fontWeight: 'bold',
      color: currentColors.primaryButtonText, // Your original text color for banner
    },
  });
};

