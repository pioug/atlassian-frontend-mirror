import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { setTextSelection } from '@atlaskit/editor-prosemirror/utils';

import { findCellRectClosestToPos } from './find-cell-rect-closest-to-pos';
import { removeColumnAt } from './remove-column-at';

// Returns a new transaction that removes a column closest to a given `$pos`.
export const removeColumnClosestToPos =
	($pos: ResolvedPos) =>
	(tr: Transaction): Transaction => {
		const rect = findCellRectClosestToPos($pos);
		if (rect) {
			return removeColumnAt(rect.left)(setTextSelection($pos.pos)(tr));
		}
		return tr;
	};
