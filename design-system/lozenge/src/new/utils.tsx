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
export const resolveLozengeColor = (appearance = 'neutral'): LozengeColor => {
	if (appearance.startsWith('accent-')) {
		return appearance as AccentColor;
	}

	return legacyAppearanceMap[appearance] ?? (appearance as SemanticColor);
};

// extract the category and key from the resolved color
export const getThemeStyles = (resolvedColor: LozengeColor) => {
	const isAccent = resolvedColor.startsWith('accent-');
	const category = isAccent ? 'accent' : 'semantic';
	const key = isAccent ? resolvedColor.replace('accent-', '') : resolvedColor;

	return { category, key };
};
