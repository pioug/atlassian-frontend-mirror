import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { COLOR_MODE_ATTRIBUTE, CONTRAST_MODE_ATTRIBUTE } from './constants';
import { ThemeState } from './theme-config';
import {
  darkModeMediaQuery,
  moreContrastMediaQuery,
} from './utils/theme-loading';

/**
 * Provides a script that, when executed before paint, sets the `data-color-mode` attribute based on the current system theme,
 * to enable SSR support for automatic theme switching, avoid a flash of un-themed content on first paint.
 *
 * @param {string} colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 *
 * @returns {string} A string to be added to the innerHTML of a script tag in the document head
 */
const getSSRAutoScript = (
  colorMode: ThemeState['colorMode'],
  // TODO: This should be marked as required once safe to roll out.
  contrastMode?: ThemeState['contrastMode'],
) => {
  if (colorMode !== 'auto' && contrastMode !== 'auto') {
    return undefined;
  }

  const setColorMode =
    colorMode === 'auto'
      ? `\n  try {
    const darkModeMql = window.matchMedia('${darkModeMediaQuery}');
    const colorMode = darkModeMql.matches ? 'dark' : 'light';
    document.documentElement.setAttribute('${COLOR_MODE_ATTRIBUTE}', colorMode);
  } catch (e) {}`
      : '';

  const setContrastMode =
    getBooleanFF('platform.design-system-team.increased-contrast-themes') &&
    contrastMode === 'auto'
      ? `\n  try {
    const contrastModeMql = window.matchMedia('${moreContrastMediaQuery}');
    const contrastMode = contrastModeMql.matches ? 'more' : 'no-preference';
    document.documentElement.setAttribute('${CONTRAST_MODE_ATTRIBUTE}', contrastMode);
  } catch (e) {}`
      : '';

  return `(() => {${setColorMode}${setContrastMode}})()`;
};

export default getSSRAutoScript;
