import { hexToEditorTextPaletteColor } from './index';

describe('hexToEditorTextPaletteColor', () => {
	test.each([
		['#B3D4FF', 'var(--ds-background-accent-blue-subtler)'],
		['#4C9AFF', 'var(--ds-icon-accent-blue)'],
		['#0747A6', 'var(--ds-text-accent-blue)'],
		['#B3F5FF', 'var(--ds-background-accent-teal-subtler)'],
		['#00B8D9', 'var(--ds-icon-accent-teal)'],
		['#008DA6', 'var(--ds-text-accent-teal)'],
		['#ABF5D1', 'var(--ds-background-accent-green-subtler)'],
		['#36B37E', 'var(--ds-icon-accent-green)'],
		['#006644', 'var(--ds-text-accent-green)'],
		['#D3F1A7', 'var(--ds-background-accent-lime-subtler)'],
		['#6A9A23', 'var(--ds-icon-accent-lime)'],
		['#4C6B1F', 'var(--ds-text-accent-lime)'],
		['#FFF0B3', 'var(--ds-background-accent-yellow-subtler)'],
		['#B38600', 'var(--ds-icon-accent-yellow)'],
		['#7F5F01', 'var(--ds-text-accent-yellow)'],
		['#FFC400', 'var(--ds-background-accent-orange-subtle)'],
		['#FF991F', 'var(--ds-icon-accent-orange)'],
		['#FCE4A6', 'var(--ds-background-accent-orange-subtler)'],
		['#E06C00', 'var(--ds-icon-accent-orange)'],
		['#9E4C00', 'var(--ds-text-accent-orange)'],
		['#FFBDAD', 'var(--ds-background-accent-red-subtler)'],
		['#FF5630', 'var(--ds-icon-accent-red)'],
		['#BF2600', 'var(--ds-text-accent-red)'],
		['#FDD0EC', 'var(--ds-background-accent-magenta-subtler)'],
		['#CD519D', 'var(--ds-icon-accent-magenta)'],
		['#943D73', 'var(--ds-text-accent-magenta)'],
		['#EAE6FF', 'var(--ds-background-accent-purple-subtler)'],
		['#6554C0', 'var(--ds-icon-accent-purple)'],
		['#403294', 'var(--ds-text-accent-purple)'],
		['#FFFFFF', 'var(--ds-text-inverse)'],
		['#97A0AF', 'var(--ds-icon-accent-gray)'],
		['#172B4D', 'var(--ds-text)'],
	])('hexToEditorTextPaletteColor(%s)', (inputHexCode, expectedDesignToken) => {
		expect(hexToEditorTextPaletteColor(inputHexCode)).toBe(expectedDesignToken);
	});

	test('supports loading via a lowercase value', () => {
		expect(hexToEditorTextPaletteColor('#b3d4ff')).toBe('var(--ds-background-accent-blue-subtler)');
	});
});
