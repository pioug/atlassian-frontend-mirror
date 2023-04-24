import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

// File has been copied to packages/editor/editor-plugin-ai/src/utils/analytics.ts
// If changes are made to this file, please make the same update in the linked file.
export type CommandDispatch = (tr: Transaction) => void;
export type Command = (
  state: EditorState,
  dispatch?: CommandDispatch,
  view?: EditorView,
) => boolean;
export type HigherOrderCommand = (command: Command) => Command;
