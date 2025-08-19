import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '../constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // const colorScheme = useColorScheme() ?? 'light'; // Not strictly needed here if useThemeColor handles defaults

  const themedColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  // Define link colors using the main Colors object.
  // We pass 'text' as the second argument to useThemeColor just to get a value if light/dark are undefined,
  // but lightLinkColor/darkLinkColor should always be defined in Colors.ts.
  const linkSpecificColor = useThemeColor({ light: Colors.light.linkColor, dark: Colors.dark.linkColor }, 'text');


  const finalColor = type === 'link' ? linkSpecificColor : themedColor;

  return (
    <Text
      style={[
        { color: finalColor }, // Use the resolved color
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
});
