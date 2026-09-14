import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { setTextSelection } from '@atlaskit/editor-prosemirror/utils';

import { findCellRectClosestToPos } from './find-cell-rect-closest-to-pos';
import { removeRowAt } from './remove-row-at';

// Returns a new transaction that removes a row closest to a given `$pos`.
export const removeRowClosestToPos =
	($pos: ResolvedPos) =>
	(tr: Transaction): Transaction => {
		const rect = findCellRectClosestToPos($pos);
		if (rect) {
			return removeRowAt(rect.top)(setTextSelection($pos.pos)(tr));
		}
		return tr;
	};
