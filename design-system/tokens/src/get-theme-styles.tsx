import {
  ThemeIdsWithOverrides,
  themeIdsWithOverrides,
  ThemeState,
  themeStateDefaults,
} from './theme-config';
import { isValidBrandHex } from './utils/color-utils';
import { getThemePreferences } from './utils/get-theme-preferences';
import { loadThemeCss } from './utils/theme-loading';

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
const getThemeStyles = async (
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

export default getThemeStyles;
