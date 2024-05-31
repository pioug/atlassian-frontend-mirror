import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type EditorViewModePluginState = {
	mode: ViewMode;
};
export type ViewMode = 'view' | 'edit';

export type EditorViewModePlugin = NextEditorPlugin<
	'editorViewMode',
	{
		sharedState: EditorViewModePluginState | null;
		dependencies: [CollabEditPlugin];
		pluginConfiguration?: {
			mode?: ViewMode;
		};
		commands: {
			updateViewMode: (mode: ViewMode) => EditorCommand;
		};
		actions: {
			applyViewModeStepAt: (tr: Transaction) => boolean;
		};
	}
>;
