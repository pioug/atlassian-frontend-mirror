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
			 * End the current history slice.
			 * You must call this function to close the history slice.
			 * @param id - A unique identifier for the history slice. It must match the id passed to `startHistorySlice`.
			 */
			endHistorySlice: (id: string) => EditorCommand;
			/**
			 * Start a new history slice.
			 * This is useful when you want to group multiple transactions into a single undo step.
			 * You must call `endHistorySlice` to close the history slice.
			 * @param id - A unique identifier for the history slice.
			 */
			startHistorySlice: (id: string) => EditorCommand;
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
