// App.js
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Navigation from './src/navigation/Navigation';
import { theme } from './src/theme';
import { ActivityProvider } from './src/contexts/ActivityContext';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ActivityProvider>
        <Navigation />
        <Toast />
      </ActivityProvider>
    </PaperProvider>
  );
}
