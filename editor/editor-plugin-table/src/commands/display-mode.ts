import type { EditorCommand } from '@atlaskit/editor-common/types';
import { findTable } from '@atlaskit/editor-tables/utils';

export const setTableDisplayMode: EditorCommand = ({ tr }) => {
  const table = findTable(tr.selection);
  if (!table) {
    return null;
  }

  const { displayMode } = table.node.attrs;

  tr.setNodeMarkup(table.pos, tr.doc.type.schema.nodes.table, {
    ...table.node.attrs,
    displayMode:
      !displayMode || displayMode === 'default' ? 'fixed' : 'default',
  });

  return tr.setMeta('scrollIntoView', false);
};
