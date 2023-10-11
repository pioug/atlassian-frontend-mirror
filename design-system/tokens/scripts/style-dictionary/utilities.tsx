import { Dictionary, TransformedToken } from 'style-dictionary';

import themeConfig, {
  ThemeIds,
  ThemeOverrideIds,
  ThemeOverrides,
  Themes,
} from '../../src/theme-config';

/**
 * Safely retrieves token values, accounting for the possibility for
 * token references/aliases
 */
export function getValue(dictionary: Dictionary, token: TransformedToken) {
  return dictionary.usesReference(token)
    ? dictionary.getReferences(token)[0].value
    : token.value;
}

/**
 * Gets Theme ID based on file name
 */
export function themeNameToId(
  themeName: Themes | ThemeOverrides,
): ThemeIds | ThemeOverrideIds {
  const themeId = Object.entries(themeConfig).find(
    ([name]) => name === themeName,
  )?.[1].id;

  if (!themeId) {
    throw Error(`No matching theme ID found for '${themeName}'`);
  }

  return themeId;
}
