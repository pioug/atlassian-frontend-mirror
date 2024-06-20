import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type EditorViewModeEffectsPlugin = NextEditorPlugin<
	'editorViewModeEffects',
	{
		dependencies: [CollabEditPlugin, EditorViewModePlugin];
		actions: {
			applyViewModeStepAt: (tr: Transaction) => boolean;
		};
	}
>;
