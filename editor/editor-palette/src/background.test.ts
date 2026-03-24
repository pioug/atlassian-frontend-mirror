import { hexToEditorBackgroundPaletteColor, hexToEditorBackgroundPaletteRawValue } from './index';

describe('hexToEditorBackgroundPaletteColor', () => {
	test.each([
		['#DEEBFF', 'var(--ds-background-accent-blue-subtlest)'],
		['#B3D4FF', 'var(--ds-background-accent-blue-subtler)'],
		['#4C9AFF', 'var(--ds-background-accent-blue-subtle)'],
		['#E6FCFF', 'var(--ds-background-accent-teal-subtlest)'],
		['#B3F5FF', 'var(--ds-background-accent-teal-subtler)'],
		['#79E2F2', 'var(--ds-background-accent-teal-subtle)'],
		['#E3FCEF', 'var(--ds-background-accent-green-subtlest)'],
		['#ABF5D1', 'var(--ds-background-accent-green-subtler)'],
		['#57D9A3', 'var(--ds-background-accent-green-subtle)'],
		['#FFFAE6', 'var(--ds-background-accent-yellow-subtlest)'],
		['#FFF0B3', 'var(--ds-background-accent-yellow-subtler)'],
		['#FFC400', 'var(--ds-background-accent-orange-subtle)'],
		['#FFEBE6', 'var(--ds-background-accent-red-subtlest)'],
		['#FFBDAD', 'var(--ds-background-accent-red-subtler)'],
		['#FF8F73', 'var(--ds-background-accent-red-subtle)'],
		['#EAE6FF', 'var(--ds-background-accent-purple-subtlest)'],
		['#C0B6F2', 'var(--ds-background-accent-purple-subtler)'],
		['#998DD9', 'var(--ds-background-accent-purple-subtle)'],
		['#FFFFFF', 'var(--ds-surface)'],
		['#F4F5F7', 'var(--ds-background-accent-gray-subtlest)'],
		['#B3BAC5', 'var(--ds-background-accent-gray-subtle)'],
	])('hexToEditorBackgroundPaletteColor(%s)', (inputHexCode, expectedCssValue) => {
		expect(hexToEditorBackgroundPaletteColor(inputHexCode)).toBe(expectedCssValue);
	});
	test('supports loading via a lowercase value', () => {
		expect(hexToEditorBackgroundPaletteColor('#deebff')).toBe(
			'var(--ds-background-accent-blue-subtlest)',
		);
	});
});

describe('hexToEditorBackgroundPaletteRawValue', () => {
	test('Returns input hex when tokens are on the page', () => {
		expect(hexToEditorBackgroundPaletteRawValue('#deebff')).toBe('#deebff');
	});

	test('Returns undefined when unmapped input is provided', () => {
		expect(hexToEditorBackgroundPaletteRawValue('invalid')).toBe(undefined);
	});
});
