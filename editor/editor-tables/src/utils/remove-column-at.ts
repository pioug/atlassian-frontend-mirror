import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { TableMap } from '../table-map';
import { cloneTr } from './clone-tr';
import { findTable } from './find-table';
import { removeColumn } from './remove-column';
import { removeTable } from './remove-table';

// Returns a new transaction that removes a column at index `columnIndex`. If there is only one column left, it will remove the entire table.
export const removeColumnAt =
	(columnIndex: number) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		if (table) {
			const map = TableMap.get(table.node);
			if (columnIndex === 0 && map.width === 1) {
				return removeTable(tr);
			} else if (columnIndex >= 0 && columnIndex <= map.width) {
				removeColumn(
					tr,
					{
						map,
						tableStart: table.start,
						table: table.node,
					},
					columnIndex,
				);
				return cloneTr(tr);
			}
		}

		return tr;
	};
