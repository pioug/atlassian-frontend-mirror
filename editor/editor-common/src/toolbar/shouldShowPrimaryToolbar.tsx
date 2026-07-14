import type { ContextualFormattingEnabledOptions } from './types';

/**
 * Determines whether the primary (top) toolbar should be shown based on contextual formatting mode
 * and toolbar docking position preference.
 *
 * @param contextualFormattingEnabled - The contextual formatting mode
 * @param toolbarDockingPosition - The user's toolbar docking preference
 * @returns true if the primary toolbar should be displayed, false otherwise
 */
export const shouldShowPrimaryToolbar = (
	contextualFormattingEnabled?: ContextualFormattingEnabledOptions,
	toolbarDockingPosition?: 'top' | 'none',
): boolean => {
	if (contextualFormattingEnabled === 'controlled') {
		return toolbarDockingPosition !== 'none';
	}
	if (contextualFormattingEnabled === 'always-pinned') {
		return true;
	}
	return false;
};
