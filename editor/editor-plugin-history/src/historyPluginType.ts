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
			 * prosemirror-history's `undo` as an `EditorCommand`. Returns the transaction
			 * prosemirror-history itself builds for the next undo (so it is exactly what Cmd+Z
			 * dispatches), in place of the transaction passed in, so callers can add their own
			 * metadata before dispatching via `api.core.actions.execute`.
			 *
			 * The given transaction must be fresh for the current editor state; metadata or steps
			 * set on it are not carried over. Returns `null` when there is nothing to undo or the
			 * given transaction already contains steps.
			 */
			undo: EditorCommand;
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
