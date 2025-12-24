import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';

import { INPUT_METHOD } from '../analytics';

import { TOOLBARS } from './keys';
import type { ContextualFormattingEnabledOptions } from './types';

export const getInputMethodFromParentKeys = (parents: ToolbarComponentTypes) =>
	parents.at(0)?.key === TOOLBARS.INLINE_TEXT_TOOLBAR
		? INPUT_METHOD.FLOATING_TB
		: INPUT_METHOD.TOOLBAR;

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
	if (fg('platform_editor_toolbar_aifc_placement_overridden')) {
		if (contextualFormattingEnabled === 'controlled') {
			return toolbarDockingPosition !== 'none';
		}
		if (contextualFormattingEnabled === 'always-pinned') {
			return true;
		}
		return false;
	}
	return toolbarDockingPosition !== 'none';
};

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
	if (fg('platform_editor_toolbar_aifc_placement_overridden')) {
		if (contextualFormattingEnabled === 'controlled') {
			return toolbarDockingPosition === 'top';
		}
		if (contextualFormattingEnabled === 'always-inline') {
			return true;
		}
		return false;
	}
	return toolbarDockingPosition === 'top';
};
