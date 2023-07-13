import type { EditorState, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

export type CommandDispatch = (tr: Transaction) => void;
export type Command = (
  state: EditorState,
  dispatch?: CommandDispatch,
  view?: EditorView,
) => boolean;
export type HigherOrderCommand = (command: Command) => Command;

export type Predicate = (state: EditorState, view?: EditorView) => boolean;
