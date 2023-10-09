import React, { createContext, useContext } from 'react';

import ThemeProvider, { type ColorMode, type Theme } from './theme-provider';

const InsideAppProviderContext = createContext(false);

const defaultThemeSettings: Theme = {
  dark: 'dark',
  light: 'light',
  spacing: 'spacing',
};

interface AppProviderProps {
  /**
   * Initial color mode.
   */
  defaultColorMode?: ColorMode;

  /**
   * Theme settings.
   */
  defaultTheme?: Theme;

  /**
   * App content.
   */
  children: React.ReactNode;
}

/**
 * __App provider__
 *
 * An app provider provides app level configuration such as global theming.
 *
 * Place it at the root of your application.
 */
export function AppProvider({
  children,
  defaultColorMode = 'light',
  defaultTheme = defaultThemeSettings,
}: AppProviderProps) {
  const isInsideAppProvider = useContext(InsideAppProviderContext);

  if (isInsideAppProvider) {
    throw new Error(
      'App provider should not be nested within another app provider.',
    );
  }

  return (
    <InsideAppProviderContext.Provider value={true}>
      <ThemeProvider
        defaultColorMode={defaultColorMode}
        defaultTheme={defaultTheme}
      >
        {children}
      </ThemeProvider>
    </InsideAppProviderContext.Provider>
  );
}

export default AppProvider;
