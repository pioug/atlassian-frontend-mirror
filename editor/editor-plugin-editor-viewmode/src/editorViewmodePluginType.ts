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
		commands: {
			updateViewMode: (mode: ViewMode) => EditorCommand;
		};
		dependencies: [];
		pluginConfiguration?: EditorViewModePluginOptions;
		sharedState: EditorViewModePluginState | null;
	}
>;
