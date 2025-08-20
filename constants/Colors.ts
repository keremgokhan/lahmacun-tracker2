/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * This palette is designed with Nature Greens & Earthy Tones.
 */

// Light Theme Colors
const lightText = '#3A4D39'; // Dark Moss Green (for primary text)
const lightBackground = '#F4F1E9'; // Warm Off-White/Light Beige
const lightTint = '#6B8E23'; // Olive Drab (primary action color)
const lightPrimaryButtonText = '#FFFFFF'; // White (for text on lightTint buttons)
const lightIcon = '#4A5D23'; // Slightly desaturated Olive for icons
const lightTabIconDefault = '#708090'; // Slate Gray (neutral for unselected tabs)
const lightSeparator = '#D3D3C9'; // Light Grayish Beige (for borders, lines)
const lightCardBackground = '#FAFAF5'; // NEW - Lighter beige/ivory for cards
const lightDanger = '#C04000'; // Maroon/Muted Red (for delete actions)
const lightWarning = '#DAA520'; // Goldenrod/Muted Yellow-Orange (for reset actions)
const lightGray = '#A9A9A9'; // A generic gray
const lightBlack = '#000000';
const lightLinkColor = '#0a7ea4';

// Dark Theme Colors
const darkText = '#E0E0D1'; // Light Beige/Off-white (for primary text)
const darkBackground = '#2E3629'; // Very Dark Desaturated Green/Almost Black-Green
const darkTint = '#8FBC8F'; // Dark Sea Green (primary action color)
const darkPrimaryButtonText = '#1A2419'; // Very Dark Green (for text on darkTint buttons)
const darkIcon = '#B0C4B1'; // Soft, desaturated light green for icons
const darkTabIconDefault = '#A9A9A9'; // Dark Gray (neutral for unselected tabs)
const darkSeparator = '#4A5440'; // Darker Gray-Green (for borders, lines)
const darkCardBackground = '#2A2A25'; // NEW - Darker, desaturated beige/ivory for cards (lighter than original dark card bg)
const darkDanger = '#E57373'; // Soft Red (for delete actions)
const darkWarning = '#FFB74D'; // Soft Orange (for reset actions)
const darkGray = '#555555'; // A generic dark gray
const darkBlack = '#000000';
const darkLinkColor = '#69b8db';

export const Colors = {
  light: {
    text: lightText,
    background: lightBackground,
    tint: lightTint,
    primaryButtonText: lightPrimaryButtonText,
    icon: lightIcon,
    tabIconDefault: lightTabIconDefault,
    tabIconSelected: lightTint, // Selected tab uses the main tint color
    separator: lightSeparator,
    cardBackground: lightCardBackground, // Updated to use the new lighter color
    danger: lightDanger,
    warning: lightWarning,
    gray: lightGray,
    black: lightBlack,
    linkColor: lightLinkColor,
  },
  dark: {
    text: darkText,
    background: darkBackground,
    tint: darkTint,
    primaryButtonText: darkPrimaryButtonText,
    icon: darkIcon,
    tabIconDefault: darkTabIconDefault,
    tabIconSelected: darkTint, // Selected tab uses the main tint color
    separator: darkSeparator,
    cardBackground: darkCardBackground, // Updated to use the new lighter color
    danger: darkDanger,
    warning: darkWarning,
    gray: darkGray,
    black: darkBlack,
    linkColor: darkLinkColor,
  },
};
