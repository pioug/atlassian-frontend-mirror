import { bind, UnbindFn } from 'bind-event-listener';

import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { COLOR_MODE_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from './constants';
import { DataColorModes, ThemeColorModes, ThemeIds } from './theme-config';
import { loadAndAppendThemeCss, loadThemeCss } from './utils/theme-loading';
import { themeObjectToString } from './utils/theme-state-transformer';

export interface ThemeState {
  light: Extract<ThemeIds, 'light' | 'dark' | 'legacy-dark' | 'legacy-light'>;
  dark: Extract<ThemeIds, 'light' | 'dark' | 'legacy-dark' | 'legacy-light'>;
  colorMode: ThemeColorModes;
  shape?: Extract<ThemeIds, 'shape'>;
  spacing?: Extract<ThemeIds, 'spacing'>;
  typography?: Extract<ThemeIds, 'typography'>;
}

// Represents theme state once mounted to the page (auto is hidden from observers)
export interface ActiveThemeState extends ThemeState {
  colorMode: Exclude<ThemeColorModes, 'auto'>;
}

const defaultColorMode: DataColorModes = 'light';

const isMatchMediaAvailable =
  typeof window !== 'undefined' && 'matchMedia' in window;
const darkModeMediaQuery = '(prefers-color-scheme: dark)';
const darkModeMql =
  isMatchMediaAvailable && window.matchMedia(darkModeMediaQuery);

let unbindThemeChangeListener: UnbindFn = noop;

const themeStateDefaults: ThemeState = {
  colorMode: 'auto',
  dark: 'dark',
  light: 'light',
  shape: undefined,
  spacing: undefined,
  typography: undefined,
};

/**
 * Updates the current theme when the system theme changes. Should be bound
 * to an event listener listening on the '(prefers-color-scheme: dark)' query
 * @param e The event representing a change in system theme.
 */
const checkNativeListener = function (e: MediaQueryListEvent) {
  const element = document.documentElement;
  element.setAttribute(COLOR_MODE_ATTRIBUTE, e.matches ? 'dark' : 'light');
};

const getThemePreferences = (themeState: ThemeState): ThemeIds[] => {
  const { colorMode, dark, light, shape, spacing, typography } = themeState;

  const themePreferences: ThemeIds[] =
    colorMode === 'auto' ? [light, dark] : [themeState[colorMode]];

  [shape, spacing, typography].forEach((themeId) => {
    if (themeId) {
      themePreferences.push(themeId);
    }
  });

  if (getBooleanFF('platform.design-system-team.border-checkbox_nyoiu')) {
    themePreferences.push(
      `${
        themePreferences.includes('dark') ? 'dark' : 'light'
      }-new-input-border` as ThemeIds,
    );
  }

  // Load shape and spacing by default, currently behind a feature flag
  if (
    getBooleanFF('platform.design-system-team.space-and-shape-tokens_q5me6')
  ) {
    if (!themePreferences.includes('shape')) {
      themePreferences.push('shape');
    }
    if (!themePreferences.includes('spacing')) {
      themePreferences.push('spacing');
    }
  }

  return [...new Set(themePreferences)];
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
 *
 * @returns A Promise of an unbind function, that can be used to stop listening for changes to system theme.
 *
 * @example
 * ```
 * setGlobalTheme({colorMode: 'auto', light: 'light', dark: 'dark', spacing: 'spacing'});
 * ```
 */
const setGlobalTheme = async ({
  colorMode = themeStateDefaults['colorMode'],
  dark = themeStateDefaults['dark'],
  light = themeStateDefaults['light'],
  shape = themeStateDefaults['shape'],
  spacing = themeStateDefaults['spacing'],
  typography = themeStateDefaults['typography'],
}: Partial<ThemeState> = {}): Promise<UnbindFn> => {
  const themePreferences = getThemePreferences({
    colorMode,
    dark,
    light,
    shape,
    spacing,
    typography,
  });

  await Promise.all(
    themePreferences.map(
      async (themeId) => await loadAndAppendThemeCss(themeId),
    ),
  );

  if (themePreferences.includes('dark')) {
    if (
      // eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
      getBooleanFF('design-system-team.dark-theme-iteration_dk1ln')
    ) {
      await loadAndAppendThemeCss('dark-iteration');
    } else if (
      getBooleanFF(
        'platform.design-system-team.dark-iteration-confluence_e2t22',
      )
    ) {
      await loadAndAppendThemeCss('dark-iteration');
    }
  }

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
  });

  Object.entries(themeAttributes).forEach(([key, value]) => {
    document.documentElement.setAttribute(key, value);
  });

  return unbindThemeChangeListener;
};

