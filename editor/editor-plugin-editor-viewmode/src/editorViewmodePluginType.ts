import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type EditorViewModePluginState = {
	mode: ViewMode;
};
export type ViewMode = 'view' | 'edit';

export type EditorViewModePluginConfig = {
	mode?: ViewMode;
};

export type EditorViewModePlugin = NextEditorPlugin<
	'editorViewMode',
	{
		sharedState: EditorViewModePluginState | null;
		dependencies: [];
		pluginConfiguration?: EditorViewModePluginConfig;
		commands: {
			updateViewMode: (mode: ViewMode) => EditorCommand;
		};
	}
>;
