import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { type ThemeState } from '../../theme-state';
import { getThemeOverridePreferences } from '../../utils/get-theme-override-preferences';

const defaultThemeState: ThemeState = {
	colorMode: 'auto',
	contrastMode: 'no-preference',
	dark: 'dark',
	light: 'light',
	spacing: 'spacing',
	typography: 'typography',
};

describe('getThemeOverridePreferences', () => {
	it('returns no finesse overrides when the gate is off', () => {
		failGate('platform-dst-tokens-finesse');

		expect(getThemeOverridePreferences(defaultThemeState)).toEqual([]);
	});

	it('returns the selected color and typography overrides when the gate is on', () => {
		passGate('platform-dst-tokens-finesse');

		expect(getThemeOverridePreferences(defaultThemeState)).toEqual([
			'light-finesse',
			'dark-finesse',
			'typography-finesse',
		]);
	});

	it('returns only the active color mode and typography overrides', () => {
		passGate('platform-dst-tokens-finesse');

		expect(
			getThemeOverridePreferences({
				...defaultThemeState,
				colorMode: 'light',
			}),
		).toEqual(['light-finesse', 'typography-finesse']);
	});

	it('does not apply finesse color overrides to future themes', () => {
		passGate('platform-dst-tokens-finesse');

		expect(
			getThemeOverridePreferences({
				...defaultThemeState,
				colorMode: 'auto',
				light: 'light-future',
				dark: 'dark-future',
			}),
		).toEqual(['typography-finesse']);
	});

	it('returns increased contrast overrides only when both gates and contrast are enabled', () => {
		passGate('platform-dst-tokens-finesse');
		passGate('platform_increased-contrast-themes');

		expect(
			getThemeOverridePreferences({
				...defaultThemeState,
				contrastMode: 'auto',
			}),
		).toEqual([
			'light-finesse',
			'dark-finesse',
			'typography-finesse',
			'light-increased-contrast-finesse',
			'dark-increased-contrast-finesse',
		]);
	});

	it('does not emit duplicate override IDs', () => {
		passGate('platform-dst-tokens-finesse');

		expect(
			getThemeOverridePreferences({
				...defaultThemeState,
				dark: 'light',
			}),
		).toEqual(['light-finesse', 'typography-finesse']);
	});
});
