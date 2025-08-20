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
import { TrackerCard } from '@/components/TrackerCard';

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
  const currentColors = Colors[colorScheme]; // For direct use of colors not in styles

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
            extraData={_}
          />
        )}

        <ThemedView style={styles.addButtonContainer}>
          <Link href="/add-tracker" asChild>
            <TouchableOpacity style={styles.addButton}>
              <FontAwesome5 name="plus" size={16} color={currentColors.buttonText} style={{ marginRight: 8 }} />
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
    quoteContainer: {
      paddingHorizontal: 20, // Adjusted padding
      paddingVertical: 15,   // Adjusted padding
      marginHorizontal: 20,
      marginTop: 15, // Added some top margin
      marginBottom: 20,
      backgroundColor: currentColors.cardBackground, // Beige/Ivory
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
      color: currentColors.textNeutral, // Dark neutral
      marginBottom: 5,
    },
    quoteAuthor: {
      fontSize: 14,
      textAlign: 'right',
      color: currentColors.textAccent, // Green accent
    },
    listContentContainer: {
      paddingHorizontal: 16,
      paddingTop: 15,
      paddingBottom: Platform.OS === 'ios' ? 100 : 90,
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
      color: currentColors.textNeutral, // Changed to textNeutral for readability
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
      backgroundColor: currentColors.accentMedium, // Medium green
      paddingVertical: 14,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: currentColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    addButtonText: {
      color: currentColors.buttonText, // White text
      fontSize: 16, // Changed from 17
      fontWeight: '600',
    },
  });
};

