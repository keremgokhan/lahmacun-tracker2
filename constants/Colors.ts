/**
 * Below are the colors that are used in the app.
 * Version 2: Incorporating "Calm & Zen" and "Motivating Milestones" feedback.
 */

// Light Theme Colors
const lightCardBackground = '#FAFAF5'; // Light beige/ivory for cards
const lightTextNeutral = '#333333';   // Dark neutral for titles and main non-accented text
const lightTextSecondary = '#666666'; // Gray for dates, subtitles
const lightTextAccent = '#2E7D32';    // Green for main accent text (e.g., author names)
const lightScreenBackground = '#F4F1E9'; // Existing warm off-white (if image doesn't cover all)

const lightAccentGreenSoft = '#81C784';   // For icons, softer accents
const lightAccentGreenMedium = '#4CAF50'; // For buttons, medium accents (e.g., "Add Tracker", "Show Another")
const lightAccentGreenBold = '#2E7D32';    // For motivating milestone text, strong accents

const lightButtonText = '#FFFFFF';       // White text for on-green buttons
const lightPrimaryButtonText = '#FFFFFF';// Keeping this for now, consistent with lightButtonText

// Original palette colors (can be phased out or repurposed)
const originalLightText = '#3A4D39';
const originalLightTint = '#6B8E23';
const lightSeparator = '#D3D3C9';
const lightDanger = '#C04000';
const lightWarning = '#DAA520';
const lightGray = '#A9A9A9';
const lightBlack = '#000000'; // For shadows, etc.
const lightLinkColor = '#0a7ea4';


// Dark Theme Colors (interpretations for "Calm & Zen" / "Motivating")
const darkCardBackground = '#2A2A25';    // Darker, desaturated beige/ivory
const darkTextNeutral = '#E0E0E0';       // Light gray for readability
const darkTextSecondary = '#A0A0A0';     // Medium gray
const darkTextAccent = '#A5D6A7';        // Lighter green for main accent text

const darkScreenBackground = '#2E3629';  // Existing dark green (if image doesn't cover all)

const darkAccentGreenSoft = '#A5D6A7';   // Brighter, desaturated green
const darkAccentGreenMedium = '#66BB6A'; // Brighter, desaturated green
const darkAccentGreenBold = '#66BB6A';    // Using medium-bold for dark theme motivating text for now

const darkButtonText = '#FFFFFF';         // White text for on-green buttons (could be #121212 if green is very light)
const darkPrimaryButtonText = '#1A2419'; // Keeping this for now

// Original palette colors (dark)
const originalDarkText = '#E0E0D1';
const originalDarkTint = '#8FBC8F';
const darkSeparator = '#4A5440';
const darkDanger = '#E57373';
const darkWarning = '#FFB74D';
const darkGray = '#555555'; // A generic dark gray
const darkBlack = '#000000'; // Actual black, e.g. for shadowColor in light theme; dark theme shadows might be lighter.
const darkLinkColor = '#69b8db';


export const Colors = {
  light: {
    // New thematic colors
    cardBackground: lightCardBackground,
    text: lightTextNeutral, // Default text is now neutral
    textNeutral: lightTextNeutral,
    textSecondary: lightTextSecondary,
    textAccent: lightTextAccent,
    accentSoft: lightAccentGreenSoft,
    accentMedium: lightAccentGreenMedium,
    accentBold: lightAccentGreenBold,
    buttonText: lightButtonText,
    screenBackground: lightScreenBackground, // For views that might not be covered by ImageBackground

    // Retaining some from previous palette for compatibility or specific uses
    primaryButtonText: lightPrimaryButtonText, // Often same as buttonText
    tint: lightAccentGreenMedium, // General purpose tint can be the medium green
    icon: lightAccentGreenSoft,   // Default icon color
    tabIconDefault: lightGray,    // Neutral for unselected tabs
    tabIconSelected: lightAccentGreenMedium,
    separator: lightSeparator,
    danger: lightDanger,
    warning: lightWarning,
    gray: lightGray,
    black: lightBlack,
    linkColor: lightLinkColor,
  },
  dark: {
    // New thematic colors
    cardBackground: darkCardBackground,
    text: darkTextNeutral, // Default text is now neutral
    textNeutral: darkTextNeutral,
    textSecondary: darkTextSecondary,
    textAccent: darkTextAccent,
    accentSoft: darkAccentGreenSoft,
    accentMedium: darkAccentGreenMedium,
    accentBold: darkAccentGreenBold,
    buttonText: darkButtonText,
    screenBackground: darkScreenBackground,

    // Retaining some from previous palette
    primaryButtonText: darkPrimaryButtonText,
    tint: darkAccentGreenMedium,
    icon: darkAccentGreenSoft,
    tabIconDefault: darkGray,
    tabIconSelected: darkAccentGreenMedium,
    separator: darkSeparator,
    danger: darkDanger,
    warning: darkWarning,
    gray: darkGray,
    // Note: 'black' in dark theme for text on a light surface would be light.
    // 'black' for shadowColor should remain actual black or a dark equivalent.
    black: darkBlack, // shadowColor, etc.
    linkColor: darkLinkColor,
  },
};
