import type tokens from '../artifacts/token-names';
import { type CSSColor, type ThemeColorModes } from '../theme-config';

import { additionalContrastChecker } from './additional-contrast-checker';
import { generateColors } from './generate-colors';
import { generateTokenMap } from './generate-token-map';

type Token = keyof typeof tokens;
type TokenMap = { [key in Token]?: number | string };
type Mode = 'light' | 'dark';

export const generateTokenMapWithContrastCheck = (
	brandColor: CSSColor,
	mode: ThemeColorModes,
	themeRamp?: CSSColor[],
): { [mode in Mode]?: TokenMap } => {
	const colors = themeRamp || generateColors(brandColor).ramp;
	const tokenMaps = generateTokenMap(brandColor, mode, colors);

	const result: { [mode in Mode]?: TokenMap } = {};
	Object.entries(tokenMaps).forEach(([mode, map]) => {
		if (mode === 'light' || mode === 'dark') {
			result[mode] = {
				...map,
				...additionalContrastChecker({
					customThemeTokenMap: map,
					mode,
					themeRamp: colors,
				}),
			};
		}
	});
	return result;
};
