// /Users/keremgokhan/dev/repos/lahmacun-tracker2/components/CustomDateTimePicker.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface CustomDateTimePickerProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
  label?: string; // Optional label for the picker
}

export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  currentDate,
  onDateChange,
  label = "Start Date & Time:", // Default label
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const newDate = new Date(currentDate.getTime()); // Clone to preserve original time part initially
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      // No need to call onDateChange here yet, wait for time
      onDateChange(newDate); // Call onDateChange to update parent's state
      setShowTimePicker(true); // Proceed to show time picker
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      const newTime = new Date(currentDate.getTime()); // Clone to preserve original date part
      newTime.setHours(selectedTime.getHours());
      newTime.setMinutes(selectedTime.getMinutes());
      newTime.setSeconds(selectedTime.getSeconds());
      onDateChange(newTime); // Call onDateChange with the final date-time
    }
  };

  const initiateDateTimePicker = () => {
    setShowDatePicker(true);
  };

  // The main TouchableOpacity should update the parent's date after time selection,
  // so we call onDateChange in handleTimeChange with the fully formed date.
  // In handleDateChange, we update a temporary state or directly set the date part
  // and then trigger the time picker. The prop `currentDate` from parent IS the source of truth.

  // Let's adjust handleDateChange slightly to directly use the passed `onDateChange`
  // after combining with current time, before showing time picker
  // This way, the parent state is updated after each step if desired,
  // or we can just update parent state once after time.
  // For simplicity and to ensure `currentDate` prop reflects intermediate state for TimePicker:

  const _onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const newDateObject = new Date(currentDate); // Clone current date from prop
      newDateObject.setFullYear(selectedDate.getFullYear());
      newDateObject.setMonth(selectedDate.getMonth());
      newDateObject.setDate(selectedDate.getDate());
      onDateChange(newDateObject); // Update parent state with the new date part
      setShowTimePicker(true);    // Then show time picker
    }
  };

  const _onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      const newDateObject = new Date(currentDate); // Clone current date from prop
      newDateObject.setHours(selectedTime.getHours());
      newDateObject.setMinutes(selectedTime.getMinutes());
      newDateObject.setSeconds(selectedTime.getSeconds());
      onDateChange(newDateObject); // Update parent state with the new time part
    }
  };


  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <TouchableOpacity onPress={initiateDateTimePicker} style={styles.dateDisplay}>
        <ThemedText style={styles.dateDisplayText}>{currentDate.toLocaleString()}</ThemedText>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={currentDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={_onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={currentDate} 
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={_onTimeChange}
        />
      )}
      {(Platform.OS === 'ios' && (showDatePicker || showTimePicker)) && (
           <TouchableOpacity 
              onPress={() => {
                  setShowDatePicker(false);
                  setShowTimePicker(false);
              }} 
              style={styles.iosPickerDismissButton}
          >
              <ThemedText style={styles.iosPickerDismissButtonText}>Done</ThemedText>
          </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (colorScheme: 'light' | 'dark') => {
  const currentColors = Colors[colorScheme];
  return StyleSheet.create({
    container: {
      marginBottom: 20, // Add margin to the container of the picker
    },
    label: { // Copied from add/edit screens
      fontSize: 16,
      marginBottom: 8,
      color: currentColors.text,
      fontWeight: '500',
    },
    dateDisplay: {
      borderWidth: 1,
      borderColor: currentColors.separator,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      // marginBottom: 20, // Margin is now on the container
      backgroundColor: currentColors.cardBackground,
      alignItems: 'center',
    },
    dateDisplayText: {
      fontSize: 16,
      color: currentColors.text,
    },
    iosPickerDismissButton: {
        backgroundColor: currentColors.tint,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        // marginBottom: 20, // Margin is now on the container
    },
    iosPickerDismissButtonText: {
        color: currentColors.primaryButtonText,
        fontSize: 16,
        fontWeight: 'bold',
    },
  });
};
