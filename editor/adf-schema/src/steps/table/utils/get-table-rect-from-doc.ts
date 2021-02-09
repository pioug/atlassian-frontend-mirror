import { Node as ProseMirrorNode } from 'prosemirror-model';
import { TableRect, TableMap } from '@atlaskit/editor-tables/table-map';

/**
 * Util to get the table rect from the docs
 * @param doc
 * @param tablePos
 */
export function getTableRectFromDoc(
  doc: ProseMirrorNode,
  tablePos: number,
): TableRect {
  const table = doc.nodeAt(tablePos);

  // Check for table existence
  if (!table || table.type.name !== 'table') {
    throw new Error(`No table at position "${tablePos}".`);
  }

  // Create transform base on the doc
  const map = TableMap.get(table);
  const $table = doc.resolve(tablePos);
  // Nested tables start position might differ from the original position
  const start = $table.start($table.depth + 1);

  return {
    map,
    table: table,
    tableStart: start,

    // Default to zero
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  };
}
