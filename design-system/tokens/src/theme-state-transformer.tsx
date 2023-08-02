import {
  ThemeColorModes,
  ThemeIds,
  themeIds,
  ThemeState,
} from './theme-config';

const themeKinds = ['light', 'dark', 'spacing', 'typography', 'shape'] as const;
type ThemeKind = (typeof themeKinds)[number];

const isThemeKind = (themeKind: string): themeKind is ThemeKind => {
  return themeKinds.find((kind) => kind === themeKind) !== undefined;
};

const isThemeIds = (themeId: string): themeId is ThemeIds => {
  return themeIds.find((id) => id === themeId) !== undefined;
};

const isColorMode = (modeId: string): modeId is ThemeColorModes => {
  return ['light', 'dark', 'auto'].includes(modeId);
};
/**
 * Converts a string that is formatted for the `data-theme` HTML attribute
 * to an object that can be passed to `setGlobalTheme`.
 *
 * @param {string} themes The themes that should be applied.
 *
 * @example
 * ```
 * themeStringToObject('dark:dark light:legacy-light spacing:spacing');
 * // returns { dark: 'dark', light: 'legacy-light', spacing: 'spacing' }
 * ```
 */
export const themeStringToObject = (
  themeState: string,
): Partial<ThemeState> => {
  return themeState
    .split(' ')
    .map((theme) => theme.split(':'))
    .reduce<Partial<ThemeState>>((themeObject, [kind, id]) => {
      if (kind === 'colorMode' && isColorMode(id)) {
        themeObject[kind] = id;
      }

      if (isThemeKind(kind) && isThemeIds(id)) {
        // @ts-expect-error FIXME - this is a valid ts error
        themeObject[kind] = id;
      }

      return themeObject;
    }, {});
};

/**
 * Converts a theme object to a string formatted for the `data-theme` HTML attribute.
 *
 * @param {object} themes The themes that should be applied.
 *
 * @example
 * ```
 * themeObjectToString({ dark: 'dark', light: 'legacy-light', spacing: 'spacing' });
 * // returns 'dark:dark light:legacy-light spacing:spacing'
 * ```
 */
export const themeObjectToString = (
  themeState: Partial<ThemeState>,
): string => {
  return Object.entries(themeState).reduce<string>(
    (themeString, [kind, id]) =>
      (kind === 'colorMode' || isThemeKind(kind)) &&
      typeof id === 'string' &&
      (isThemeIds(id) || isColorMode(id))
        ? themeString + `${themeString ? ' ' : ''}` + `${kind}:${id}`
        : themeString,
    '',
  );
};
