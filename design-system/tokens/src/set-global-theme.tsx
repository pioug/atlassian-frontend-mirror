import { type UnbindFn } from 'bind-event-listener';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
  type ThemeIdsWithOverrides,
  type ThemeState,
  themeStateDefaults,
} from './theme-config';
import { isValidBrandHex } from './utils/color-utils';
import configurePage from './utils/configure-page';
import { findMissingCustomStyleElements } from './utils/custom-theme-loading-utils';
import {
  getThemeOverridePreferences,
  getThemePreferences,
} from './utils/get-theme-preferences';
import { loadAndAppendThemeCss } from './utils/theme-loading';

/**
 * Sets the theme globally at runtime. This updates the `data-theme` and `data-color-mode` attributes on your page's <html> tag.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.contrastMode The contrast mode theme to be applied. If set to `auto`, the theme applied will be determined by the OS setting.set to `auto`, the theme applied will be determined by the OS setting.
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
    contrastMode = themeStateDefaults['contrastMode'],
    dark = themeStateDefaults['dark'],
    light = themeStateDefaults['light'],
    shape = themeStateDefaults['shape'],
    spacing = themeStateDefaults['spacing'],
    typography = themeStateDefaults['typography'],
    UNSAFE_themeOptions = themeStateDefaults['UNSAFE_themeOptions'],
  }: Partial<ThemeState> = {},
  themeLoader?: (id: ThemeIdsWithOverrides) => void | Promise<void>,
): Promise<UnbindFn> => {
  // CLEANUP: Remove. This blocks application of increased contrast themes
  // without the feature flag enabled.
  if (!getBooleanFF('platform.design-system-team.increased-contrast-themes')) {
    if (light === 'light-increased-contrast') {
      light = 'light';
    }
    if (dark === 'dark-increased-contrast') {
      dark = 'dark';
    }
  }

  const themeState = {
    colorMode,
    contrastMode,
    dark,
    light,
    shape,
    spacing,
    typography,
    UNSAFE_themeOptions: themeLoader ? undefined : UNSAFE_themeOptions,
  };

  // Determine what to load and loading strategy
  let themePreferences = getThemePreferences(themeState);

  const loadingStrategy = themeLoader ? themeLoader : loadAndAppendThemeCss;

  // Load standard themes
  const loadingTasks = themePreferences.map(
    async (themeId) => await loadingStrategy(themeId),
  );

  // Load custom themes if needed
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
    if (attrOfMissingCustomStyles.length > 0) {
      // Load custom theme styles
      loadingTasks.push(
        (async () => {
          const { loadAndAppendCustomThemeCss } = await import(
            /* webpackChunkName: "@atlaskit-internal_atlassian-custom-theme" */
            './custom-theme'
          );
          loadAndAppendCustomThemeCss({
            colorMode:
              attrOfMissingCustomStyles.length === 2
                ? 'auto'
                : // only load the missing custom theme styles
                  attrOfMissingCustomStyles[0],
            UNSAFE_themeOptions,
          });
        })(),
      );
    }
  }
  await Promise.all(loadingTasks);

  // Load override themes after standard themes
  const themeOverridePreferences = getThemeOverridePreferences(themeState);
  for (const themeId of themeOverridePreferences) {
    await loadingStrategy(themeId);
  }

  const autoUnbind = configurePage(themeState);
  return autoUnbind;
};

export default setGlobalTheme;
