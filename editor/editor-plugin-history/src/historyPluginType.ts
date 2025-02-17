import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

export interface HistoryPluginState {
	canUndo: boolean;
	canRedo: boolean;
}

export interface HistoryPluginSharedState extends HistoryPluginState {
	done: {
		eventCount: number;
	};
	undone: {
		eventCount: number;
	};
}

export type HistoryPlugin = NextEditorPlugin<
	'history',
	{
		sharedState: HistoryPluginSharedState | undefined;
		commands: {
			/**
			 * Force the history plugin to recompute its state based on the prosemirror-history plugin state.
			 * Is useful if the prosemirror-history plugin state has been manually reset.
			 * @returns A transaction to update the plugin state
			 */
			updatePluginState: EditorCommand;
		};
	}
>;
