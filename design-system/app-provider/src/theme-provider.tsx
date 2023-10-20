import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { bind } from 'bind-event-listener';

import { setGlobalTheme, type ThemeState } from '@atlaskit/tokens';

export type Theme = Omit<ThemeState, 'colorMode' | 'contrastMode'>;
export type ColorMode = 'light' | 'dark' | 'auto';
export type ReconciledColorMode = Exclude<ColorMode, 'auto'>;

const defaultThemeSettings: Theme = {
  dark: 'dark',
  light: 'light',
  spacing: 'spacing',
};

const ColorModeContext = createContext<ReconciledColorMode | undefined>(
  undefined,
);

const SetColorModeContext = createContext<
  ((value: ColorMode) => void) | undefined
>(undefined);

const ThemeContext = createContext<Theme | undefined>(undefined);

const SetThemeContext = createContext<
  ((value: Partial<Theme>) => void) | undefined
>(undefined);

/**
 * __useColorMode()__
 *
 * Returns the current color mode when inside the app provider.
 */
export function useColorMode(): ReconciledColorMode {
  const value = useContext(ColorModeContext);
  if (!value) {
    throw new Error('useColorMode must be used within AppProvider.');
  }

  return value;
}

/**
 * __useSetColorMode()__
 *
 * Returns the color mode setter when inside the app provider.
 */
export function useSetColorMode(): (value: ColorMode) => void {
  const value = useContext(SetColorModeContext);
  if (!value) {
    throw new Error('useSetColorMode must be used within AppProvider.');
  }

  return value;
}

/**
 * __useTheme()__
 *
 * Returns the current theme settings when inside the app provider.
 */
export function useTheme(): Theme {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within AppProvider.');
  }

  return value;
}

/**
 * __useSetTheme()__
 *
 * Returns the theme setter when inside the app provider.
 */
export function useSetTheme(): (value: Partial<Theme>) => void {
  const value = useContext(SetThemeContext);
  if (!value) {
    throw new Error('useSetTheme must be used within AppProvider.');
  }

  return value;
}

const isMatchMediaAvailable =
  typeof window !== 'undefined' && 'matchMedia' in window;

const prefersDarkModeMql = isMatchMediaAvailable
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : undefined;

// TODO: currently 'auto' color mode will always return 'light' in SSR.
// Additional work required: https://product-fabric.atlassian.net/browse/DSP-9781
function getReconciledColorMode(colorMode: ColorMode): ReconciledColorMode {
  if (colorMode === 'auto') {
    return prefersDarkModeMql?.matches ? 'dark' : 'light';
  }

  return colorMode;
}

interface ThemeProviderProps {
  defaultColorMode: ColorMode;
  defaultTheme?: Partial<Theme>;
  children: React.ReactNode;
}

/**
 * __Theme provider__
 *
 * Provides global theming configuration.
 *
 * @internal
 */
export function ThemeProvider({
  children,
  defaultColorMode,
  defaultTheme: {
    dark = 'dark',
    light = 'light',
    spacing = 'spacing',
    typography,
    shape,
  } = defaultThemeSettings,
}: ThemeProviderProps) {
  const [chosenColorMode, setChosenColorMode] =
    useState<ColorMode>(defaultColorMode);
  const [reconciledColorMode, setReconciledColorMode] =
    useState<ReconciledColorMode>(getReconciledColorMode(defaultColorMode));

  const [theme, setTheme] = useState<Theme>({
    dark,
    light,
    spacing,
    typography,
    shape,
  });

  const setColorMode = useCallback((colorMode: ColorMode) => {
    setChosenColorMode(colorMode);
    setReconciledColorMode(getReconciledColorMode(colorMode));
  }, []);

  const setPartialTheme = useCallback((nextTheme: Partial<Theme>) => {
    setTheme(theme => ({ ...theme, ...nextTheme }));
  }, []);

  useEffect(() => {
    setGlobalTheme({
      ...theme,
      colorMode: reconciledColorMode,
    });
  }, [theme, reconciledColorMode]);

  useEffect(() => {
    if (!prefersDarkModeMql) {
      return;
    }

    const unbindListener = bind(prefersDarkModeMql, {
      type: 'change',
      listener: event => {
        if (chosenColorMode === 'auto') {
          setReconciledColorMode(event.matches ? 'dark' : 'light');
        }
      },
    });

    return unbindListener;
  }, [chosenColorMode]);

  return (
    <ColorModeContext.Provider value={reconciledColorMode}>
      <SetColorModeContext.Provider value={setColorMode}>
        <ThemeContext.Provider value={theme}>
          <SetThemeContext.Provider value={setPartialTheme}>
            {children}
          </SetThemeContext.Provider>
        </ThemeContext.Provider>
      </SetColorModeContext.Provider>
    </ColorModeContext.Provider>
  );
}

export default ThemeProvider;
