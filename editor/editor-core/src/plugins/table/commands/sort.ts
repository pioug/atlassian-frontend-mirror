import { Selection, EditorState, Transaction } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';
import {
  findTable,
  convertTableNodeToArrayOfRows,
  convertArrayOfRowsToTableNode,
  isCellSelection,
  getSelectionRect,
  findCellRectClosestToPos,
} from 'prosemirror-utils';
import { createCompareNodes } from '@atlaskit/editor-common';

import { TablePluginState, SortOrder } from '../types';
import { TableSortStep } from '../utils';
import { Command } from '../../../types';
import { TableMap } from 'prosemirror-tables';
import { pluginKey } from '../../card/pm-plugins/main';
import { CardPluginState } from '../../card/types';
import { CardAttributes, UrlType } from '@atlaskit/adf-schema';
import { createCommand, getPluginState } from '../pm-plugins/plugin-factory';

function createGetInlineCardTextFromStore(state: EditorState) {
  const cardState = pluginKey.getState(state) as CardPluginState | undefined;
  if (!cardState) {
    // If not card state, return null always
    return () => null;
  }
  return (attrs: CardAttributes): string | null => {
    const { url: cardUrl } = attrs as UrlType;
    if (cardUrl) {
      const card = cardState.cards.find(({ url }) => url === cardUrl);
      if (card && card.title) {
        return card.title;
      }
    }

    return null;
  };
}

export const sortByColumn = (
  columnIndex: number,
  order: SortOrder = SortOrder.DESC,
): Command =>
  createCommand(
    state => ({
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

      const selectionRect = isCellSelection(tr.selection)
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
          getInlineCardTextFromStore: createGetInlineCardTextFromStore(state),
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

      tr.steps.push(new TableSortStep(table.pos, prev, next));
      return tr.setSelection(Selection.near(tr.doc.resolve(table.start + pos)));
    },
  );
