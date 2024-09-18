import checkThemePairContrasts, {
	darkResults,
	lightResults,
} from '../../../examples/contrast-checker-utils/utils/check-pair-contrasts';
import rawTokensDarkVisualRefresh from '../../artifacts/tokens-raw/atlassian-dark-brand-refresh';
import rawTokensLightVisualRefresh from '../../artifacts/tokens-raw/atlassian-light-brand-refresh';

import {
	darkViolations,
	darkViolationsVisualRefresh,
	lightViolations,
	lightViolationsVisualRefresh,
} from './contrast-violation-registry';

const getViolations = (
	results: typeof lightResults.fullResults,
): ({ foreground: string; background: string } | undefined)[] =>
	Object.keys(results)
		.map((key) => {
			const pair = results[key];
			if (!pair.isInteraction && !pair.middleLayer && pair.meetsRequiredContrast === 'FAIL') {
				return {
					foreground: pair.foreground,
					background: pair.background,
				};
			}
		})
		.filter(Boolean);

describe('Contrast checking for valid token pairings should pass', () => {
	it('should have the same violations for light mode', () => {
		const newLightViolations = getViolations(lightResults.fullResults);
		expect(newLightViolations).toEqual(lightViolations);
	});
	it('should have the same violations for dark mode', () => {
		const newDarkViolations = getViolations(darkResults.fullResults);
		expect(newDarkViolations).toEqual(darkViolations);
	});
});

describe('Contrast checking for valid token pairings should pass for visual refresh palette', () => {
	it('should have the same violations for light mode', () => {
		const visualRefreshLight = checkThemePairContrasts(
			rawTokensLightVisualRefresh,
			'light',
		).fullResults;
		const newLightViolations = getViolations(visualRefreshLight);
		expect(newLightViolations).toEqual(lightViolationsVisualRefresh);
	});
	it('should have the same violations for dark mode', () => {
		const visualRefreshDark = checkThemePairContrasts(
			rawTokensDarkVisualRefresh,
			'dark',
		).fullResults;
		const newDarkViolations = getViolations(visualRefreshDark);
		expect(newDarkViolations).toEqual(darkViolationsVisualRefresh);
	});
});
