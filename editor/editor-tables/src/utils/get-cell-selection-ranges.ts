import { Node as PMNode, ResolvedPos } from 'prosemirror-model';
import { SelectionRange } from 'prosemirror-state';

import { TableMap } from '../table-map';

export function getCellSelectionRanges(
  $anchorCell: ResolvedPos,
  $headCell: ResolvedPos,
): SelectionRange[] {
  const table = $anchorCell.node(-1);
  const map = TableMap.get(table);
  const start = $anchorCell.start(-1);
  const rect = map.rectBetween($anchorCell.pos - start, $headCell.pos - start);
  const doc = $anchorCell.node(0);
  const cells = map
    .cellsInRect(rect)
    .filter((p) => p !== $headCell.pos - start);
  // Make the head cell the first range, so that it counts as the
  // primary part of the selection
  cells.unshift($headCell.pos - start);

  return cells.map((pos) => {
    const cell = table.nodeAt(pos) as PMNode | null;
    if (cell === null) {
      throw new Error(`No cell at position ${pos}`);
    }
    const from = pos + start + 1;

    return new SelectionRange(
      doc.resolve(from),
      doc.resolve(from + cell.content.size),
    );
  });
}
