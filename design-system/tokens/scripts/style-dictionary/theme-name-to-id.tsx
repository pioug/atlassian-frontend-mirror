import themeConfig, { type ThemeIds, type ThemeOverrideIds, type ThemeOverrides, type Themes } from '../../src/theme-config';

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
