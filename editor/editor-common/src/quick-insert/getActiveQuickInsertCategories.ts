import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

/**
 * Returns the Quick Insert categories active for the current experiment state.
 */
export const getActiveQuickInsertCategories = (
	category?: string,
	legacyCategories?: string[],
): string[] =>
	isExperimentEnabled('platform_editor_slash_command') && category?.trim()
		? [category]
		: (legacyCategories ?? []);
