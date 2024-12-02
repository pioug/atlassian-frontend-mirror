import { type ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { type Transaction } from '@atlaskit/editor-prosemirror/state';

import { MIN_LAYOUT_COLUMN } from './consts';
import { updateColumnWidths } from './update-column-widths';

export const removeFromSource = (tr: Transaction, $from: ResolvedPos) => {
	const sourceNode = $from.nodeAfter;
	const sourceParent = $from.parent;

	if (!sourceNode) {
		return tr;
	}

	const sourceNodeEndPos = $from.pos + sourceNode.nodeSize;

	if (sourceNode.type.name === 'layoutColumn') {
		if (sourceParent.childCount === MIN_LAYOUT_COLUMN) {
			tr.delete($from.pos + 1, sourceNodeEndPos - 1);
			return tr;
		} else {
			updateColumnWidths(tr, $from.parent, $from.before($from.depth), sourceParent.childCount - 1);
		}
	}

	tr.delete($from.pos, sourceNodeEndPos);
	return tr;
};
