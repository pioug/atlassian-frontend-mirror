import { useEffect, useState } from 'react';

import { getGlobalTheme } from './get-global-theme';
import { ThemeState } from './set-global-theme';
import { ThemeMutationObserver } from './theme-mutation-observer';

/**
 * A React hook which returns the current themes and color-mode set on `<html>`.
 *
 * @example
 * ```
 * const { colorMode, dark, light, spacing, typography } = useThemeObserver();
 *
 * // Performing side effects when it changes
 * useEffect(() => {
 *   console.log(`The color mode has changed to ${theme.colorMode}`);
 * }, [theme.colorMode]);
 * ```
 */
export const useThemeObserver: () => Partial<ThemeState> = () => {
  const [theme, setTheme] = useState<Partial<ThemeState>>(getGlobalTheme());

  useEffect(() => {
    const observer = new ThemeMutationObserver((theme) => setTheme(theme));
    observer.observe();
    return () => observer.disconnect();
  }, []);

  return theme;
};
