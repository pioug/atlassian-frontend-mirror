import React, { createContext, useContext } from 'react';

import RouterLinkProvider, {
  type RouterLinkComponent,
} from './router-link-provider';
import ThemeProvider, { type ColorMode, type Theme } from './theme-provider';

const InsideAppProviderContext = createContext(false);
interface AppProviderProps {
  /**
   * Initial color mode.
   */
  defaultColorMode?: ColorMode;

  /**
   * Theme settings.
   */
  defaultTheme?: Partial<Theme>;

  /**
   * A configured router link component.
   */
  routerLinkComponent?: RouterLinkComponent<any>;

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
  defaultTheme,
  routerLinkComponent,
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
        <RouterLinkProvider routerLinkComponent={routerLinkComponent}>
          {children}
        </RouterLinkProvider>
      </ThemeProvider>
    </InsideAppProviderContext.Provider>
  );
}

export default AppProvider;
