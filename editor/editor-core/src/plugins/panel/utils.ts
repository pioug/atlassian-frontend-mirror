import { EditorState, Selection } from 'prosemirror-state';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';

export const findPanel = (
  state: EditorState,
  selection?: Selection<any> | null,
) => {
  const { panel } = state.schema.nodes;
  return (
    findSelectedNodeOfType(panel)(selection || state.selection) ||
    findParentNodeOfType(panel)(selection || state.selection)
  );
};
