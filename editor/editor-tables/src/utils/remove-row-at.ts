import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { TableMap } from '../table-map';
import { cloneTr } from './clone-tr';
import { findTable } from './find-table';
import { removeRow } from './remove-row';
import { removeTable } from './remove-table';

// Returns a new transaction that removes a row at index `rowIndex`. If there is only one row left, it will remove the entire table.
export const removeRowAt =
	(rowIndex: number) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		if (table) {
			const map = TableMap.get(table.node);
			if (rowIndex === 0 && map.height === 1) {
				return removeTable(tr);
			} else if (rowIndex >= 0 && rowIndex <= map.height) {
				removeRow(
					tr,
					{
						map,
						tableStart: table.start,
						table: table.node,
					},
					rowIndex,
				);
				return cloneTr(tr);
			}
		}

		return tr;
	};
