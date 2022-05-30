import { useEffect, useState } from 'react';

import { THEME_DATA_ATTRIBUTE } from './constants';
import { Themes } from './types';

const getGlobalTheme = (): Themes | null =>
  typeof document !== 'undefined'
    ? (document.documentElement.getAttribute(
        THEME_DATA_ATTRIBUTE,
      ) as Themes | null)
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

  constructor(private callback: (theme: Themes | null) => unknown) {}

  observe() {
    if (!this.observer) {
      this.observer = new MutationObserver(() => {
        this.callback(getGlobalTheme());
      });
    }

    this.observer.observe(document.documentElement, {
      attributeFilter: [THEME_DATA_ATTRIBUTE],
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
export const useThemeObserver: () => Themes | null = () => {
  const [theme, setTheme] = useState<Themes | null>(getGlobalTheme());

  useEffect(() => {
    const observer = new ThemeMutationObserver((theme) => setTheme(theme));
    observer.observe();
    return () => observer.disconnect();
  }, []);

  return theme;
};
