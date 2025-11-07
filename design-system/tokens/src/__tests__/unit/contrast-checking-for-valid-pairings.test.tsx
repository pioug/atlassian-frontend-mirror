import checkThemePairContrasts, {
	type lightResults,
} from '../../../examples/contrast-checker-utils/utils/check-pair-contrasts';
import rawTokensDark from '../../artifacts/tokens-raw/atlassian-dark';
import rawTokensLight from '../../artifacts/tokens-raw/atlassian-light';

import {
	darkViolationsVisualRefresh,
	lightViolationsVisualRefresh,
} from './contrast-violation-registry.mock';

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
		const visualRefreshLight = checkThemePairContrasts(rawTokensLight, 'light').fullResults;
		const newLightViolations = getViolations(visualRefreshLight);
		expect(newLightViolations).toEqual(lightViolationsVisualRefresh);
	});
	it('should have the same violations for dark mode', () => {
		const visualRefreshDark = checkThemePairContrasts(rawTokensDark, 'dark').fullResults;
		const newDarkViolations = getViolations(visualRefreshDark);
		expect(newDarkViolations).toEqual(darkViolationsVisualRefresh);
	});
});
