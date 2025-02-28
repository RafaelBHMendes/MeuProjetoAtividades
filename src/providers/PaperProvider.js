import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

export function AppProvider({ children }) {
  return (
    <PaperProvider theme={theme}>
      {children}
    </PaperProvider>
  );
} 