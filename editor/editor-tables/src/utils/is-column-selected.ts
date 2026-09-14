import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { TableMap } from '../table-map';
import { isRectSelected } from './is-rect-selected';
import { isSelectionType } from './is-selection-type';

// Checks if entire column at index `columnIndex` is selected.
export const isColumnSelected =
	(columnIndex: number) =>
	(selection: Selection): boolean => {
		if (isSelectionType(selection, 'cell')) {
			const map = TableMap.get(selection.$anchorCell.node(-1));
			return isRectSelected({
				left: columnIndex,
				right: columnIndex + 1,
				top: 0,
				bottom: map.height,
			})(selection);
		}

		return false;
	};
