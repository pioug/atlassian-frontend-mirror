import { hexToEditorTextBackgroundPaletteColor } from './index';

describe('hexToEditorTextBackgroundPaletteColor', () => {
	test.each([
		['#DCDFE4', 'var(--ds-background-accent-gray-subtler, #DCDFE4)'],
		['#C6EDFB', 'var(--ds-background-accent-teal-subtler, #C6EDFB)'],
		['#D3F1A7', 'var(--ds-background-accent-lime-subtler, #D3F1A7)'],
		['#FEDEC8', 'var(--ds-background-accent-yellow-subtler, #F8E6A0)'],
		['#FDD0EC', 'var(--ds-background-accent-magenta-subtler, #FDD0EC)'],
		['#DFD8FD', 'var(--ds-background-accent-purple-subtler, #DFD8FD)'],
	])('hexToEditorTextBackgroundPaletteColor(%s)', (inputHexCode, expectedDesignToken) => {
		expect(hexToEditorTextBackgroundPaletteColor(inputHexCode)).toBe(expectedDesignToken);
	});

	test('supports loading via a lowercase value', () => {
		expect(hexToEditorTextBackgroundPaletteColor('#dcdfe4')).toBe(
			'var(--ds-background-accent-gray-subtler, #DCDFE4)',
		);
	});

	test("returns undefined when passed a color that isn't in the color palette", () => {
		expect(hexToEditorTextBackgroundPaletteColor('#FFFFFF')).toBeUndefined();
	});
});
