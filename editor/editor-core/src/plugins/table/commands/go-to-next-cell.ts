// #region Constants
import { goToNextCell as baseGotoNextCell, TableMap } from 'prosemirror-tables';
import { findParentNodeOfType, findTable } from 'prosemirror-utils';

import { Command } from '../../../types/command';
import { INPUT_METHOD } from '../../analytics/types';
import { insertRowWithAnalytics } from '../commands-with-analytics';

const TAB_FORWARD_DIRECTION = 1;
const TAB_BACKWARD_DIRECTION = -1;

export const goToNextCell = (direction: number): Command => (
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

  if (firstCellPos === cell.pos && direction === TAB_BACKWARD_DIRECTION) {
    insertRowWithAnalytics(INPUT_METHOD.KEYBOARD, {
      index: 0,
      moveCursorToInsertedRow: true,
    })(state, dispatch);
    return true;
  }

  if (lastCellPos === cell.pos && direction === TAB_FORWARD_DIRECTION) {
    insertRowWithAnalytics(INPUT_METHOD.KEYBOARD, {
      index: map.height,
      moveCursorToInsertedRow: true,
    })(state, dispatch);
    return true;
  }

  return baseGotoNextCell(direction)(state, dispatch);
};
