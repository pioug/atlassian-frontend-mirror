import type { EditorPluginInjectionAPI } from '@atlaskit/editor-common/preset/plugin-injection-api';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { EditorNextProps } from '../../types/editor-props';
import { isFullPage } from '../../utils/is-full-page';

/** Resolve initial toolbar usage without publishing editor state to shared-state consumers. */
export const shouldUseOptimisticToolbarState = (
	editorAPI: ReturnType<EditorPluginInjectionAPI['api']>,
	props: Pick<EditorNextProps, 'appearance' | 'primaryToolbarComponents'>,
): boolean => {
	if (!expValEquals('platform_editor_ssr_toolbar_optimistic', 'isEnabled', true)) {
		return false;
	}

	// Docking applies to full-page appearances. Preserve other editors' initialization.
	if (!isFullPage(props.appearance) && props.appearance !== 'max') {
		return true;
	}

	if (editorAPI?.editorViewMode?.sharedState.currentState()?.mode === 'view') {
		return false;
	}

	// Custom controls and the legacy toolbar can still consume the initial state.
	if (
		props.primaryToolbarComponents ||
		!editorAPI?.toolbar ||
		!expValEqualsNoExposure('platform_editor_controls', 'cohort', 'variant1')
	) {
		return true;
	}

	const mode = editorAPI.toolbar.actions.contextualFormattingMode();
	if (mode === 'always-pinned' || mode === undefined) {
		return true;
	}
	if (mode !== 'controlled') {
		return false;
	}

	// This action reads the provider/config directly, without needing a PM state.
	// Keep the existing behavior if the initial preference is not yet known.
	return editorAPI.userPreferences?.actions.getUserPreferences()?.toolbarDockingPosition !== 'none';
};
