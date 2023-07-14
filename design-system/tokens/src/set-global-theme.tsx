import { bind, UnbindFn } from 'bind-event-listener';

import noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
  COLOR_MODE_ATTRIBUTE,
  CUSTOM_THEME_ATTRIBUTE,
  THEME_DATA_ATTRIBUTE,
} from './constants';
import { CustomBrandSchema } from './custom-theme';
import {
  DataColorModes,
  ThemeColorModes,
  ThemeIds,
  ThemeIdsWithOverrides,
  themeIdsWithOverrides,
} from './theme-config';
import { isValidBrandHex } from './utils/color-utils';
import { findMissingCustomStyleElements } from './utils/custom-theme-loading-utils';
import { hash } from './utils/hash';
import { loadAndAppendThemeCss, loadThemeCss } from './utils/theme-loading';
import { themeObjectToString } from './utils/theme-state-transformer';

export interface ThemeState {
  light: Extract<ThemeIds, 'light' | 'dark' | 'legacy-dark' | 'legacy-light'>;
  dark: Extract<ThemeIds, 'light' | 'dark' | 'legacy-dark' | 'legacy-light'>;
  colorMode: ThemeColorModes;
  shape?: Extract<ThemeIds, 'shape'>;
  spacing?: Extract<ThemeIds, 'spacing'>;
  typography?: Extract<ThemeIds, 'typography'>;
  UNSAFE_themeOptions?: CustomBrandSchema;
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

export const themeStateDefaults: ThemeState = {
  colorMode: 'auto',
  dark: 'dark',
  light: 'light',
  shape: undefined,
  spacing: undefined,
  typography: undefined,
  UNSAFE_themeOptions: undefined,
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

const getThemePreferences = (
  themeState: ThemeState,
): ThemeIdsWithOverrides[] => {
  const { colorMode, dark, light, shape, spacing, typography } = themeState;

  const themePreferences: ThemeIdsWithOverrides[] =
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
      }-new-input-border`,
    );
  }

  // Load shape and spacing by default, currently behind a feature flag
  if (
    getBooleanFF('platform.design-system-team.space-and-shape-tokens_q5me6')
  ) {
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

export interface ThemeStyles {
  id: ThemeIdsWithOverrides;
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
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
 *
 * @returns A Promise of an object array, containing theme IDs, data-attributes to attach to the theme, and the theme CSS.
 * If an error is encountered while loading themes, the themes array will be empty.
 */
export const getThemeStyles = async (
  preferences?: Partial<ThemeState> | 'all',
): Promise<ThemeStyles[]> => {
  let themePreferences: ThemeIdsWithOverrides[] | typeof themeIdsWithOverrides;

  if (preferences === 'all') {
    themePreferences = themeIdsWithOverrides;
  } else {
    themePreferences = getThemePreferences({
      colorMode: preferences?.colorMode || themeStateDefaults['colorMode'],
      dark: preferences?.dark || themeStateDefaults['dark'],
      light: preferences?.light || themeStateDefaults['light'],
      shape: preferences?.shape || themeStateDefaults['shape'],
      spacing: preferences?.spacing || themeStateDefaults['spacing'],
      typography: preferences?.typography || themeStateDefaults['typography'],
    });
  }

  const results = await Promise.all([
    ...themePreferences.map(
      async (themeId): Promise<ThemeStyles | undefined> => {
        try {
          const css = await loadThemeCss(themeId);

          return {
            id: themeId,
            attrs: { 'data-theme': themeId },
            css,
          };
        } catch {
          // Return undefined if there's an error loading it, will be filtered out later.
          return undefined;
        }
      },
    ),
    // Add custom themes if they're present
    (async () => {
      if (
        preferences !== 'all' &&
        preferences?.UNSAFE_themeOptions &&
        isValidBrandHex(preferences?.UNSAFE_themeOptions?.brandColor)
      ) {
        try {
          const { getCustomThemeStyles } = await import(
            /* webpackChunkName: "@atlaskit-internal_atlassian-custom-theme" */
            './custom-theme'
          );

          const customThemeStyles = await getCustomThemeStyles({
            colorMode:
              preferences?.colorMode || themeStateDefaults['colorMode'],
            UNSAFE_themeOptions: preferences?.UNSAFE_themeOptions,
          });

          return customThemeStyles;
        } catch {
          // Return undefined if there's an error loading it, will be filtered out later.
          return undefined;
        }
      }
    })(),
  ]);

  return results
    .flat()
    .filter<ThemeStyles>((theme): theme is ThemeStyles => theme !== undefined);
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
 * @param {Object} themeState.UNSAFE_themeOptions The custom branding options to be used for custom theme generation
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
  UNSAFE_themeOptions = themeStateDefaults['UNSAFE_themeOptions'],
}: Partial<ThemeState> = {}): Record<string, string> => {
  let themePreferences: Partial<ThemeState> = {
    dark,
    light,
    shape,
    spacing,
    typography,
  };

  // Load spacing by default, currently behind a feature flag
  if (
    getBooleanFF('platform.design-system-team.space-and-shape-tokens_q5me6')
  ) {
    themePreferences = {
      dark,
      light,
      shape,
      spacing: 'spacing',
      typography,
    };
  }

  const themeAttribute = themeObjectToString(themePreferences);

  const result: Record<string, string> = {
    [THEME_DATA_ATTRIBUTE]: themeAttribute,
    [COLOR_MODE_ATTRIBUTE]:
      colorMode === 'auto' ? (defaultColorMode as string) : colorMode,
  };

  if (UNSAFE_themeOptions && isValidBrandHex(UNSAFE_themeOptions.brandColor)) {
    const optionString = JSON.stringify(UNSAFE_themeOptions);
    const uniqueId = hash(optionString);
    result[CUSTOM_THEME_ATTRIBUTE] = uniqueId;
  }

  return result;
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
