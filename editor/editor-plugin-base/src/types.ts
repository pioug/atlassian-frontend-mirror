import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type CommandDispatch = (tr: Transaction) => void;

export type Command = (
	state: EditorState,
	dispatch?: CommandDispatch,
	view?: EditorView,
) => boolean;
