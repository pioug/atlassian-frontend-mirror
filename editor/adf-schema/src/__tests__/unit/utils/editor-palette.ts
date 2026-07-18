import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	hexToEditorTextBackgroundPaletteColor,
	hexToEditorTextPaletteColor,
} from '../../../utils/editor-palette';

describe('hexToEditorTextPaletteColor', () => {
	it('should use icon accent yellow for #B38600 when patch gate is disabled', () => {
		failGate('platform_editor_lovability_text_bg_color_patch_1');

		expect(hexToEditorTextPaletteColor('#B38600')).toBe('var(--ds-icon-accent-yellow, #B38600)');
	});

	it('should use border accent yellow for #B38600 when patch gate is enabled', () => {
		passGate('platform_editor_lovability_text_bg_color_patch_1');

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
