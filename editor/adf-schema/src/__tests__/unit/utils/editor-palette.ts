import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { hexToEditorTextBackgroundPaletteColor } from '../../../utils/hex-to-editor-text-background-palette-color';
import { hexToEditorTextPaletteColor } from '../../../utils/hex-to-editor-text-palette-color';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure', () => ({
	expValEqualsNoExposure: jest.fn(),
}));

const mockExpValEqualsNoExposure = expValEqualsNoExposure as jest.MockedFunction<
	typeof expValEqualsNoExposure
>;

describe('hexToEditorTextPaletteColor', () => {
	it('should use border accent yellow for #B38600 when patch gate is enabled', () => {
		mockExpValEqualsNoExposure.mockReturnValue(true);
		expect(hexToEditorTextPaletteColor('#B38600')).toBe('var(--ds-border-accent-yellow, #B38600)');
	});
});

describe('hexToEditorTextBackgroundPaletteColor', () => {
	it('should return orange color for #FEDEC8', () => {
		const result = hexToEditorTextBackgroundPaletteColor('#FEDEC8');
		expect(result).toBe('var(--ds-background-accent-orange-subtler, #FEDEC8)');
	});

	it('should return yellow color for #F8E6A0', () => {
		const result = hexToEditorTextBackgroundPaletteColor('#F8E6A0');
		expect(result).toBe('var(--ds-background-accent-yellow-subtler, #F8E6A0)');
	});

	it('should return red color for #FFD5D2', () => {
		const result = hexToEditorTextBackgroundPaletteColor('#FFD5D2');
		expect(result).toBe('var(--ds-background-accent-red-subtler, #FFD5D2)');
	});

	it('should return undefined for a hex not in the palette', () => {
		const result = hexToEditorTextBackgroundPaletteColor('#FFFFFFFF');
		expect(result).toBeUndefined();
	});
});
