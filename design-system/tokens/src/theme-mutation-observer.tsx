import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from './constants';
import getGlobalTheme from './get-global-theme';
import { ActiveThemeState } from './set-global-theme';

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
export default class ThemeMutationObserver {
  observer: MutationObserver | null = null;
  mediaObserver: any = null;

  constructor(
    private callback: (theme: Partial<ActiveThemeState>) => unknown,
  ) {}

  observe() {
    if (!this.observer) {
      this.observer = new MutationObserver(() => {
        this.callback(getGlobalTheme());
      });
    }

    this.observer.observe(document.documentElement, {
      attributeFilter: [THEME_DATA_ATTRIBUTE, COLOR_MODE_ATTRIBUTE],
    });
  }

  disconnect() {
    this.observer && this.observer.disconnect();
  }
}
