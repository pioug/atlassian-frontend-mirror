import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

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
