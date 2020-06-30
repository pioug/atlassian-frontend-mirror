import { splitCellWithType } from 'prosemirror-tables';

import { Command } from '../../../types/command';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { TablePluginState } from '../types';

/**
 * We need to split cell keeping the right type of cell given current table configuration.
 * We are using prosemirror-tables splitCellWithType that allows you to choose what cell type should be.
 */
export const splitCell: Command = (state, dispatch) => {
  const tableState: TablePluginState = getPluginState(state);
  const { tableHeader, tableCell } = state.schema.nodes;
  return splitCellWithType(({ row, col }: { row: number; col: number }) => {
    if (
      (row === 0 && tableState.isHeaderRowEnabled) ||
      (col === 0 && tableState.isHeaderColumnEnabled)
    ) {
      return tableHeader;
    }

    return tableCell;
  })(state, dispatch);
};
