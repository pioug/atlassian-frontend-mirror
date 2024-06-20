import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type EditorViewModePluginState = {
	mode: ViewMode;
};
export type ViewMode = 'view' | 'edit';

export type EditorViewModePlugin = NextEditorPlugin<
	'editorViewMode',
	{
		sharedState: EditorViewModePluginState | null;
		dependencies: [];
		pluginConfiguration?: {
			mode?: ViewMode;
		};
		commands: {
			updateViewMode: (mode: ViewMode) => EditorCommand;
		};
	}
>;
