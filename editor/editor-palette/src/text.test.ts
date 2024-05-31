import { hexToEditorTextPaletteColor } from './index';

describe('hexToEditorTextPaletteColor', () => {
	test.each([
		['#B3D4FF', 'var(--ds-background-accent-blue-subtler, #B3D4FF)'],
		['#4C9AFF', 'var(--ds-icon-accent-blue, #4C9AFF)'],
		['#0747A6', 'var(--ds-text-accent-blue, #0747A6)'],
		['#B3F5FF', 'var(--ds-background-accent-teal-subtler, #B3F5FF)'],
		['#00B8D9', 'var(--ds-icon-accent-teal, #00B8D9)'],
		['#008DA6', 'var(--ds-text-accent-teal, #008DA6)'],
		['#ABF5D1', 'var(--ds-background-accent-green-subtler, #ABF5D1)'],
		['#36B37E', 'var(--ds-icon-accent-green, #36B37E)'],
		['#006644', 'var(--ds-text-accent-green, #006644)'],
		['#FFF0B3', 'var(--ds-background-accent-yellow-subtler, #FFF0B3)'],
		['#FFC400', 'var(--ds-background-accent-orange-subtle, #FFC400)'],
		['#FF991F', 'var(--ds-icon-accent-orange, #FF991F)'],
		['#FFBDAD', 'var(--ds-background-accent-red-subtler, #FFBDAD)'],
		['#FF5630', 'var(--ds-icon-accent-red, #FF5630)'],
		['#BF2600', 'var(--ds-text-accent-red, #BF2600)'],
		['#EAE6FF', 'var(--ds-background-accent-purple-subtler, #EAE6FF)'],
		['#6554C0', 'var(--ds-icon-accent-purple, #6554C0)'],
		['#403294', 'var(--ds-text-accent-purple, #403294)'],
		['#FFFFFF', 'var(--ds-text-inverse, #FFFFFF)'],
		['#97A0AF', 'var(--ds-icon-accent-gray, #97A0AF)'],
		['#172B4D', 'var(--ds-text, #172B4D)'],
	])('hexToEditorTextPaletteColor(%s)', (inputHexCode, expectedDesignToken) => {
		expect(hexToEditorTextPaletteColor(inputHexCode)).toBe(expectedDesignToken);
	});

	test('supports loading via a lowercase value', () => {
		expect(hexToEditorTextPaletteColor('#b3d4ff')).toBe(
			'var(--ds-background-accent-blue-subtler, #B3D4FF)',
		);
	});
});
