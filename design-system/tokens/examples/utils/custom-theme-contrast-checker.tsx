import { type ActiveTokens } from '@atlaskit/tokens';
import { dark as rawTokensDark, light as rawTokensLight } from '@atlaskit/tokens/tokens-raw';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import generatedPairs from '../../src/artifacts/generated-pairs';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { getContrastRatio } from '../../src/utils/color-utils';

export interface CustomThemeContrastCheckResult {
	contrast: number;
	desiredContrast: number;
	previousContrast: number;
	foreground: {
		tokenName: ActiveTokens;
		color: string;
	};
	background: {
		tokenName: ActiveTokens;
		color: string;
	};
	updatedTokens?: ActiveTokens[];
}

const getColorFromTokenRaw = (tokenName: string, mode: 'light' | 'dark'): string => {
	return (mode === 'light' ? rawTokensLight : rawTokensDark).find(
		(rawToken) => rawToken.cleanName === tokenName,
	)?.value as string;
};

export const customThemeContrastChecker = ({
	customThemeTokenMap,
	mode,
	themeRamp,
}: {
	customThemeTokenMap: { [key: string]: number | string };
	mode: 'light' | 'dark';
	themeRamp: string[];
}): CustomThemeContrastCheckResult[] => {
	const brandTokens = Object.keys(customThemeTokenMap);

	const contrastCheckFailedPairings: CustomThemeContrastCheckResult[] = [];
	generatedPairs.forEach((pairing) => {
		const { background, foreground, desiredContrast } = pairing;
		if (!brandTokens.includes(foreground) && !brandTokens.includes(background)) {
			return;
		}

		const rawForegroundColor = getColorFromTokenRaw(foreground, mode);
		const foregroundColor =
			typeof customThemeTokenMap[foreground] === 'number'
				? themeRamp[customThemeTokenMap[foreground] as number]
				: (customThemeTokenMap[foreground] as string);
		const rawBackgroundColor = getColorFromTokenRaw(background, mode);
		const backgroundColor =
			typeof customThemeTokenMap[background] === 'number'
				? themeRamp[customThemeTokenMap[background] as number]
				: (customThemeTokenMap[background] as string);

		if (!(foregroundColor || rawForegroundColor) || !(backgroundColor || rawBackgroundColor)) {
			return;
		}
		const contrast = getContrastRatio(
			foregroundColor || rawForegroundColor,
			backgroundColor || rawBackgroundColor,
		);

		if (contrast >= desiredContrast) {
			return;
		}

		contrastCheckFailedPairings.push({
			foreground: {
				tokenName: foreground as ActiveTokens,
				color: foregroundColor || rawForegroundColor,
			},
			background: {
				tokenName: background as ActiveTokens,
				color: backgroundColor || rawBackgroundColor,
			},
			contrast,
			desiredContrast,
			previousContrast: getContrastRatio(
				rawForegroundColor as string,
				rawBackgroundColor as string,
			),
		});
	});

	return contrastCheckFailedPairings;
};
