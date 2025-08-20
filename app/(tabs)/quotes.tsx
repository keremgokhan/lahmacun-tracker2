import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome5 } from '@expo/vector-icons';

const QUOTE_STORAGE_KEY = 'dailyQuote';
const QUOTE_DATE_STORAGE_KEY = 'dailyQuoteDate';

const QUOTES_LIST = [
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "You have power over your mind – not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius (Meditations)" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu (Tao Te Ching)" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant (summarizing Aristotle\'s Ethics)" },
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
  const currentColors = Colors[colorScheme];

  const getTodaysDateString = () => {
    return new Date().toISOString().split('T')[0]; // Gets 'YYYY-MM-DD'
  };

  const loadOrRefreshQuote = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const storedQuoteStr = await AsyncStorage.getItem(QUOTE_STORAGE_KEY);
      const storedDate = await AsyncStorage.getItem(QUOTE_DATE_STORAGE_KEY);
      const currentDate = getTodaysDateString();

      if (!forceRefresh && storedQuoteStr && storedDate === currentDate) {
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
      // Fallback to a random quote from the list if storage fails
      const randomIndex = Math.floor(Math.random() * QUOTES_LIST.length);
      setDailyQuote(QUOTES_LIST[randomIndex]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrRefreshQuote();
    }, [loadOrRefreshQuote])
  );

  if (isLoading) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={currentColors.accentMedium} />
          <ThemedText style={{ marginTop: 10, color: currentColors.textNeutral }}>Loading wisdom...</ThemedText>
        </ThemedView>
      </ImageBackground>
    );
  }

  if (!dailyQuote) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={{color: currentColors.textNeutral, textAlign: 'center'}}>Could not load a quote. Please try again later.</ThemedText>
          <TouchableOpacity style={styles.refreshButton} onPress={() => loadOrRefreshQuote(true)}>
            <FontAwesome5 name="sync-alt" size={14} color={currentColors.buttonText} style={{ marginRight: 8 }} />
            <ThemedText style={styles.refreshButtonText}>Try Again</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <ThemedView style={styles.container}>
        <View style={styles.quoteCard}>
          <FontAwesome5 name="quote-left" size={24} color={currentColors.accentSoft} style={styles.quoteIconLeft} />
          <ThemedText style={styles.quoteText}>"{dailyQuote.text}"</ThemedText>
          <FontAwesome5 name="quote-right" size={24} color={currentColors.accentSoft} style={styles.quoteIconRight} />
          {dailyQuote.author && (
            <ThemedText style={styles.authorText}>- {dailyQuote.author}</ThemedText>
          )}
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={() => loadOrRefreshQuote(true)}>
          <FontAwesome5 name="random" size={14} color={currentColors.buttonText} style={{ marginRight: 8 }} />
          <ThemedText style={styles.refreshButtonText}>Show Another</ThemedText>
        </TouchableOpacity>
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
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
    },
    centerContainer: { // For loading and error states
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
    },
    quoteCard: {
      backgroundColor: currentColors.cardBackground, // Beige/Ivory
      borderRadius: 12,
      padding: 20, // Adjusted padding
      width: '100%',
      alignItems: 'center',
      shadowColor: currentColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      marginBottom: 30, // Space before the button
    },
    quoteIconLeft: {
      position: 'absolute',
      top: 15,
      left: 15,
      opacity: 0.5,
    },
    quoteIconRight: {
      position: 'absolute',
      bottom: 15,
      right: 15,
      opacity: 0.5,
    },
    quoteText: {
      fontSize: 18, // Adjusted size
      color: currentColors.textNeutral, // Dark neutral
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 26, // Increased line height
      marginBottom: 15, // Space before author
      paddingHorizontal: 15, // Ensure text doesn't touch quote icons
    },
    authorText: {
      fontSize: 16, // Adjusted size
      color: currentColors.textAccent, // Green accent
      textAlign: 'right',
      width: '100%',
      paddingRight: 10, // Align with quote text padding
      marginTop: 5,
    },
    refreshButton: {
      backgroundColor: currentColors.accentMedium, // Medium green
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 25, // More rounded for "pill" shape
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: currentColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2,
      marginTop: 20, // Ensure it's not off-screen on loading/error
    },
    refreshButtonText: {
      color: currentColors.buttonText, // White text
      fontSize: 15, // Adjusted size
      fontWeight: '600',
    },
  });
};
