import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons'; // Added FontAwesome5 import

const QUOTE_STORAGE_KEY = 'dailyQuote';
const QUOTE_DATE_STORAGE_KEY = 'dailyQuoteDate';

const QUOTES_LIST = [
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "You have power over your mind – not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius (Meditations)" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu (Tao Te Ching)" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant (summarizing Aristotle's Ethics)" },
  { text: "The mind is everything. What you think you become.", author: "The Dhammapada (Sayings of the Buddha)" },
  { text: "So verily, with the hardship, there is relief. Verily, with the hardship, there is relief.", author: "The Holy Quran (94:5-6)" },
  { text: "This, too, shall pass.", author: "Persian Adage" },
  { text: "Fortune favors the bold.", author: "Virgil (The Aeneid)" },
  { text: "Wherever smart people work, doors are unlocked.", author: "Steve Wozniak" },
  { text: "Every man can, if he so desires, become the sculptor of his own brain.", author: "Santiago Ramón y Cajal (Attributed)" },
  { text: "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.", author: "Seneca" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "He who is not contented with what he has, would not be contented with what he would like to have.", author: "Socrates" },
  { text: "Hateful to me as the gates of Hades is that man who hides one thing in his heart and speaks another.", author: "Homer (The Iliad)" },
  { text: "Insanity is repeating the same mistakes and expecting different results.", author: "Common Adage (Often attributed to Albert Einstein)" },
  { text: "God, grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference.", author: "Reinhold Niebuhr" }
];

interface Quote {
  text: string;
  author: string;
}

const backgroundImage = require('../../assets/images/nature_green_background.png');

export default function QuotesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);

  const getTodaysDateString = () => {
    return new Date().toISOString().split('T')[0]; // Gets 'YYYY-MM-DD'
  };

  const loadOrRefreshQuote = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedQuoteStr = await AsyncStorage.getItem(QUOTE_STORAGE_KEY);
      const storedDate = await AsyncStorage.getItem(QUOTE_DATE_STORAGE_KEY);
      const currentDate = getTodaysDateString();

      if (storedQuoteStr && storedDate === currentDate) {
        setDailyQuote(JSON.parse(storedQuoteStr));
      } else {
        const randomIndex = Math.floor(Math.random() * QUOTES_LIST.length);
        const newQuote = QUOTES_LIST[randomIndex];
        setDailyQuote(newQuote);
        await AsyncStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(newQuote));
        await AsyncStorage.setItem(QUOTE_DATE_STORAGE_KEY, currentDate);
      }
    } catch (error) {
      console.error("Failed to load or refresh quote:", error);
      // Fallback to a random quote if storage fails
      const randomIndex = Math.floor(Math.random() * QUOTES_LIST.length);
      setDailyQuote(QUOTES_LIST[randomIndex]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showNewRandomQuote = async () => {
    if (QUOTES_LIST.length > 0) {
      const randomIndex = Math.floor(Math.random() * QUOTES_LIST.length);
      const newQuote = QUOTES_LIST[randomIndex];
      setDailyQuote(newQuote); // Update displayed quote

      // Also update AsyncStorage so it persists for the day
      try {
        const currentDateString = getTodaysDateString(); // Use existing helper
        await AsyncStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(newQuote));
        await AsyncStorage.setItem(QUOTE_DATE_STORAGE_KEY, currentDateString);
      } catch (error) {
        console.error('Failed to save new random quote', error);
        // Optionally, inform the user if saving fails
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadOrRefreshQuote();
    }, [loadOrRefreshQuote])
  );

  if (isLoading) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
        </ThemedView>
      </ImageBackground>
    );
  }

  if (!dailyQuote) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.quoteText}>Could not load a quote.</ThemedText>
        </ThemedView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <ThemedView style={styles.container}>
        <View style={styles.quoteCard}>
          <ThemedText style={styles.quoteText}>"{dailyQuote.text}"</ThemedText>
          <ThemedText style={styles.authorText}>- {dailyQuote.author}</ThemedText>
          <TouchableOpacity onPress={showNewRandomQuote} style={styles.refreshButton}>
            <FontAwesome5 name="sync-alt" size={18} color={Colors[colorScheme].tint} style={styles.refreshIcon} />
            <ThemedText style={styles.refreshButtonText}>Show Another</ThemedText>
          </TouchableOpacity>
        </View>
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
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
      paddingTop: 15,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
    },
    quoteCard: {
      backgroundColor: currentColors.cardBackground + 'E6',
      borderRadius: 15,
      padding: 25,
      marginHorizontal: 10,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 6,
      alignItems: 'center',
    },
    quoteText: {
      fontSize: 22,
      fontStyle: 'italic',
      textAlign: 'center',
      marginBottom: 15,
      color: currentColors.text,
      lineHeight: 30,
    },
    authorText: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      color: currentColors.tint,
    },
    refreshButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
      backgroundColor: currentColors.tint + '20', // Subtle background for the button
    },
    refreshIcon: {
      marginRight: 8,
    },
    refreshButtonText: {
      fontSize: 16,
      color: currentColors.tint,
      fontWeight: '600',
    },
  });
};