import { hexToEditorTextBackgroundPaletteColor } from '../../../utils/editor-palette';

describe('hexToEditorTextBackgroundPaletteColor', () => {
	it('should return orange color for #FEDEC8', () => {
		const result = hexToEditorTextBackgroundPaletteColor('#FEDEC8');
		expect(result).toBe('var(--ds-background-accent-orange-subtler, #FEDEC8)');
	});

	it('should return yellow color for #F8E6A0', () => {
		const result = hexToEditorTextBackgroundPaletteColor('#F8E6A0');
		expect(result).toBe('var(--ds-background-accent-yellow-subtler, #F8E6A0)');
	});

	it('should return undefined for a hex not in the palette', () => {
		const result = hexToEditorTextBackgroundPaletteColor('#FFFFFFFF');
		expect(result).toBeUndefined();
	});
});
