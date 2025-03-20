import type { ViewMode, EditorViewModePluginState } from '@atlaskit/editor-plugins/editor-viewmode';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ComponentProps } from './FullPage';

// Retrieve the initial config value from the editor view plugin preset
const getViewModeSync = (preset: ComponentProps['preset']) => {
	if (!fg('platform_editor_sync_editor_view_mode_state')) {
		return undefined;
	}
	// @ts-expect-error - data is a private property
	const editorViewModePlugin = preset.data.find((p) => {
		if (Array.isArray(p)) {
			const [plugin, config] = p;
			return plugin({ config }).name === 'editorViewMode';
		} else {
			return p?.({ config: undefined })?.name === 'editorViewMode';
		}
	});
	// If we have set a default value on the view mode (index 1) then we can return the mode, otherwise we haven't set by default
	return Array.isArray(editorViewModePlugin) ? editorViewModePlugin[1]?.mode : undefined;
};

// Temporary to ensure view mode is always set synchronously
// TODO: ED-27194 - Make editorAPI be set synchronously and we can remove this code
export const getEditorViewMode = (
	editorViewModeState: EditorViewModePluginState | undefined | null,
	preset: ComponentProps['preset'],
): ViewMode => {
	if (!editorViewModeState?.mode) {
		return getViewModeSync(preset);
	}
	return editorViewModeState?.mode;
};
