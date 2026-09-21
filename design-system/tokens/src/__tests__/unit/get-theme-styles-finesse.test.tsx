import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import getThemeStyles, { type ThemeStyles } from '../../get-theme-styles';

function getThemeData(themes: ThemeStyles[]) {
	return themes.reduce((acc: Omit<ThemeStyles, 'css'>[], { css: _css, ...rest }) => {
		acc.push({ ...rest });
		return acc;
	}, []);
}

describe('getThemeStyles finesse overrides', () => {
	it('includes only state-relevant finesse overrides when the gate is on', async () => {
		passGate('platform-dst-tokens-finesse');
		failGate('platform_increased-contrast-themes');

		const results = await getThemeStyles({ contrastMode: 'no-preference' });
		const allResults = await getThemeStyles('all');

		expect(getThemeData(results)).toEqual([
			{ id: 'light', attrs: { 'data-theme': 'light' } },
			{ id: 'dark', attrs: { 'data-theme': 'dark' } },
			{ id: 'shape', attrs: { 'data-theme': 'shape' } },
			{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
			{ id: 'typography', attrs: { 'data-theme': 'typography' } },
			{ id: 'motion', attrs: { 'data-theme': 'motion' } },
			{ id: 'light-finesse', attrs: { 'data-theme': 'light-finesse' } },
			{ id: 'dark-finesse', attrs: { 'data-theme': 'dark-finesse' } },
			{ id: 'typography-finesse', attrs: { 'data-theme': 'typography-finesse' } },
		]);
		expect(getThemeData(allResults)).toEqual([
			{ id: 'light', attrs: { 'data-theme': 'light' } },
			{ id: 'light-future', attrs: { 'data-theme': 'light-future' } },
			{ id: 'UNSAFE-test-light', attrs: { 'data-theme': 'UNSAFE-test-light' } },
			{ id: 'dark', attrs: { 'data-theme': 'dark' } },
			{ id: 'UNSAFE-test-dark', attrs: { 'data-theme': 'UNSAFE-test-dark' } },
			{ id: 'dark-future', attrs: { 'data-theme': 'dark-future' } },
			{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
			{ id: 'shape', attrs: { 'data-theme': 'shape' } },
			{ id: 'typography', attrs: { 'data-theme': 'typography' } },
			{ id: 'motion', attrs: { 'data-theme': 'motion' } },
			{ id: 'light-finesse', attrs: { 'data-theme': 'light-finesse' } },
			{ id: 'dark-finesse', attrs: { 'data-theme': 'dark-finesse' } },
			{ id: 'typography-finesse', attrs: { 'data-theme': 'typography-finesse' } },
		]);

		const testLight = allResults.find(({ id }) => id === 'UNSAFE-test-light');
		expect(testLight?.css).toContain('--ds-background-brand-bold: #964AC0');
		expect(testLight?.css).toContain('--ds-background-selected-bold: #227D9B');
		const lightFinesse = results.find(({ id }) => id === 'light-finesse');
		expect(lightFinesse?.css).not.toContain('--ds-border-focused');
		expect(lightFinesse?.css).toContain('--ds-background-selected: #0515240F');
		expect(lightFinesse?.css).toContain('--ds-background-neutral-subtle-hovered: #17171708');
		expect(lightFinesse?.css).toContain('--ds-background-neutral-subtle-pressed: #0515240F');

		const darkFinesse = results.find(({ id }) => id === 'dark-finesse');
		expect(darkFinesse?.css).toContain('--ds-background-neutral-subtle-hovered: #BDBDBD0A');
		expect(darkFinesse?.css).toContain('--ds-background-neutral-subtle-pressed: #CECED912');

		const typographyFinesse = results.find(({ id }) => id === 'typography-finesse');
		expect(typographyFinesse?.css).toContain('--ds-font-heading-medium: normal 500');
		expect(typographyFinesse?.css).toContain('--ds-font-heading-small: normal 500');
		expect(typographyFinesse?.css).toContain('--ds-font-heading-xsmall: normal 500');
		expect(typographyFinesse?.css).toContain('--ds-font-heading-xxsmall: normal 500');
		expect(typographyFinesse?.css).not.toContain('--ds-font-heading-large');
	});

	it('excludes all finesse overrides when the gate is off', async () => {
		failGate('platform-dst-tokens-finesse');
		failGate('platform_increased-contrast-themes');

		const results = await getThemeStyles({ contrastMode: 'no-preference' });
		const allResults = await getThemeStyles('all');

		expect(getThemeData(results)).toEqual([
			{ id: 'light', attrs: { 'data-theme': 'light' } },
			{ id: 'dark', attrs: { 'data-theme': 'dark' } },
			{ id: 'shape', attrs: { 'data-theme': 'shape' } },
			{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
			{ id: 'typography', attrs: { 'data-theme': 'typography' } },
			{ id: 'motion', attrs: { 'data-theme': 'motion' } },
		]);
		expect(getThemeData(allResults)).toEqual([
			{ id: 'light', attrs: { 'data-theme': 'light' } },
			{ id: 'light-future', attrs: { 'data-theme': 'light-future' } },
			{ id: 'UNSAFE-test-light', attrs: { 'data-theme': 'UNSAFE-test-light' } },
			{ id: 'dark', attrs: { 'data-theme': 'dark' } },
			{ id: 'UNSAFE-test-dark', attrs: { 'data-theme': 'UNSAFE-test-dark' } },
			{ id: 'dark-future', attrs: { 'data-theme': 'dark-future' } },
			{ id: 'spacing', attrs: { 'data-theme': 'spacing' } },
			{ id: 'shape', attrs: { 'data-theme': 'shape' } },
			{ id: 'typography', attrs: { 'data-theme': 'typography' } },
			{ id: 'motion', attrs: { 'data-theme': 'motion' } },
		]);
	});
});
