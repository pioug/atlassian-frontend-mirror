import themeImportMap from '../artifacts/theme-import-map';
import { type ThemeIdsWithOverrides } from '../theme-config';

export const loadThemeCss = async (themeId: ThemeIdsWithOverrides): Promise<string> => {
	const { default: themeCss } = await themeImportMap[themeId]();

	return themeCss;
};
