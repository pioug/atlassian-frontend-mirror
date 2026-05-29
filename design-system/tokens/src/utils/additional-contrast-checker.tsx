import tokenValuesDark from '../artifacts/atlassian-dark-token-value-for-contrast-check';
import tokenValuesLight from '../artifacts/atlassian-light-token-value-for-contrast-check';
import type tokens from '../artifacts/token-names';

import { additionalChecks } from './custom-theme-token-contrast-check';
import { getContrastRatio } from './get-contrast-ratio';

type Token = keyof typeof tokens;

const getColorFromTokenRaw = (tokenName: string, mode: 'light' | 'dark'): string => {
	return (
		mode === 'light'
			? tokenValuesLight[tokenName as keyof typeof tokenValuesLight]
			: tokenValuesDark[tokenName as keyof typeof tokenValuesDark]
	) as string;
};

export const additionalContrastChecker = ({
	customThemeTokenMap,
	mode,
	themeRamp,
}: {
	customThemeTokenMap: { [key: string]: number | string };
	mode: 'light' | 'dark';
	themeRamp: string[];
}): { [key: string]: number } => {
	const updatedCustomThemeTokenMap: { [key: string]: number } = {};

	const brandTokens = Object.keys(customThemeTokenMap);
	additionalChecks.forEach((pairing) => {
		const { backgroundLight, backgroundDark, foreground, desiredContrast, updatedTokens } = pairing;
		const background = mode === 'light' ? backgroundLight : backgroundDark;

		const foregroundTokenValue = customThemeTokenMap[foreground];
		const backgroundTokenValue = customThemeTokenMap[background];

		const foregroundColor = brandTokens.includes(foreground)
			? typeof foregroundTokenValue === 'string'
				? foregroundTokenValue
				: themeRamp[foregroundTokenValue]
			: getColorFromTokenRaw(foreground, mode);
		const backgroundColor = brandTokens.includes(background)
			? typeof backgroundTokenValue === 'string'
				? backgroundTokenValue
				: themeRamp[backgroundTokenValue]
			: getColorFromTokenRaw(background, mode);
		const contrast = getContrastRatio(foregroundColor as string, backgroundColor as string);
		if (contrast <= desiredContrast) {
			updatedTokens.forEach((token: Token) => {
				const rampValue = customThemeTokenMap[token];
				if (typeof rampValue === 'number') {
					updatedCustomThemeTokenMap[token] = mode === 'light' ? rampValue + 1 : rampValue - 1;
				}
			});
		}
	});
	return updatedCustomThemeTokenMap;
};
