import { bind, UnbindFn } from 'bind-event-listener';

import noop from '@atlaskit/ds-lib/noop';

import { COLOR_MODE_ATTRIBUTE } from './constants';
import getThemeHtmlAttrs from './get-theme-html-attrs';
import {
  ThemeColorModes,
  ThemeIdsWithOverrides,
  ThemeState,
  themeStateDefaults,
} from './theme-config';
import { isValidBrandHex } from './utils/color-utils';
import { findMissingCustomStyleElements } from './utils/custom-theme-loading-utils';
import { getThemePreferences } from './utils/get-theme-preferences';
import {
  darkModeMediaQuery,
  loadAndAppendThemeCss,
} from './utils/theme-loading';

// Represents theme state once mounted to the page (auto is hidden from observers)
export interface ActiveThemeState extends ThemeState {
  colorMode: Exclude<ThemeColorModes, 'auto'>;
}

const isMatchMediaAvailable =
  typeof window !== 'undefined' && 'matchMedia' in window;

const darkModeMql =
  isMatchMediaAvailable && window.matchMedia(darkModeMediaQuery);

let unbindThemeChangeListener: UnbindFn = noop;

/**
 * Updates the current theme when the system theme changes. Should be bound
 * to an event listener listening on the '(prefers-color-scheme: dark)' query
 * @param e The event representing a change in system theme.
 */
const checkNativeListener = function (e: MediaQueryListEvent) {
  const element = document.documentElement;
  element.setAttribute(COLOR_MODE_ATTRIBUTE, e.matches ? 'dark' : 'light');
};

/**
 * Sets the theme globally at runtime. This updates the `data-theme` and `data-color-mode` attributes on your page's <html> tag.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
 * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
 * @param {string} themeState.shape The shape theme to be applied.
 * @param {string} themeState.spacing The spacing theme to be applied.
 * @param {string} themeState.typography The typography theme to be applied.
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 * @param {function} themeLoader Callback function used to override the default theme loading functionality.
 *
 * @returns A Promise of an unbind function, that can be used to stop listening for changes to system theme.
 *
 * @example
 * ```
 * setGlobalTheme({colorMode: 'auto', light: 'light', dark: 'dark', spacing: 'spacing'});
 * ```
 */
const setGlobalTheme = async (
  {
    colorMode = themeStateDefaults['colorMode'],
    dark = themeStateDefaults['dark'],
    light = themeStateDefaults['light'],
    shape = themeStateDefaults['shape'],
    spacing = themeStateDefaults['spacing'],
    typography = themeStateDefaults['typography'],
    UNSAFE_themeOptions = themeStateDefaults['UNSAFE_themeOptions'],
  }: Partial<ThemeState> = {},
  themeLoader?: (id: ThemeIdsWithOverrides) => void | Promise<void>,
): Promise<UnbindFn> => {
  const themePreferences = getThemePreferences({
    colorMode,
    dark,
    light,
    shape,
    spacing,
    typography,
  });

  const loadingStrategy = themeLoader ? themeLoader : loadAndAppendThemeCss;

  await Promise.all([
    ...themePreferences.map(async (themeId) => await loadingStrategy(themeId)),
    (async () => {
      if (
        !themeLoader &&
        UNSAFE_themeOptions &&
        isValidBrandHex(UNSAFE_themeOptions?.brandColor)
      ) {
        const mode = colorMode || themeStateDefaults['colorMode'];
        const attrOfMissingCustomStyles = findMissingCustomStyleElements(
          UNSAFE_themeOptions,
          mode,
        );

        if (attrOfMissingCustomStyles.length === 0) {
          return false;
        }

        const { loadAndAppendCustomThemeCss } = await import(
          /* webpackChunkName: "@atlaskit-internal_atlassian-custom-theme" */
          './custom-theme'
        );
        await loadAndAppendCustomThemeCss({
          colorMode:
            attrOfMissingCustomStyles.length === 2
              ? 'auto'
              : // only load the missing custom theme styles
                attrOfMissingCustomStyles[0],
          UNSAFE_themeOptions,
        });
      }
    })(),
  ]);

  if (colorMode === 'auto' && darkModeMql) {
    colorMode = darkModeMql.matches ? 'dark' : 'light';
    // Add an event listener for changes to the system theme.
    // If the function exists, it will not be added again.
    unbindThemeChangeListener = bind(darkModeMql, {
      type: 'change',
      listener: checkNativeListener,
    });
  } else {
    unbindThemeChangeListener();
  }

  const themeAttributes = getThemeHtmlAttrs({
    colorMode,
    dark,
    light,
    shape,
    spacing,
    typography,
    UNSAFE_themeOptions: themeLoader ? undefined : UNSAFE_themeOptions,
  });

  Object.entries(themeAttributes).forEach(([key, value]) => {
    document.documentElement.setAttribute(key, value);
  });

  return unbindThemeChangeListener;
};

export default setGlobalTheme;
