import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

export interface HistoryPluginState {
	canRedo: boolean;
	canUndo: boolean;
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
		commands: {
			/**
			 * Force the history plugin to recompute its state based on the prosemirror-history plugin state.
			 * Is useful if the prosemirror-history plugin state has been manually reset.
			 * @returns A transaction to update the plugin state
			 */
			updatePluginState: EditorCommand;
		};
		sharedState: HistoryPluginSharedState | undefined;
	}
>;
