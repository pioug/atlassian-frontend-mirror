import type { Command } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { cellWrapping, splitCellWithType } from '@atlaskit/editor-tables/utils';

import type { TablePluginState } from '../../types';
import { getPluginState } from '../plugin-factory';

export const canSplitCellSelection = (selection: Selection): boolean => {
	let cellNode: PMNode | null | undefined;

	if (!(selection instanceof CellSelection)) {
		cellNode = cellWrapping(selection.$from);
		if (!cellNode) {
			return false;
		}
	} else {
		if (selection.$anchorCell.pos !== selection.$headCell.pos) {
			return false;
		}
		cellNode = selection.$anchorCell.nodeAfter;
	}

	return Boolean(cellNode && (cellNode.attrs.colspan !== 1 || cellNode.attrs.rowspan !== 1));
};

/**
 * We need to split cell keeping the right type of cell given current table configuration.
 * We are using editor-tables splitCellWithType that allows you to choose what cell type should be.
 */
export const splitCell: Command = (state, dispatch) => {
	const tableState: TablePluginState = getPluginState(state);
	const { tableHeader, tableCell } = state.schema.nodes;
	if (dispatch) {
		return splitCellWithType(({ row, col }: { col: number; row: number }) => {
			if (
				(row === 0 && tableState.isHeaderRowEnabled) ||
				(col === 0 && tableState.isHeaderColumnEnabled)
			) {
				return tableHeader;
			}

			return tableCell;
		})(state, dispatch);
	}

	return true;
};