export interface ThemeStyles {
  id: ThemeIds;
  attrs: Record<string, string>;
  css: string;
}

/**
 * Takes an object containing theme preferences, and returns an array of objects for use in applying styles to the document head.
 * Only supplies the color themes necessary for initial render, based on the current themeState. I.e. if in light mode, dark mode themes are not returned.
 *
 * @param {Object<string, string>} themeState The themes and color mode that should be applied.
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
 * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
 * @param {string} themeState.shape The shape theme to be applied.
 * @param {string} themeState.spacing The spacing theme to be applied.
 * @param {string} themeState.typography The typography theme to be applied.
 *
 * @returns A Promise of an object array, containing theme IDs, data-attributes to attach to the theme, and the theme CSS.
 * If an error is encountered while loading themes, the themes arrav will be emptv.
 */
export const getThemeStyles = async ({
  colorMode = themeStateDefaults['colorMode'],
  dark = themeStateDefaults['dark'],
  light = themeStateDefaults['light'],
  shape = themeStateDefaults['shape'],
  spacing = themeStateDefaults['spacing'],
  typography = themeStateDefaults['typography'],
}: Partial<ThemeState> = {}): Promise<ThemeStyles[]> => {
  const themePreferences = getThemePreferences({
    colorMode,
    dark,
    light,
    shape,
    spacing,
    typography,
  });

  if (themePreferences.includes('dark')) {
    if (
      // eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
      getBooleanFF('design-system-team.dark-theme-iteration_dk1ln')
    ) {
      themePreferences.push('dark-iteration' as ThemeIds);
    } else if (
      getBooleanFF(
        'platform.design-system-team.dark-iteration-confluence_e2t22',
      )
    ) {
      themePreferences.push('dark-iteration' as ThemeIds);
    }
  }

  const results = await Promise.all(
    themePreferences.map(async (themeId): Promise<ThemeStyles | undefined> => {
      try {
        const css = await loadThemeCss(themeId);

        return {
          id: themeId,
          attrs: { 'data-theme': themeId },
          css,
        };
      } catch {
        // Return an empty string if there's an error loading it.
        return undefined;
      }
    }),
  );

  return results.filter<ThemeStyles>(
    (theme): theme is ThemeStyles => theme !== undefined,
  );
};

/**
 * Server-side rendering utility. Generates the valid HTML attributes for a given theme.
 * Note: this utility does not handle automatic theme switching.
 *
 * @param {Object<string, string>} themeOptions - Theme options object
 * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
 * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
 * @param {string} themeState.spacing The spacing theme to be applied.
 * @param {string} themeState.typography The typography theme to be applied.
 *
 * @returns {Object} Object of HTML attributes to be applied to the document root
 */
export const getThemeHtmlAttrs = ({
  colorMode = themeStateDefaults['colorMode'],
  dark = themeStateDefaults['dark'],
  light = themeStateDefaults['light'],
  shape = themeStateDefaults['shape'],
  spacing = themeStateDefaults['spacing'],
  typography = themeStateDefaults['typography'],
}: Partial<ThemeState> = {}): Record<string, string> => {
  let themePreferences: Partial<ThemeState> = {
    dark,
    light,
    shape,
    spacing,
    typography,
  };

  // Load shape and spacing by default, currently behind a feature flag
  if (
    getBooleanFF('platform.design-system-team.space-and-shape-tokens_q5me6')
  ) {
    themePreferences = {
      dark,
      light,
      shape: 'shape',
      spacing: 'spacing',
      typography,
    };
  }

  const themeAttribute = themeObjectToString(themePreferences);

  return {
    [THEME_DATA_ATTRIBUTE]: themeAttribute,
    [COLOR_MODE_ATTRIBUTE]:
      colorMode === 'auto' ? (defaultColorMode as string) : colorMode,
  };
};

/**
 * Provides a script that, when executed before paint, sets the `data-color-mode` attribute based on the current system theme,
 * to enable SSR support for automatic theme switching, avoid a flash of un-themed content on first paint.
 *
 * @param {string} colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
 *
 * @returns {string} A string to be added to the innerHTML of a script tag in the document head
 */
export const getSSRAutoScript = (colorMode: ThemeState['colorMode']) => {
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

export default setGlobalTheme;
