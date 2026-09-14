import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';
import { cloneTr } from './clone-tr';
import { findTable } from './find-table';

// Returns a new transaction that selects a table.
export const selectTable = (tr: Transaction): Transaction => {
	const table = findTable(tr.selection);
	if (table) {
		const { map } = TableMap.get(table.node);
		if (map && map.length) {
			const head = table.start + map[0];
			const anchor = table.start + map[map.length - 1];
			const $head = tr.doc.resolve(head);
			const $anchor = tr.doc.resolve(anchor);

			return cloneTr(tr.setSelection(new CellSelection($anchor, $head)));
		}
	}

	return tr;
};
