import type { Selection } from '@atlaskit/editor-prosemirror/state';

import type { Rect } from '../rect';
import { TableMap } from '../table-map';
import { isSelectionType } from './is-selection-type';

// Checks if a given CellSelection rect is selected
export const isRectSelected =
	(rect: Rect) =>
	(selection: Selection): boolean => {
		if (!isSelectionType(selection, 'cell')) {
			return false;
		}

		const map = TableMap.get(selection.$anchorCell.node(-1));
		const start = selection.$anchorCell.start(-1);
		const cells = map.cellsInRect(rect);
		const selectedCells = map.cellsInRect(
			map.rectBetween(selection.$anchorCell.pos - start, selection.$headCell.pos - start),
		);

		for (let i = 0, count = cells.length; i < count; i++) {
			if (selectedCells.indexOf(cells[i]) === -1) {
				return false;
			}
		}

		return true;
	};
