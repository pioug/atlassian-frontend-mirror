import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Cell } from './cells-at-column';
import { CellStep } from '../types';
import { Transform, StepMap } from 'prosemirror-transform';
import { TableRect } from '@atlaskit/editor-tables/table-map';
import { addColSpan, removeColSpan } from '@atlaskit/editor-tables/utils';
import { CellAttributesWithColSpan } from '@atlaskit/editor-tables/types';
import { CellAttributes } from '../../../schema/nodes/tableNodes';

const EmptyCellNodeSize = 4;

function calculateRowsToSkip(attrs?: CellAttributes) {
  if (attrs && attrs.rowspan) {
    return attrs.rowspan - 1;
  }

  return 0;
}

/**
 * Given a cell step, this function has to do the specific transformation to executed that step.
 * It returns the applied cellStep and rows that needs to skip (because it was already handled).
 * @param tr
 * @param tableRect
 * @param cell
 * @param cellStep
 * @param isDelete
 * @param column
 */
export function applyCellStep(
  tr: Transform,
  tableRect: TableRect,
  cell: Cell,
  cellStep: CellStep,
  isDelete: boolean,
  column: number,
): { tr: Transform; skipRows: number; cellStep: CellStep } {
  // Apply the merge actions,
  if (cellStep.mergeWith !== undefined) {
    let cellNode: ProseMirrorNode = tr.doc.nodeAt(
      tr.mapping.map(cellStep.mergeWith),
    )!;

    const columns =
      column -
      tableRect.map.colCount(cellStep.mergeWith - tableRect.tableStart);
    const cellAttrs = isDelete
      ? removeColSpan(cellNode.attrs as CellAttributesWithColSpan, columns)
      : addColSpan(cellNode.attrs as CellAttributesWithColSpan, columns);

    if (cellAttrs.colspan! > 0) {
      // When colspan is 0 should remove the cell
      tr.setNodeMarkup(
        tr.mapping.map(cellStep.mergeWith),
        undefined,
        cellAttrs,
      );
      return { tr, skipRows: calculateRowsToSkip(cellAttrs), cellStep };
    }

    // When the new colspan is 0, I need to change the operation to a delete operation
    // Update cellStep with the proper data
    cellStep.from = cellStep.mergeWith;
    cellStep.to = cellStep.from + cellNode.nodeSize;
    cellStep.mergeWith = undefined;
  }

  let skipRows = 0;
  // Modify temporary document
  if (isDelete) {
    let cellNode: ProseMirrorNode = tr.doc.nodeAt(
      tr.mapping.map(cellStep.from),
    )!;
    skipRows = calculateRowsToSkip(cellNode.attrs);
    tr.delete(tr.mapping.map(cellStep.from), tr.mapping.map(cellStep.to));
  } else {
    if (cellStep.newCell) {
      tr.insert(tr.mapping.map(cellStep.from), cellStep.newCell);
      skipRows = calculateRowsToSkip(cellStep.newCell.attrs);
    } else {
      tr.insert(tr.mapping.map(cellStep.from), cell.type!.createAndFill()!);
    }
  }
  return { tr, skipRows, cellStep };
}

/**
 * Given a cell step, this functions return un StepMap representing this action.
 * [position, oldSize, newSize]
 * @param cellStep
 * @param isDelete
 */
export function getMapFromCellStep(
  cellStep: CellStep,
  isDelete: boolean,
): [number, number, number] {
  if (cellStep.mergeWith !== undefined) {
    return [cellStep.mergeWith, 1, 1];
  }

  if (isDelete) {
    return [cellStep.from, cellStep.to - cellStep.from, 0];
  } else {
    if (cellStep.newCell) {
      return [cellStep.from, 0, cellStep.newCell.nodeSize];
    }
    return [cellStep.from, 0, EmptyCellNodeSize];
  }
}

/**
 * Helper to calculate the offset of the inverted cells.
 * When you delete consecutive rows in a single step, the position in the generated document
 *  are skipped by the all the changes except your own. (StepMap.map is not valid)
 * @param map
 * @param cellStep
 * @param isDelete
 */
