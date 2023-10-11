import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import getThemeHtmlAttrs from '../get-theme-html-attrs';
import { ThemeState } from '../theme-config';

import ColorModeObserver from './color-mode-listeners';
import ContrastModeObserver from './contrast-mode-listeners';

/**
 * Given ThemeState, sets appropriate html attributes on the documentElement,
 * adds a listener to keep colorMode updated, and returns a function to unbind.
 */
export default function configurePage(themeState: ThemeState) {
  if (themeState.colorMode === 'auto') {
    // Set colorMode based on the user preference
    themeState.colorMode = ColorModeObserver.getColorMode();
    // Bind a listener (if one doesn't already exist) to keep colorMode updated
    ColorModeObserver.bind();
  } else {
    ColorModeObserver.unbind();
  }

  if (getBooleanFF('platform.design-system-team.increased-contrast-themes')) {
    if (themeState.contrastMode === 'auto') {
      // Set contrastMode based on the user preference
      themeState.contrastMode = ContrastModeObserver.getContrastMode();
      // Bind a listener (if one doesn't already exist) to keep contrastMode updated
      ContrastModeObserver.bind();
    } else {
      ContrastModeObserver.unbind();
    }
  }

  const themeAttributes = getThemeHtmlAttrs(themeState);

  Object.entries(themeAttributes).forEach(([key, value]) => {
    document.documentElement.setAttribute(key, value);
  });

  return () => {
    ColorModeObserver.unbind();
    if (getBooleanFF('platform.design-system-team.increased-contrast-themes')) {
      ContrastModeObserver.unbind();
    }
  };
}
