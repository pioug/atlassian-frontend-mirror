import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';

import { CellAttributes } from '@atlaskit/adf-schema';

/**
 * Helper to split all the cells in a range of columns
 * @param tr
 * @param tablePos
 * @param columnStart - Start of the rect included (rect.left)
 * @param columnEnd - End of the rect not included (rect.right)
 */
export function splitCellsInColumns(
  tr: Transaction,
  tablePos: number,
  columnStart: number,
  columnEnd: number,
): Transaction {
  let mapStart = tr.mapping.maps.length;
  const table = tr.doc.nodeAt(tablePos);
  if (!table) {
    return tr;
  }

  const tableStart = tr.doc.resolve(tablePos).start(1);
  const map = TableMap.get(table);

  for (let column = columnStart; column < columnEnd; column++) {
    for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
      const cellIndex = rowIndex * map.width + column;
      const cellPos = map.map[cellIndex];

      // Check if the cell is contained by another by another row/column
      const hasMergedCellsBefore =
        (column > 0 && map.map[cellIndex - 1] === cellPos) ||
        (rowIndex > 0 &&
          map.map[(rowIndex - 1) * map.width + column] === cellPos);
      // Check if the cell contains another row/column
      const hasMergedCellsAfter =
        (column < map.width - 1 && map.map[cellIndex + 1] === cellPos) ||
        (rowIndex < map.height - 1 &&
          map.map[(rowIndex + 1) * map.width + column] === cellPos);
      if (!hasMergedCellsBefore && hasMergedCellsAfter) {
        // Is a merged cell that start in this row/column
        const cellNode = table.nodeAt(cellPos) as ProseMirrorNode;
        if (!cellNode) {
          continue;
        }
        const {
          colwidth,
          colspan = 1,
          rowspan = 1,
        } = cellNode.attrs as CellAttributes;

        let mapping = tr.mapping.slice(mapStart);

        // Update current node with the simple colspan
        const baseAttrs: CellAttributes = {
          ...(cellNode.attrs as CellAttributes),
          colspan: 1,
          rowspan: 1,
        };
        // Add the new cells
        for (
          let cellRowIndex = rowIndex;
          cellRowIndex < rowIndex + rowspan;
          cellRowIndex++
        ) {
          for (let i = 0; i < colspan; i++) {
            let mapping = tr.mapping.slice(mapStart);
            const cellPos = map.positionAt(cellRowIndex, column + i, table);
            tr.insert(
              mapping.map(cellPos + tableStart),
              cellNode.type.createAndFill({
                ...baseAttrs,
                colwidth: colwidth ? [colwidth[i]] : undefined,
              })!,
            );
          }
        }

        // Delete the original cell
        mapping = tr.mapping.slice(mapStart);
        tr.delete(
          mapping.map(cellPos + tableStart),
          mapping.map(cellPos + tableStart + cellNode.nodeSize),
        );

        // Skip rows based on rowspan
        if (rowspan && rowspan > 1) {
          rowIndex += rowspan - 1;
        }
      }
    }
  }

  return tr;
}
