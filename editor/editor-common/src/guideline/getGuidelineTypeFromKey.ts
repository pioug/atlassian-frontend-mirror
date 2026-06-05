import type { GuidelineConfig, GuidelineTypes } from './types';

/**
 * Returns the type of guideline based on a guideline key and a collection of guidelines
 */
export const getGuidelineTypeFromKey = (
	keys: string[],
	guidelines: GuidelineConfig[],
): GuidelineTypes => {
	if (guidelines.length === 0) {
		return 'none';
	}

	// Check for default guidelines on key
	if (
		keys.some((key) =>
			['grid_', 'wide_', 'full_width'].some(
				(defaultGuideline) => key.indexOf(defaultGuideline) >= 0,
			),
		)
	) {
		return 'default';
	}

	// Check for temporary guidelines
	if (
		keys.some((key) =>
			['media_'].some((temoporaryGuideline) => key.indexOf(temoporaryGuideline) >= 0),
		)
	) {
		return 'temporary';
	}

	// Check for relative guidelines
	if (
		keys.some((key) =>
			['relative_'].some((relativeGuideline) => key.indexOf(relativeGuideline) >= 0),
		)
	) {
		return 'relative';
	}

	return 'none';
};
