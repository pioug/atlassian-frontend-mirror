import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type { Transaction, Selection, EditorState } from 'prosemirror-state';
import type { SelectionPluginState } from '../plugins/selection/types';
import { setSelectionRelativeToNode as setSelectionRelativeToNodeOriginalCommand } from '../plugins/selection/commands';
import { getPluginState as getSelectionPluginState } from '../plugins/selection/plugin-factory';

export type EditorSelectionAPI = {
  setSelectionRelativeToNode: (props: {
    selectionRelativeToNode?: RelativeSelectionPos;
    selection?: Selection | null;
  }) => (state: EditorState) => Transaction;
  getSelectionPluginState: (state: EditorState) => SelectionPluginState;
};

export const createEditorSelectionAPI = (): EditorSelectionAPI => {
  return {
    getSelectionPluginState: (state: EditorState) => {
      return getSelectionPluginState(state);
    },
    setSelectionRelativeToNode: ({ selectionRelativeToNode, selection }) => (
      state: EditorState,
    ) => {
      let tr = state.tr;
      const fakeDispatch = (_tr: Transaction) => {
        tr = _tr;
      };
      setSelectionRelativeToNodeOriginalCommand(
        selectionRelativeToNode,
        selection,
      )(state, fakeDispatch);
      return tr;
    },
  };
};
