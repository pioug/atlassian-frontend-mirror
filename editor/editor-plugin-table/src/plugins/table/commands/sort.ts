import { Node as PMNode } from 'prosemirror-model';
import { EditorState, Selection, Transaction } from 'prosemirror-state';

import { CardAttributes, DataType, UrlType } from '@atlaskit/adf-schema';
import {
  TableSortOrder as SortOrder,
  TableSortStep,
} from '@atlaskit/adf-schema/steps';
import { Command } from '@atlaskit/editor-common/types';
import { createCompareNodes } from '@atlaskit/editor-common/utils';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  convertArrayOfRowsToTableNode,
  convertTableNodeToArrayOfRows,
  findCellRectClosestToPos,
  findTable,
  getSelectionRect,
  isSelectionType,
} from '@atlaskit/editor-tables/utils';

import { createCommand, getPluginState } from '../pm-plugins/plugin-factory';
import { TablePluginState } from '../types';

const createGetInlineCardTextFromStore = (
  attrs: CardAttributes,
): string | null => {
  const { data } = attrs as DataType;
  if (data && ((data as any).name || (data as any).title)) {
    return (data as any).name || (data as any).title;
  }

  const { url: cardUrl } = attrs as UrlType;
  return cardUrl;
};

export const sortByColumn = (
  columnIndex: number,
  order: SortOrder = SortOrder.DESC,
): Command =>
  createCommand(
    () => ({
      type: 'SORT_TABLE',
      data: {
        ordering: {
          columnIndex,
          order,
        },
      },
    }),
    (tr: Transaction, state: EditorState) => {
      const table = findTable(tr.selection)!;
      if (!table || !table.node) {
        return tr;
      }

      const selectionRect = isSelectionType(tr.selection, 'cell')
        ? getSelectionRect(tr.selection)!
        : findCellRectClosestToPos(tr.selection.$from);

      if (!selectionRect) {
        return tr;
      }

      const tablePluginState: TablePluginState = getPluginState(state);
      const tableArray = convertTableNodeToArrayOfRows(table.node);

      let headerRow;
      if (tablePluginState.isHeaderRowEnabled) {
        headerRow = tableArray.shift();
      }
      const compareNodesInOrder = createCompareNodes(
        {
          getInlineCardTextFromStore: createGetInlineCardTextFromStore,
        },
        order,
      );

      const sortedTable = tableArray.sort(
        (rowA: Array<PMNode | null>, rowB: Array<PMNode | null>) =>
          compareNodesInOrder(rowA[columnIndex], rowB[columnIndex]),
      );

      if (headerRow) {
        sortedTable.unshift(headerRow);
      }

      const newTableNode = convertArrayOfRowsToTableNode(
        table.node,
        sortedTable,
      );

      tr.replaceWith(table.pos, table.pos + table.node.nodeSize, newTableNode);

      const pos = TableMap.get(table.node).positionAt(
        selectionRect.top,
        columnIndex,
        table.node,
      );

      const prev = tablePluginState.ordering;
      const next = {
        columnIndex,
        order,
      };

      tr.step(new TableSortStep(table.pos, prev, next));
      return tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos)));
    },
  );
