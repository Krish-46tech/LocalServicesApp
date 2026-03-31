import React, { createContext, useContext, useMemo, useState } from 'react';
import { buildTheme } from '../constants/theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');

  const value = useMemo(() => {
    const theme = buildTheme(mode);
    return {
      mode,
      theme,
      isDark: mode === 'dark',
      setMode,
      toggleMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
