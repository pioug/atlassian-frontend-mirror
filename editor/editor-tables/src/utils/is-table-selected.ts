import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { TableMap } from '../table-map';
import { isRectSelected } from './is-rect-selected';
import { isSelectionType } from './is-selection-type';

// Checks if entire table is selected
export const isTableSelected = (selection: Selection): boolean => {
	if (isSelectionType(selection, 'cell')) {
		const map = TableMap.get(selection.$anchorCell.node(-1));
		return isRectSelected({
			left: 0,
			right: map.width,
			top: 0,
			bottom: map.height,
		})(selection);
	}

	return false;
};
