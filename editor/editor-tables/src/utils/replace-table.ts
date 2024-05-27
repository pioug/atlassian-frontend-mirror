import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import {
  type EditorState,
  TextSelection,
  type Transaction,
} from '@atlaskit/editor-prosemirror/state';

import { findTable } from './find';
import { isTableSelected } from './is-selected';

export const replaceSelectedTable = (
  state: EditorState,
  content: string | Slice,
): Transaction => {
  if (isTableSelected(state.selection)) {
    const table = findTable(state.selection);
    if (table) {
      const slice: Slice =
        typeof content === 'string'
          ? new Slice(Fragment.from(state.schema.text(content)), 0, 0)
          : content;
      let tr = state.tr.replace(
        table.pos,
        table.pos + table.node.nodeSize,
        slice,
      );
      tr.setSelection(TextSelection.create(tr.doc, table.pos + slice.size + 1));
      return tr;
    }
  }
  return state.tr;
};
