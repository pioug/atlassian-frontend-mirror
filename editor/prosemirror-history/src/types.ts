import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export interface HistoryOptions {
	/// The amount of history events that are collected before the
	/// oldest events are discarded. Defaults to 100.
	depth?: number;

	/// The delay between changes after which a new group should be
	/// started. Defaults to 500 (milliseconds). Note that when changes
	/// aren't adjacent, a new group is always started.
	newGroupDelay?: number;
}

type CommandDispatch = (tr: Transaction) => void;

// Duplicated type to avoid circular dependency
export type Command = (
	state: EditorState,
	dispatch?: CommandDispatch,
	view?: EditorView,
) => boolean;
