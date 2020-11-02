// #region Constants
import {
  findTable,
  goToNextCell as baseGotoNextCell,
} from '@atlaskit/editor-tables/utils';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { Direction } from '@atlaskit/editor-tables/types';
import { findParentNodeOfType } from 'prosemirror-utils';

import { Command } from '../../../types/command';
import { INPUT_METHOD } from '../../analytics/types';
import { insertRowWithAnalytics } from '../commands-with-analytics';

const TAB_FORWARD_DIRECTION = 1;
const TAB_BACKWARD_DIRECTION = -1;

export const goToNextCell = (direction: Direction): Command => (
  state,
  dispatch,
) => {
  const table = findTable(state.selection);
  if (!table) {
    return false;
  }

  const map = TableMap.get(table.node);
  const { tableCell, tableHeader } = state.schema.nodes;
  const cell = findParentNodeOfType([tableCell, tableHeader])(state.selection)!;
  const firstCellPos = map.positionAt(0, 0, table.node) + table.start;
  const lastCellPos =
    map.positionAt(map.height - 1, map.width - 1, table.node) + table.start;

  // when tabbing backwards at first cell (top left), insert row at the start of table
  if (firstCellPos === cell.pos && direction === TAB_BACKWARD_DIRECTION) {
    insertRowWithAnalytics(INPUT_METHOD.KEYBOARD, {
      index: 0,
      moveCursorToInsertedRow: true,
    })(state, dispatch);
    return true;
  }

  // when tabbing forwards at last cell (bottom right), insert row at the end of table
  if (lastCellPos === cell.pos && direction === TAB_FORWARD_DIRECTION) {
    insertRowWithAnalytics(INPUT_METHOD.KEYBOARD, {
      index: map.height,
      moveCursorToInsertedRow: true,
    })(state, dispatch);
    return true;
  }

  if (dispatch) {
    return baseGotoNextCell(direction)(state, dispatch);
  }

  return true;
};
