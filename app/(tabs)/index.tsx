import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Platform,
  StatusBar,
  ImageBackground,
  View,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link, useFocusEffect, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { Tracker } from '@/types/types';

const TRACKERS_STORAGE_KEY = 'trackersList';
const QUOTES_STORAGE_KEY = 'quotesList';

const backgroundImage = require('../../assets/images/nature_green_background.png');

interface Quote {
  id: string;
  text: string;
  author?: string;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [_, setForceUpdate] = useState(0);

  const loadTrackers = async () => {
    try {
      const storedTrackers = await AsyncStorage.getItem(TRACKERS_STORAGE_KEY);
      if (storedTrackers) {
        setTrackers(JSON.parse(storedTrackers).sort((a: Tracker, b: Tracker) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
      } else {
        setTrackers([]);
      }
    } catch (error) {
      console.error('Failed to load trackers', error);
      Alert.alert('Error', 'Failed to load trackers.');
    }
  };

  const loadQuote = async () => {
    try {
      const storedQuotes = await AsyncStorage.getItem(QUOTES_STORAGE_KEY);
      if (storedQuotes) {
        const quotesList: Quote[] = JSON.parse(storedQuotes);
        if (quotesList.length > 0) {
          setQuote(quotesList[Math.floor(Math.random() * quotesList.length)]);
        }
      }
    } catch (error) {
      console.error('Failed to load quote', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTrackers();
    }, [])
  );

  useEffect(() => {
    loadQuote();
    const intervalId = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleResetTracker = async (trackerId: string) => {
    Alert.alert(
      "Reset Tracker",
      "Are you sure you want to reset the start date of this tracker to now? This will restart its timer.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "default",
          onPress: async () => {
            try {
              const updatedTrackers = trackers.map(t => {
                if (t.id === trackerId) {
                  return { ...t, startDate: new Date().toISOString() };
                }
                return t;
              });
              setTrackers(updatedTrackers.sort((a: Tracker, b: Tracker) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
              await AsyncStorage.setItem(TRACKERS_STORAGE_KEY, JSON.stringify(updatedTrackers));
            } catch (error) {
              console.error('Failed to reset tracker', error);
              Alert.alert('Error', 'Failed to reset tracker.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteTracker = async (trackerId: string) => {
    Alert.alert(
      "Delete Tracker",
      "Are you sure you want to delete this tracker? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "default",
          onPress: async () => {
            try {
              const updatedTrackers = trackers.filter(t => t.id !== trackerId);
              setTrackers(updatedTrackers);
              await AsyncStorage.setItem(TRACKERS_STORAGE_KEY, JSON.stringify(updatedTrackers));
            } catch (error) {
              console.error('Failed to delete tracker', error);
              Alert.alert('Error', 'Failed to delete tracker.');
            }
          },
        },
      ]
    );
  };

  const styles = getStyles(colorScheme);

  const renderTrackerItem = ({ item }: { item: Tracker }) => {
    const timeSince = (): React.ReactNode[] => {
        const now = new Date();
        const startDate = new Date(item.startDate);
        const diffMs = now.getTime() - startDate.getTime();

        if (diffMs < 1000) {
            return [
                <View key="just-started-badge" style={styles.timeBadge}>
                    <ThemedText style={styles.timeBadgeText}>Just started</ThemedText>
                </View>
            ];
        }

        let totalSeconds = Math.floor(diffMs / 1000);
        const badges: React.ReactNode[] = [];

        const SECONDS_PER_MINUTE = 60;
        const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
        const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;
        const APPROX_SECONDS_PER_MONTH = SECONDS_PER_DAY * 30;
        const APPROX_SECONDS_PER_YEAR = SECONDS_PER_DAY * 365;

        const years = Math.floor(totalSeconds / APPROX_SECONDS_PER_YEAR);
        if (years > 0) {
            badges.push(
                <View key="y" style={styles.timeBadge}>
                    <ThemedText style={styles.timeBadgeText}>{`${years} year${years !== 1 ? 's' : ''}`}</ThemedText>
                </View>
            );
            totalSeconds %= APPROX_SECONDS_PER_YEAR;
        }

        const months = Math.floor(totalSeconds / APPROX_SECONDS_PER_MONTH);
        if (months > 0) {
            badges.push(
                <View key="mo" style={styles.timeBadge}>
                    <ThemedText style={styles.timeBadgeText}>{`${months} month${months !== 1 ? 's' : ''}`}</ThemedText>
                </View>
            );
            totalSeconds %= APPROX_SECONDS_PER_MONTH;
        }

        const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
        if (days > 0) {
            badges.push(
                <View key="d" style={styles.timeBadge}>
                    <ThemedText style={styles.timeBadgeText}>{`${days} day${days !== 1 ? 's' : ''}`}</ThemedText>
                </View>
            );
            totalSeconds %= SECONDS_PER_DAY;
        }

        const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
        if (hours > 0) {
            badges.push(
                <View key="h" style={styles.timeBadge}>
                    <ThemedText style={styles.timeBadgeText}>{`${hours} hour${hours !== 1 ? 's' : ''}`}</ThemedText>
                </View>
            );
            totalSeconds %= SECONDS_PER_HOUR;
        }

        const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
        if (minutes > 0) {
            badges.push(
                <View key="m" style={styles.timeBadge}>
                    <ThemedText style={styles.timeBadgeText}>{`${minutes} minute${minutes !== 1 ? 's' : ''}`}</ThemedText>
                </View>
            );
            totalSeconds %= SECONDS_PER_MINUTE;
        }

        const seconds = totalSeconds;
        if (seconds > 0 || badges.length === 0) {
            badges.push(
                <View key="s" style={styles.timeBadge}>
                    <ThemedText style={styles.timeBadgeText}>{`${seconds} second${seconds !== 1 ? 's' : ''}`}</ThemedText>
                </View>
            );
        }

        return badges;
    };

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
      <View style={styles.trackerItem}>
        {/* This TouchableOpacity now wraps all the main display content */}
        <TouchableOpacity
          style={styles.trackerDetails}
          onPress={() => router.push({ pathname: "/edit-tracker", params: { trackerId: item.id } })}
        >
          <ThemedText style={styles.trackerName}>{item.name}</ThemedText>
          <ThemedText style={styles.trackerType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</ThemedText>

          <View style={styles.timeBadgesContainer}>
            {timeSince()}
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

        {/* Action buttons remain separate */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity onPress={() => handleResetTracker(item.id)} style={styles.actionButton}>
            <FontAwesome5 name="sync-alt" size={18} color={Colors[colorScheme].text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteTracker(item.id)} style={styles.actionButton}>
            <FontAwesome5 name="trash-alt" size={18} color={Colors[colorScheme].text} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>Lahmacun Tracker</ThemedText>
        </ThemedView>

        {quote && (
          <ThemedView style={styles.quoteContainer}>
            <ThemedText style={styles.quoteText}>"{quote.text}"</ThemedText>
            {quote.author && <ThemedText style={styles.quoteAuthor}>- {quote.author}</ThemedText>}
          </ThemedView>
        )}

        {trackers.length === 0 && !quote ? (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No trackers yet. Start your journey!</ThemedText>
          </ThemedView>
        ) : trackers.length === 0 && quote ? (
            <ThemedView style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>No trackers yet. Add one below!</ThemedText>
            </ThemedView>
        ) : (
          <FlatList
            data={trackers}
            renderItem={renderTrackerItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
            extraData={_}
          />
        )}

        <ThemedView style={styles.addButtonContainer}>
          <Link href="/add-tracker" asChild>
            <TouchableOpacity style={styles.addButton}>
              <FontAwesome5 name="plus" size={18} color={Colors[colorScheme].primaryButtonText} style={{ marginRight: 8 }} />
              <ThemedText style={styles.addButtonText}>Add New Tracker</ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>
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
      backgroundColor: 'transparent',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 70,
    },
    titleContainer: {
      paddingHorizontal: 20,
      marginBottom: 15,
      backgroundColor: 'transparent',
    },
    title: {
      textAlign: 'center',
      color: currentColors.text,
    },
    quoteContainer: {
      paddingHorizontal: 25,
      paddingVertical: 15,
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: currentColors.cardBackground + 'cc',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    quoteText: {
      fontSize: 15,
      fontStyle: 'italic',
      textAlign: 'center',
      color: currentColors.text,
      marginBottom: 5,
    },
    quoteAuthor: {
      fontSize: 14,
      textAlign: 'right',
      color: currentColors.text,
    },
    listContentContainer: {
      paddingHorizontal: 15,
      paddingBottom: Platform.OS === 'ios' ? 100 : 90,
    },
    trackerItem: {
      backgroundColor: currentColors.cardBackground,
      borderRadius: 12,
      padding: 18,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    trackerDetails: { // This style is now applied to the TouchableOpacity
      flex: 1,
      backgroundColor: 'transparent', // Ensure it doesn't obscure underlying card bg
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
      backgroundColor: currentColors.tint,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginRight: 5,
      marginBottom: 5,
    },
    timeBadgeText: {
      color: currentColors.primaryButtonText,
      fontSize: 14,
      fontWeight: '600',
    },
    trackerStartDate: {
        fontSize: 13,
        color: currentColors.gray,
        marginBottom: 4,
    },
    progressContainer: {
        marginTop: 4,
        marginBottom: 5,
    },
    progressLabel: {
        fontSize: 12,
        color: currentColors.gray,
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
    actionButtonsContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    actionButton: {
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
    },
    emptyText: {
      fontSize: 17,
      textAlign: 'center',
      color: currentColors.text,
      lineHeight: 24,
    },
    addButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: Platform.OS === 'ios' ? 20 : 15,
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
      borderTopWidth: Platform.OS === 'android' ? 1 : 0,
      borderTopColor: Platform.OS === 'android' ? currentColors.separator + '40' : 'transparent',
    },
    addButton: {
      backgroundColor: currentColors.tint,
      paddingVertical: 14,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    addButtonText: {
      color: currentColors.primaryButtonText,
      fontSize: 17,
      fontWeight: '600',
    },
  });
};

