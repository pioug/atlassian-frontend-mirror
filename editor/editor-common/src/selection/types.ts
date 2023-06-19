import type { EditorState, Selection, Transaction } from 'prosemirror-state';
import type { DecorationSet } from 'prosemirror-view';

export enum RelativeSelectionPos {
  Before = 'Before',
  Start = 'Start',
  Inside = 'Inside',
  End = 'End',
}

export interface SelectionPluginState {
  /** Selected node class decorations */
  decorationSet: DecorationSet;
  /** Selection the decorations were built for */
  selection: Selection;
  /**
   * Relative position of selection to either its parent node or, if a NodeSelection, its own node
   * Used to manage where the selection should go when using arrow keys
   */
  selectionRelativeToNode?: RelativeSelectionPos;
}

export type EditorSelectionAPI = {
  setSelectionRelativeToNode: (props: {
    selectionRelativeToNode?: RelativeSelectionPos;
    selection?: Selection | null;
  }) => (state: EditorState) => Transaction;
  getSelectionPluginState: (state: EditorState) => SelectionPluginState;
};
