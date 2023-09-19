import { COLOR_MODE_ATTRIBUTE, CUSTOM_THEME_ATTRIBUTE } from './constants';
import { ThemeStyles } from './get-theme-styles';
import {
  ThemeOptionsSchema,
  ThemeState,
  themeStateDefaults,
} from './theme-config';
import {
  limitSizeOfCustomStyleElements,
  reduceTokenMap,
} from './utils/custom-theme-loading-utils';
import {
  generateColors,
  generateTokenMapWithContrastCheck,
} from './utils/generate-custom-color-ramp';
import { hash } from './utils/hash';

export const CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD = 10;

/**
 *
 * @param themeSchema The schema of available themes
 * @returns a string with the CSS for the custom theme
 */
/**
 * Takes a color mode and custom branding options, and returns an array of objects for use in applying custom styles to the document head.
 * Only supplies the color themes necessary for initial render, based on the current themeState. I.e. if in light mode, dark mode themes are not returned.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {string} themeState.colorMode Determines which color theme is applied
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 *
 * @returns An object array, containing theme IDs, data-attributes to attach to the theme, and the theme CSS.
 * If an error is encountered while loading themes, the themes array will be empty.
 */
export function getCustomThemeStyles(
  themeState: Partial<ThemeState> & {
    UNSAFE_themeOptions: ThemeOptionsSchema;
  },
): ThemeStyles[] {
  const brandColor = themeState?.UNSAFE_themeOptions?.brandColor;
  const mode = themeState?.colorMode || themeStateDefaults['colorMode'];
  const optionString = JSON.stringify(themeState?.UNSAFE_themeOptions);
  const uniqueId = hash(optionString);
  const themeRamp = generateColors(brandColor).ramp;

  // outputs object to generate to CSS from
  const themes: ThemeStyles[] = [];

  const tokenMaps = generateTokenMapWithContrastCheck(
    brandColor,
    mode,
    themeRamp,
  );

  if ((mode === 'light' || mode === 'auto') && tokenMaps.light) {
    // Light mode theming
    themes.push({
      id: 'light',
      attrs: { 'data-theme': 'light', 'data-custom-theme': uniqueId },
      css: `
html[${CUSTOM_THEME_ATTRIBUTE}="${uniqueId}"][${COLOR_MODE_ATTRIBUTE}="light"][data-theme~="light:light"] {
  /* Branded tokens */
    ${reduceTokenMap(tokenMaps.light, themeRamp)}
}`,
    });
  }

  if ((mode === 'dark' || mode === 'auto') && tokenMaps.dark) {
    // Dark mode theming
    themes.push({
      id: 'dark',
      attrs: { 'data-theme': 'dark', 'data-custom-theme': uniqueId },
      css: `
html[${CUSTOM_THEME_ATTRIBUTE}="${uniqueId}"][${COLOR_MODE_ATTRIBUTE}="dark"][data-theme~="dark:dark"] {
  /* Branded tokens */
    ${reduceTokenMap(tokenMaps.dark, themeRamp)}
}`,
    });
  }

  return themes;
}

export function loadAndAppendCustomThemeCss(
  themeState: Partial<ThemeState> & {
    UNSAFE_themeOptions: ThemeOptionsSchema;
  },
) {
  const themes = getCustomThemeStyles(themeState);

  limitSizeOfCustomStyleElements(CUSTOM_STYLE_ELEMENTS_SIZE_THRESHOLD);
  themes.map((theme) => {
    const styleTag = document.createElement('style');
    document.head.appendChild(styleTag);
    (styleTag as HTMLStyleElement).dataset.theme = theme.attrs['data-theme'];
    (styleTag as HTMLStyleElement).dataset.customTheme =
      theme.attrs['data-custom-theme'];
    styleTag.textContent = theme.css;
  });
}
