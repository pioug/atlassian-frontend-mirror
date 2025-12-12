import FeatureGates from '@atlaskit/feature-gate-js-client';
import { hexToEditorTextBackgroundPaletteColor } from '../../../utils/editor-palette';

jest.mock('@atlaskit/feature-gate-js-client');

describe('hexToEditorTextBackgroundPaletteColor', () => {
	const mockExperimentValue = FeatureGates.getExperimentValue as jest.Mock;

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return orange color for #FEDEC8 when platform_editor_add_orange_highlight_color is enabled', () => {
		mockExperimentValue.mockReturnValue('test');
		const result = hexToEditorTextBackgroundPaletteColor('#FEDEC8');
		expect(result).toBe('var(--ds-background-accent-orange-subtler, #FEDEC8)');
	});

	it('should remap #FEDEC8 to yellow when platform_editor_add_orange_highlight_color is disabled', () => {
		mockExperimentValue.mockReturnValue('control');
		const result = hexToEditorTextBackgroundPaletteColor('#FEDEC8');
		expect(result).toBe('var(--ds-background-accent-yellow-subtler, #F8E6A0)');
	});

	it('should return undefined for a hex not in the palette', () => {
		const result = hexToEditorTextBackgroundPaletteColor('#FFFFFFFF');
		expect(result).toBeUndefined();
	});
});
