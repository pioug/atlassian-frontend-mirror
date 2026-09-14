import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { cellAround } from './cell-around';
import { cellNear } from './cell-near';
import { isSelectionType } from './is-selection-type';

export function selectionCell(selection: Selection): ResolvedPos | null {
	if (isSelectionType(selection, 'cell')) {
		return selection.$anchorCell.pos > selection.$headCell.pos
			? selection.$anchorCell
			: selection.$headCell;
	}

	if (isSelectionType(selection, 'node') && selection.node.type.spec.tableRole === 'cell') {
		return selection.$anchor;
	}

	return cellAround(selection.$head) || cellNear(selection.$head);
}
