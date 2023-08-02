import { COLOR_MODE_ATTRIBUTE } from './constants';
import { ThemeState } from './theme-config';
import { darkModeMediaQuery } from './utils/theme-loading';

/**
 * Provides a script that, when executed before paint, sets the `data-color-mode` attribute based on the current system theme,
 * to enable SSR support for automatic theme switching, avoid a flash of un-themed content on first paint.
 *
 * @param {string} colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 *
 * @returns {string} A string to be added to the innerHTML of a script tag in the document head
 */
const getSSRAutoScript = (colorMode: ThemeState['colorMode']) => {
  return colorMode === 'auto'
    ? `(
  () => {
    try {
      const mql = window.matchMedia('${darkModeMediaQuery}');
      const colorMode = mql.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('${COLOR_MODE_ATTRIBUTE}', colorMode);
    } catch (e) {}
  }
)()`
    : undefined;
};

export default getSSRAutoScript;
