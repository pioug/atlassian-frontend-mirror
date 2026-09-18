import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { cloneTr } from './clone-tr';
import { getTableSelectionClosesToPos } from './get-table-selection-closes-to-pos';

export const selectTableClosestToPos = (tr: Transaction, $pos: ResolvedPos): Transaction => {
	const tableSelection = getTableSelectionClosesToPos($pos);
	if (tableSelection) {
		return cloneTr(tr.setSelection(tableSelection));
	}

	return tr;
};
