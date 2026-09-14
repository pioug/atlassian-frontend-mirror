import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { TableMap } from '../table-map';
import { isRectSelected } from './is-rect-selected';
import { isSelectionType } from './is-selection-type';

// Checks if entire row at index `rowIndex` is selected.
export const isRowSelected =
	(rowIndex: number) =>
	(selection: Selection): boolean => {
		if (isSelectionType(selection, 'cell')) {
			const map = TableMap.get(selection.$anchorCell.node(-1));
			return isRectSelected({
				left: 0,
				right: map.width,
				top: rowIndex,
				bottom: rowIndex + 1,
			})(selection);
		}

		return false;
	};
