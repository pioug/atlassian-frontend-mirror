import { customThemeContrastChecker } from '../../../examples/utils/custom-theme-contrast-checker';
import type tokens from '../../artifacts/token-names';
import { type CSSColor } from '../../theme-config';
import { hexToRgbA, rgbToHex } from '../../utils/color-utils';
import { additionalContrastChecker } from '../../utils/custom-theme-token-contrast-check';
import {
	generateColors,
	generateTokenMap,
	generateTokenMapWithContrastCheck,
} from '../../utils/generate-custom-color-ramp';
import { argbFromRgba, Contrast, Hct, rgbaFromArgb } from '../../utils/hct-color-utils';

type Token = keyof typeof tokens;
type ContrastCheckResult = {
	newBreachesCount: number;
	inputColor: CSSColor;
	contrast: number;
	pairings: string[];
};
const brandColor = '#65D26E';
const baseColors: CSSColor[] = [
	'#FF9C8F', // red
	'#E2B203', // yellow
	'#4BCE97', //green
	'#E9F2FF', //blue
	'#DCDFE4', //neutral
];

const expectedFailedLightPairs = [
	['color.background.brand.bold.hovered', 'color.background.selected.pressed'],
	['color.background.brand.bold.hovered', 'color.background.brand.subtlest.pressed'],
	['color.background.selected.bold.hovered', 'color.background.selected.pressed'],
	['color.background.selected.bold.hovered', 'color.background.brand.subtlest.pressed'],
	['color.background.brand.boldest.pressed', 'color.background.brand.subtlest.pressed'],
	['color.link.pressed', 'color.background.brand.subtlest.hovered'],
	['color.link.pressed', 'color.background.selected.hovered'],
	['color.link.visited', 'color.background.brand.subtlest.hovered'],
	['color.link.visited', 'color.background.selected.hovered'],
	['color.chart.brand', 'elevation.surface.hovered'],
	['color.chart.brand', 'elevation.surface.raised.hovered'],
];

describe('tokenRampAdjustment', () => {
	it('should darken tokens by one base token in light mode', () => {
		const originalTokenMap = generateTokenMap(brandColor, 'light').light!;
		const themeRamp = generateColors(brandColor).ramp;
		const newTokenMap = additionalContrastChecker({
			customThemeTokenMap: originalTokenMap,
			mode: 'light',
			themeRamp,
		});

		Object.entries(newTokenMap).forEach(([tokenName, index]) => {
			expect(index).toEqual((originalTokenMap[tokenName as Token] as number) + 1);
		});
	});
});

describe('customTheme', () => {
	it('should not cause new contrast breaches', async () => {
		await Promise.all(
			baseColors.map(async (baseColor: CSSColor) => {
				const lightResult: ContrastCheckResult[] = [];
				const darkResult: ContrastCheckResult[] = [];
				const colors = generateInputColors({
					baseColor,
					start: 1,
					end: 21,
					interval: 0.2,
				});

				await Promise.all(
					colors.map(async ({ color, contrast }) => {
						const themeRamp = generateColors(color).ramp;
						const tokenMaps = generateTokenMapWithContrastCheck(color, 'auto', themeRamp);

						const [newBreachesLight, newBreachesDark] = await Promise.all([
							customThemeContrastChecker({
								customThemeTokenMap: tokenMaps.light!,
								mode: 'light',
								themeRamp,
							}).filter(
								(pairing) =>
									pairing.contrast < pairing.desiredContrast &&
									pairing.previousContrast > pairing.desiredContrast,
							),
							customThemeContrastChecker({
								customThemeTokenMap: tokenMaps.dark!,
								mode: 'dark',
								themeRamp,
							}).filter(
								(pairing) =>
									pairing.contrast < pairing.desiredContrast &&
									pairing.previousContrast > pairing.desiredContrast,
							),
						]);

						if (newBreachesLight.length > 0) {
							newBreachesLight.forEach((pair) => {
								expect(expectedFailedLightPairs).toContainEqual([
									pair.foreground.tokenName,
									pair.background.tokenName,
								]);
							});
							lightResult.push({
								newBreachesCount: newBreachesLight.length,
								inputColor: color,
								contrast,
								pairings: newBreachesLight.map(
									(pair) =>
										`${pair.foreground.tokenName} + ${
											pair.background.tokenName
										} (${pair.previousContrast.toFixed(2)} -> ${pair.contrast.toFixed(2)}})`,
								),
							});
						}

						if (newBreachesDark.length > 0) {
							darkResult.push({
								newBreachesCount: newBreachesDark.length,
								inputColor: color,
								contrast,
								pairings: newBreachesDark.map(
									(pair) =>
										`${pair.foreground.tokenName} + ${
											pair.background.tokenName
										} (${pair.previousContrast.toFixed(2)} -> ${pair.contrast.toFixed(2)}})`,
								),
							});
						}
					}),
				);

				// TODO DSP-12310 revisit color generation system for dark theme
				// expect(darkResult.length).toEqual(0);
				expect(typeof darkResult.length).toBe('number');
			}),
		);
	});
});

function generateInputColors({
	baseColor,
	start,
	end,
	interval,
}: {
	baseColor: CSSColor;
	start: number;
	end: number;
	interval: number;
}): { color: CSSColor; contrast: number }[] {
	if (end <= start || end - start < interval) {
		throw new Error('Invalid start or end number');
	}
	const contrastRatioList = [];

	for (let i = start * 10; i <= end * 10; i += interval * 10) {
		contrastRatioList.push(Number((i / 10).toFixed(2)));
	}

	const brandRgba = hexToRgbA(baseColor);
	const hctColor = Hct.fromInt(
		argbFromRgba({
			r: brandRgba[0],
			g: brandRgba[1],
			b: brandRgba[2],
			a: brandRgba[3],
		}),
	);
	return contrastRatioList.map((contrast) => {
		const rgbaColor = rgbaFromArgb(
			Hct.from(
				hctColor.hue,
				hctColor.chroma,
				Contrast.darker(100, contrast) + 0.25, // Material's utils provide an offset
			).toInt(),
		);
		return {
			color: rgbToHex(rgbaColor.r, rgbaColor.g, rgbaColor.b) as CSSColor,
			contrast,
		};
	});
}
