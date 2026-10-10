import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit/collabEditPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export type EditorViewModeEffectsPlugin = NextEditorPlugin<
	'editorViewModeEffects',
	{
		actions: {
			allowViewModeTransaction: (tr: Transaction) => Transaction;
			applyViewModeStepAt: (tr: Transaction) => boolean;
		};
		dependencies: [CollabEditPlugin, EditorViewModePlugin];
	}
>;
