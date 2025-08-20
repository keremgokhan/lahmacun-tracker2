# Lahmacun Tracker | Track Your Progress

Lahmacun Tracker is a mobile application built with Expo and React Native, designed to help you track your habits and recovery journeys, celebrate your progress with milestones, and find daily inspiration through wisdom quotes.

## Core Features

*   **Customizable Trackers:**
    *   Create trackers for habits you want to build or addictions you want to overcome.
    *   Clearly view the time elapsed since your start date with dynamic time badges.
    *   See daily progress towards the next 24-hour cycle.
    *   Easily edit, reset, or delete trackers as needed.
*   **Milestone Celebration:**
    *   Automatically see "Just for Today" achievements for ongoing efforts.
    *   Celebrate significant milestones (e.g., 24 hours, 1 week, 30 days, 6 months, 1 year, and subsequent years) for each tracker.
    *   Receive motivating messages tailored for each milestone reached.
*   **Daily Wisdom Quotes:**
    *   Discover a new inspirational quote each day to support your journey.
    *   Option to refresh and view other quotes from a curated collection.
    *   Enjoy a calm and focused reading experience.

## Getting Started

1.  **Prerequisites:**
    *   Make sure you have [Node.js](https://nodejs.org/) (LTS version recommended) installed.
    *   You will also need `npm` (which comes with Node.js) or [Yarn](https://yarnpkg.com/).
    *   Install the Expo CLI globally:
        ```bash
        npm install -g expo-cli
        ```

2.  **Clone the Repository:**
    ```bash
    git clone git@github.com:keremgokhan/lahmacun-tracker2.git
    cd lahmacun-tracker2
    ```

3.  **Install Dependencies:**
    Navigate to the project directory in your terminal and run:
    ```bash
    npm install
    ```
    or if you prefer Yarn:
    ```bash
    yarn install
    ```

4.  **Start the Development Server:**
    Once dependencies are installed, start the Expo development server:
    ```bash
    npx expo start
    ```
    This command will:
    *   Start the Metro bundler.
    *   Open a new tab in your web browser with the Expo Developer Tools.
    *   Display a QR code in the terminal and in the Expo Developer Tools.

5.  **Running the App:**
    *   **On a Physical Device (iOS or Android):**
        1.  Install the **Expo Go** app from the App Store or Google Play Store on your device.
        2.  Scan the QR code shown in the terminal or Expo Developer Tools using the Expo Go app.
    *   **On an Android Emulator:**
        1.  Ensure you have an Android emulator set up and running.
        2.  Press `a` in the terminal where `npx expo start` is running.
    *   **On an iOS Simulator (macOS only):**
        1.  Ensure you have Xcode and its command-line tools installed.
        2.  Press `i` in the terminal where `npx expo start` is running.
    *   **In a Web Browser:**
        1.  Press `w` in the terminal where `npx expo start` is running. (Note: Web compatibility may vary based on specific native modules used).

## Technologies Used

*   [Expo SDK](https://expo.dev/)
*   [React Native](https://reactnative.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation
*   [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for local data persistence
*   [FontAwesome5](https://icons.expo.fyi/) for icons

## Project Structure Overview

*   `app/`: Contains all the screens and navigation logic using Expo Router.
    *   `(tabs)/`: Defines the main tab-based navigation screens (Trackers, Milestones, Quotes).
        *   `_layout.tsx`: Layout for the tab navigator.
        *   `index.tsx`: Trackers screen (your main screen for listing trackers).
        *   `milestones.tsx`: Milestones screen.
        *   `quotes.tsx`: Daily quotes screen.
    *   `_layout.tsx`: Main app layout, potentially for global providers or styles.
    *   `edit-tracker.tsx`: Screen for creating and editing trackers.
    *   `modal.tsx`: A general modal screen, as per Expo's default structure (can be customized or removed if not used).
*   `assets/`: Static assets like images and fonts.
    *   `images/`: App icons, background images (e.g., `nature_green_background.png`).
    *   `fonts/`: Custom fonts if any (e.g., SpaceMono-Regular.ttf from default).
*   `components/`: Reusable UI components.
    *   `ThemedText.tsx`, `ThemedView.tsx`: Basic themed UI elements.
    *   `TrackerCard.tsx`: Component for displaying individual trackers.
    *   `MilestoneCard.tsx`: Component for displaying achieved milestones.
    *   `TabBarIcon.tsx` (If you have a custom one, or `(tabs)/_layout.tsx` handles icons directly).
    *   *(You may have removed `HelloWave.tsx`, `ExternalLink.tsx` - adjust this list as needed)*
*   `constants/`: Global constants.
    *   `Colors.ts`: Defines the light and dark mode color palettes.
    *   `MilestoneDefs.ts` (Or similar, if you've centralized milestone logic/data).
*   `hooks/`: Custom React hooks.
    *   `useColorScheme.ts`: Hook to get the current color scheme.
*   `types/`: TypeScript type definitions for the application (`types.ts`).
*   `utils/`: Utility functions.
    *   `timeUtils.ts`: Functions for formatting time differences and calculating milestones.
*   `README.md`: This file!
*   `package.json`: Project dependencies and scripts.
*   `tsconfig.json`: TypeScript configuration.
*   `babel.config.js`: Babel configuration.
*   `app.json`: Expo app configuration file.

---

Thank you for checking out Lahmacun Tracker! We hope it helps you on your journey of self-improvement.
