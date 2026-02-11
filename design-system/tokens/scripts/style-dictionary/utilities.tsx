import { type Dictionary, type TransformedToken } from 'style-dictionary';

import themeConfig, {
	type ThemeIds,
	type ThemeOverrideIds,
	type ThemeOverrides,
	type Themes,
} from '../../src/theme-config';

/**
 * Safely retrieves token values, accounting for the possibility for
 * token references/aliases
 */
export function getValue(dictionary: Dictionary, token: TransformedToken): any {
	return dictionary.usesReference(token) ? dictionary.getReferences(token)[0].value : token.value;
}

/**
 * Gets Theme ID based on file name
 */
export function themeNameToId(themeName: Themes | ThemeOverrides): ThemeIds | ThemeOverrideIds {
	const themeId = Object.entries(themeConfig).find(([name]) => name === themeName)?.[1].id;

	if (!themeId) {
		throw Error(`No matching theme ID found for '${themeName}'`);
	}

	return themeId;
}
