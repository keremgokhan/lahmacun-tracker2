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
import { TrackerCard } from '@/components/TrackerCard'; // Updated to use TrackerCard

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
  const [_, setForceUpdate] = useState(0); // Kept for FlatList re-render on time change

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
      setForceUpdate(prev => prev + 1); // This ensures the timeSince updates are rendered
    }, 1000); // Update every second
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

  const renderTrackerItem = ({ item }: { item: Tracker }) => (
    <TrackerCard
      item={item}
      colorScheme={colorScheme}
      onResetTracker={handleResetTracker}
      onDeleteTracker={handleDeleteTracker}
    />
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <ThemedView style={styles.container}>
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
            extraData={_} // Ensures re-render when forceUpdate changes
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
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      backgroundColor: 'transparent'
    },
    // titleContainer and title styles were removed as they are no longer used here
    quoteContainer: {
      paddingHorizontal: 25,
      paddingVertical: 15,
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: currentColors.cardBackground + 'cc', // 'cc' for some transparency
      borderRadius: 10,
      shadowColor: currentColors.black,
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
      paddingHorizontal: 16, // MODIFIED from 15
      paddingTop: 15, // paddingTop can remain if it looks good
      paddingBottom: Platform.OS === 'ios' ? 100 : 90, // Kept as is, specific to this screen's FAB
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
      backgroundColor: 'transparent', // Or a very subtle color if needed over complex backgrounds
      borderTopWidth: Platform.OS === 'android' ? 1 : 0, // Conditional border
      borderTopColor: Platform.OS === 'android' ? currentColors.separator + '40' : 'transparent', // translucent separator
    },
    addButton: {
      backgroundColor: currentColors.tint,
      paddingVertical: 14,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: currentColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2, // Kept as is for FAB prominence
      shadowRadius: 3,   // Kept as is
      elevation: 3,      // Kept as is
    },
    addButtonText: {
      color: currentColors.primaryButtonText,
      fontSize: 17,    // Kept as is (subjective choice)
      fontWeight: '600', // Kept as is
    },
  });
};
