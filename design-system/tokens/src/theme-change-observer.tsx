import { useEffect, useState } from 'react';

import { COLOR_MODE_ATTRIBUTE } from './constants';
import { ThemeIds } from './theme-config';

const getGlobalTheme = (): ThemeIds | null =>
  typeof document !== 'undefined'
    ? (document.documentElement.getAttribute(
        COLOR_MODE_ATTRIBUTE,
      ) as ThemeIds | null)
    : null;

/**
 * A MutationObserver which watches the `<html>` element for changes to the theme.
 *
 * In React, use the {@link useThemeObserver `useThemeObserver`} hook instead.
 *
 * @param {function} callback - A callback function which fires when the theme changes.
 *
 * @example
 * ```
 * const observer = new ThemeMutationObserver((theme) => {});
 * observer.observe();
 * ```
 */
export class ThemeMutationObserver {
  observer: MutationObserver | null = null;
  mediaObserver: any = null;

  constructor(private callback: (theme: ThemeIds | null) => unknown) {}

  observe() {
    if (!this.observer) {
      this.observer = new MutationObserver(() => {
        this.callback(getGlobalTheme());
      });
    }

    this.observer.observe(document.documentElement, {
      attributeFilter: [COLOR_MODE_ATTRIBUTE],
    });
  }

  disconnect() {
    this.observer && this.observer.disconnect();
  }
}

/**
 * A React hook which returns the current theme set on `<html>`, or `null` if not set.
 *
 * @example
 * ```
 * const theme = useThemeObserver(); // Returns 'light' or 'dark'
 *
 * // Performing side effects when it changes
 * useEffect(() => {
 *   console.log(`The theme has changed to ${theme}`);
 * }, [theme]);
 * ```
 */
export const useThemeObserver: () => ThemeIds | null = () => {
  const [theme, setTheme] = useState<ThemeIds | null>(getGlobalTheme());

  useEffect(() => {
    const observer = new ThemeMutationObserver((theme) => setTheme(theme));
    observer.observe();
    return () => observer.disconnect();
  }, []);

  return theme;
};
