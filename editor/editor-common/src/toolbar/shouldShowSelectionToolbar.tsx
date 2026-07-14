import type { ContextualFormattingEnabledOptions } from './types';

/**
 * Determines whether the selection (inline) toolbar should be shown based on contextual formatting mode
 * and toolbar docking position preference.
 *
 * @param contextualFormattingEnabled - The contextual formatting mode
 * @param toolbarDockingPosition - The user's toolbar docking preference
 * @returns true if the selection toolbar should be displayed, false otherwise
 */
export const shouldShowSelectionToolbar = (
	contextualFormattingEnabled: ContextualFormattingEnabledOptions,
	toolbarDockingPosition?: 'top' | 'none',
): boolean => {
	if (contextualFormattingEnabled === 'controlled') {
		return toolbarDockingPosition === 'top';
	}
	if (contextualFormattingEnabled === 'always-inline') {
		return true;
	}
	return false;
};
