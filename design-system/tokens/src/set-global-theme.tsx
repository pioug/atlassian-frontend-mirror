import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from './constants';
import themeConfig, { ThemeIds } from './theme-config';

/**
 * Sets the theme globally at runtime. This updates the `data-theme` and `data-color-scheme` attributes on your page's <html> tag.
 *
 * @param {string} themeId - Which theme should be used by default.
 * @param {string} [shouldMatchSystem=false] - Whether the theme should automatically switch between themes to match the system preference.
 *
 * @example
 * ```
 * // Set light theme as the default theme, but switch to others based on the system color theme.
 * setGlobalTheme('light', true);
 * ```
 */
const setGlobalTheme = (themeId: ThemeIds, shouldMatchSystem = false) => {
  const theme = Object.values(themeConfig).find(({ id }) => id === themeId);

  if (process.env.NODE_ENV !== 'production') {
    if (!theme) {
      const themeIds = Object.values(themeConfig).map(({ id }) => id);
      throw new Error(
        `setGlobalTheme only accepts themes: ${themeIds.join(', ')}`,
      );
    }
  }

  if (!theme) {
    return;
  }

  const element = document.documentElement;
  element.setAttribute(THEME_DATA_ATTRIBUTE, theme.id);

  if (theme.attributes.type === 'color') {
    element.setAttribute(COLOR_MODE_ATTRIBUTE, theme.attributes.mode);
  }

  if (shouldMatchSystem) {
    element.setAttribute(COLOR_MODE_ATTRIBUTE, 'auto');
  }
};

export default setGlobalTheme;
