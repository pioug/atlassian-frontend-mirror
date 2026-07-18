import { hexToEditorTextBackgroundPaletteColor } from './index';

describe('hexToEditorTextBackgroundPaletteColor', () => {
	test.each([
		['#DCDFE4', 'var(--ds-background-accent-gray-subtler)'],
		['#B3D4FF', 'var(--ds-background-accent-blue-subtler)'],
		['#C6EDFB', 'var(--ds-background-accent-teal-subtler)'],
		['#ABF5D1', 'var(--ds-background-accent-green-subtler)'],
		['#D3F1A7', 'var(--ds-background-accent-lime-subtler)'],
		['#F8E6A0', 'var(--ds-background-accent-yellow-subtler)'],
		['#FEDEC8', 'var(--ds-background-accent-orange-subtler)'],
		['#FFD5D2', 'var(--ds-background-accent-red-subtler)'],
		['#FDD0EC', 'var(--ds-background-accent-magenta-subtler)'],
		['#DFD8FD', 'var(--ds-background-accent-purple-subtler)'],
	])('hexToEditorTextBackgroundPaletteColor(%s)', (inputHexCode, expectedDesignToken) => {
		expect(hexToEditorTextBackgroundPaletteColor(inputHexCode)).toBe(expectedDesignToken);
	});

	test('supports loading via a lowercase value', () => {
		expect(hexToEditorTextBackgroundPaletteColor('#dcdfe4')).toBe(
			'var(--ds-background-accent-gray-subtler)',
		);
	});

	test("returns undefined when passed a color that isn't in the color palette", () => {
		expect(hexToEditorTextBackgroundPaletteColor('#FFFFFF')).toBeUndefined();
	});
});
