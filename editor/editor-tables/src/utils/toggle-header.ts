import { type NodeType } from '@atlaskit/editor-prosemirror/model';

import { Rect } from '../table-map';
import { type Command } from '../types';

import { selectedRect, type SelectionRect } from './selection-rect';
import { type TableNodeCache, tableNodeTypes } from './table-node-types';
import { isInTable } from './tables';

export type ToggleType = 'column' | 'row';

export function isHeaderEnabledByType(
	type: ToggleType,
	rect: SelectionRect,
	types: TableNodeCache,
): boolean {
	// Get cell positions for first row or first column
	const cellPositions = rect.map.cellsInRect({
		left: 0,
		top: 0,
		right: type === 'row' ? rect.map.width : 1,
		bottom: type === 'column' ? rect.map.height : 1,
	});

	for (let i = 0; i < cellPositions.length; i++) {
		const cell = rect.table.nodeAt(cellPositions[i]);
		if (cell && cell.type !== types.header_cell) {
			return false;
		}
	}

	return true;
}

// Toggles between row/column header and normal cells (Only applies to first row/column).
export function toggleHeader(type: ToggleType): Command {
	return function (state, dispatch) {
		if (!isInTable(state)) {
			return false;
		}
		if (dispatch) {
			const types = tableNodeTypes(state.schema);
			const rect = selectedRect(state),
				tr = state.tr;

			const isHeaderRowEnabled = isHeaderEnabledByType('row', rect, types);
			const isHeaderColumnEnabled = isHeaderEnabledByType('column', rect, types);

			const isHeaderEnabled =
				type === 'column' ? isHeaderRowEnabled : type === 'row' ? isHeaderColumnEnabled : false;

			const selectionStartsAt = isHeaderEnabled ? 1 : 0;

			const cellsRect: Rect =
				type === 'column'
					? new Rect(0, selectionStartsAt, 1, rect.map.height)
					: type === 'row'
						? new Rect(selectionStartsAt, 0, rect.map.width, 1)
						: rect;

			let newType: NodeType;

			if (type === 'column') {
				newType = isHeaderColumnEnabled ? types.cell : types.header_cell;
			} else if (type === 'row') {
				newType = isHeaderRowEnabled ? types.cell : types.header_cell;
			} else {
				newType = types.cell;
			}

			rect.map.cellsInRect(cellsRect).forEach((relativeCellPos) => {
				const cellPos = relativeCellPos + rect.tableStart;
				const cell = tr.doc.nodeAt(cellPos);

				if (cell) {
					tr.setNodeMarkup(cellPos, newType, cell.attrs);
				}
			});

			dispatch(tr);
		}
		return true;
	};
}
