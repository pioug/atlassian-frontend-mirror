import { hexToEditorTextBackgroundPaletteColor } from './index';

describe('hexToEditorTextBackgroundPaletteColor', () => {
	test.each([
		['#DCDFE4', 'var(--ds-background-accent-gray-subtler)'],
		['#C6EDFB', 'var(--ds-background-accent-teal-subtler)'],
		['#D3F1A7', 'var(--ds-background-accent-lime-subtler)'],
		['#FEDEC8', 'var(--ds-background-accent-orange-subtler)'],
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
