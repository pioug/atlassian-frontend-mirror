import type { EditorState } from 'prosemirror-state';
import { hasParentNodeOfType } from 'prosemirror-utils';

export const insideTable = (state: EditorState): Boolean => {
  const { table, tableCell } = state.schema.nodes;

  return hasParentNodeOfType([table, tableCell])(state.selection);
};