function getOffset(
  map: StepMap,
  cellStep: CellStep,
  isDelete: boolean,
): number {
  if (isDelete) {
    return map.map(cellStep.from) - cellStep.from;
  }
  const [, oldSize, newSize] = getMapFromCellStep(cellStep, isDelete);
  return map.map(cellStep.from) - cellStep.from - (newSize - oldSize);
}

/**
 * Given a cell step, this function invert that step.
 * @param doc
 * @param getTableRectAndColumn
 * @param cellStep
 * @param isDelete
 * @param stepMap
 */
export function invertCellStep(
  doc: ProseMirrorNode,
  getTableRectAndColumn: () => { rect: TableRect; column: number },
  cellStep: CellStep,
  isDelete: boolean,
  stepMap: StepMap,
): CellStep {
  /**
   * We need a correct map when a cell is added
   * We need the normal map position minus the size of the cell you added it. Why?
   * Having a table 3x3 and we add a new column at 2 creates this ranges
   * [
   *  10, 0, 4,
   *  20, 0, 4,
   *  30, 0, 4,
   *  ]
   *  Where:
   *    * [10, 20, 30] are the original cell positions where we add the cells
   *    * [0, 0, 0] are the old size. We are adding new cells, so it's always zero
   *    * [4, 4, 4] are the new size. In this case, we are adding empty cell and has size 4, this will be different for prefill cells.
   *  In the document generated the cells that I want to delete (if I invert this step) are [10, 24, 38]
   *  this is calculated in the given way
   *    * Map the position using this step mapping function, this will return the cell in the next column
   *    * Remove the diff (4 - 0 in this case) of the current position.
   *  For a delete action this not happen, it will always return the right value
   */
  const offset = getOffset(stepMap, cellStep, isDelete);
  const newCellStepInfo: CellStep = {
    ...cellStep,

    // Map the position to position of the generated document
    from: cellStep.from + offset,
    to: cellStep.to + offset,
  };

  if (cellStep.mergeWith !== undefined) {
    newCellStepInfo.mergeWith = cellStep.mergeWith + offset;
  }

  if (isDelete) {
    // Add the removed cell as the new cell of the inverted step
    const removedCell = doc.nodeAt(cellStep.from)!;
    newCellStepInfo.newCell = removedCell.copy(removedCell.content);

    // When we delete a column we can end in a position that doesnt represent the right column.
    // This only happens on merged cell that ends in the deleted column.
    // We need to remap this position to the "next" cell (AKA cellStep.to)
    const { column, rect } = getTableRectAndColumn();
    if (column < rect.map.width) {
      const isAtTheEnd =
        rect.map.colCount(cellStep.from - rect.tableStart) +
          removedCell.attrs.colspan -
          1 ===
        column;
      if (cellStep.mergeWith !== undefined && isAtTheEnd) {
        newCellStepInfo.mergeWith = newCellStepInfo.from;
        newCellStepInfo.from = newCellStepInfo.to;
      }
    }
  }

  return newCellStepInfo;
}

/**
 * Create a cell step based on the current cell and operation (add/delete)
 * @param cell
 * @param column
 * @param isDelete
 * @param previousCellStep
 */
export function createCellStep(
  cell: Cell,
  column: number,
  isDelete: boolean,
  previousCellStep?: CellStep,
): CellStep {
  const newCellStepInfo: CellStep = {
    from: cell.from,
    to: cell.to,
  };

  if (cell.hasMergedCells) {
    // Check what column has to merge
    if (column !== cell.col || isDelete) {
      newCellStepInfo.mergeWith = cell.from;
    }
  }

  if (previousCellStep) {
    if (previousCellStep.mergeWith !== undefined) {
      newCellStepInfo.mergeWith = previousCellStep.mergeWith;
    }

    if (previousCellStep.newCell) {
      newCellStepInfo.newCell = previousCellStep.newCell;
    }
  }

  return newCellStepInfo;
}
