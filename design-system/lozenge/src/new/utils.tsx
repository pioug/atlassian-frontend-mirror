import { type AccentColor, type LozengeColor, type SemanticColor } from './types';

// Map legacy appearance to new color values
const legacyAppearanceMap: Record<string, SemanticColor> = {
	default: 'neutral',
	removed: 'danger',
	inprogress: 'information',
	new: 'discovery',
	moved: 'warning',
};

// Resolve the lozenge color based on the appearance
export const resolveLozengeColor: (appearance?: string) => LozengeColor = (
	appearance = 'neutral',
): LozengeColor => {
	if (appearance.startsWith('accent-')) {
		return appearance as AccentColor;
	}

	return legacyAppearanceMap[appearance] ?? (appearance as SemanticColor);
};

export { getThemeStyles } from './get-theme-styles';
