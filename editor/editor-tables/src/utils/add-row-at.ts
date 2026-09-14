import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { TableMap } from '../table-map';
import { addRow } from './add-row';
import { cloneRowAt } from './clone-row-at';
import { cloneTr } from './clone-tr';
import { findTable } from './find-table';

// Returns a new transaction that adds a new row at index `rowIndex`. Optionally clone the previous row.
export const addRowAt =
	(rowIndex: number, clonePreviousRow?: boolean) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		if (table) {
			const map = TableMap.get(table.node);
			const cloneRowIndex = rowIndex - 1;

			if (clonePreviousRow && cloneRowIndex >= 0) {
				return cloneTr(cloneRowAt(cloneRowIndex)(tr));
			}

			if (rowIndex >= 0 && rowIndex <= map.height) {
				return cloneTr(
					addRow(
						tr,
						{
							map,
							tableStart: table.start,
							table: table.node,
						},
						rowIndex,
					),
				);
			}
		}

		return tr;
	};
