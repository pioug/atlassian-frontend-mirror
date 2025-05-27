import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type EditorViewModePluginState = {
	mode: ViewMode;
};

export type ViewMode = 'edit' | 'view';

export type EditorViewModePluginOptions = {
	mode?: ViewMode;
};

export type EditorViewModePlugin = NextEditorPlugin<
	'editorViewMode',
	{
		sharedState: EditorViewModePluginState | null;
		dependencies: [];
		pluginConfiguration?: EditorViewModePluginOptions;
		commands: {
			updateViewMode: (mode: ViewMode) => EditorCommand;
		};
	}
>;
