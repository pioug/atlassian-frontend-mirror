import type {
  NodeType,
  Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';
import type { CloneOptions } from '../types';

import { determineTableHeaderStateFromTableNode } from './analyse-table';
import { cloneTr } from './clone-tr';
import { findTable } from './find';
import { getSelectionRangeInRow } from './get-selection-range-in-row';
import { isValidReorder } from './reorder-utils';
import type { TableNodeCache } from './table-node-types';
import { tableNodeTypes } from './table-node-types';

function normalizeDirection(
  targetDirection: 'start' | 'end',
  options?: CloneOptions,
): 'start' | 'end' {
  const override = (options?.direction ?? 0) < 0 ? 'start' : 'end';
  return options?.tryToFit && !!options?.direction ? override : targetDirection;
}

export const cloneRow =
  (
    state: EditorState,
    originRowIndex: number | number[],
    targetRowIndex: number,
    targetDirection: 'start' | 'end',
    options: CloneOptions = {
      tryToFit: false,
      direction: 0,
      selectAfterClone: false,
    },
  ) =>
  (tr: Transaction): Transaction => {
    const table = findTable(tr.selection);
    if (!table) {
      return tr;
    }

    // normalize the origin index to an array since move row support moving both a single & multiple rows in a single action.
    if (!Array.isArray(originRowIndex)) {
      originRowIndex = [originRowIndex];
    }

    const tableMap = TableMap.get(table.node);
    const [originMin, originMax] = originRowIndex.reduce(
      ([min, max], cur) => [Math.min(min, cur), Math.max(max, cur)],
      [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
    );

    const originalRowRanges = getSelectionRangeInRow(originMin, originMax)(tr);
    const targetRowRanges = getSelectionRangeInRow(targetRowIndex)(tr);
    const indexesOriginRow = originalRowRanges?.indexes || [];
    const indexesTargetRow = targetRowRanges?.indexes || [];

    if (
      originMin < 0 ||
      originMin === Number.MAX_SAFE_INTEGER ||
      originMax >= tableMap.height ||
      originMax === Number.MIN_SAFE_INTEGER
    ) {
      return tr;
    }

    if (!options.tryToFit && indexesTargetRow.length > 1) {
      isValidReorder(originMin, targetRowIndex, indexesTargetRow, 'row');
    }

    const types = tableNodeTypes(state.schema);
    const direction = normalizeDirection(targetDirection, options);

    const actualTargetIndex = Math[direction === 'start' ? 'min' : 'max'](
      ...indexesTargetRow,
    );

    const originPositions = indexesOriginRow.map(
      (index) => tableMap.positionAt(index, 0, table.node) + table.pos,
    );

    const originNodes = originPositions.reduce<{ pos: number; node: PMNode }[]>(
      (acc, pos) => {
        const node = tr.doc.nodeAt(tr.mapping.map(pos));
        if (node) {
          return [...acc, { pos, node }];
        }
        return acc;
      },
      [],
    );

    const targetPos =
      tableMap.positionAt(actualTargetIndex, 0, table.node) + table.pos;
    const targetNode = tr.doc.nodeAt(tr.mapping.map(targetPos));

    if (originNodes?.length && targetNode) {
      const newTr = cloneTr(tr);

      const { rowHeaderEnabled, columnHeaderEnabled } =
        determineTableHeaderStateFromTableNode(table.node, tableMap, types);

      if (
        rowHeaderEnabled &&
        actualTargetIndex === 0 &&
        direction === 'start'
      ) {
        // This block is handling the situation where a row is moved in/out of the header position. If the header row option
        // is enabled then;
        // When a row is moved out, the row will be converted to a normal row and the row below it will become the header.
        // When a row is moved in, the old row header needs to be made normal, and the incoming row needs to be made a header.
        // This section only manages what happens to the other row, no the one being moved.
        const nearHeaderPos =
          tableMap.positionAt(
            originMin === 0 ? originMax + 1 : actualTargetIndex,
            0,
            table.node,
          ) + table.pos;
        const nearHeaderNode = newTr.doc.nodeAt(
          newTr.mapping.map(nearHeaderPos),
        );

        if (nearHeaderNode) {
          nearHeaderNode.forEach((node, offset, index) => {
            const start = newTr.mapping.map(nearHeaderPos + 1 + offset);
            newTr.setNodeMarkup(
              start,
              actualTargetIndex !== 0 || (columnHeaderEnabled && index === 0)
                ? types.header_cell
                : types.cell,
              node.attrs,
            );
          });
        }
      }

      const insertPos =
        direction === 'end'
          ? newTr.mapping.map(targetPos + targetNode.nodeSize, 1)
          : newTr.mapping.map(targetPos, -1);

      newTr.insert(
        insertPos,
        originNodes.map(({ node }, index) =>
          normalizeRowNode(
            node,
            rowHeaderEnabled &&
              actualTargetIndex === 0 &&
              index === 0 &&
              direction === 'start',
            columnHeaderEnabled,
            types,
          ),
        ),
      );

      if (options.selectAfterClone) {
        const offset = direction === 'end' ? 1 : 0;
        const selectionRange = getSelectionRangeInRow(
          actualTargetIndex + offset,
          actualTargetIndex + offset + originNodes.length - 1,
        )(newTr);

        if (selectionRange) {
          newTr.setSelection(
            new CellSelection(selectionRange.$anchor, selectionRange.$head),
          );
        }
      }

      return newTr;
    }

    return tr;
  };

/**
 * This ensures the row node cell type correctly reflect what they should be.
 * @returns A copy of the rowNode
 */
function normalizeRowNode(
  rowNode: PMNode,
  rowHeaderEnabled: boolean,
  columnHeaderEnabled: boolean,
  types: TableNodeCache,
): PMNode {
  let content: PMNode[] = [];
  rowNode.forEach((node: PMNode, offset: number, index: number) => {
    const newTargetType: NodeType =
      rowHeaderEnabled || (columnHeaderEnabled && index === 0)
        ? types.header_cell
        : types.cell;
    content.push(
      node.type !== newTargetType
        ? newTargetType.create(node.attrs, node.content, node.marks)
        : node,
    );
  });

  return rowNode.type.create(rowNode.attrs, content, rowNode.marks);
}
