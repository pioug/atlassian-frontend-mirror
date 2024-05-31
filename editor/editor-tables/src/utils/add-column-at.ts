import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { TableMap } from '../table-map';

import { addColumn } from './add-column';
import { cloneTr } from './clone-tr';
import { findTable } from './find';

// Returns a new transaction that adds a new column at index `columnIndex`.
export const addColumnAt =
	(columnIndex: number, isCellBackgroundDuplicated?: boolean) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		if (table) {
			const map = TableMap.get(table.node);
			if (columnIndex >= 0 && columnIndex <= map.width) {
				return cloneTr(
					addColumn(
						tr,
						{
							map,
							tableStart: table.start,
							table: table.node,
						},
						columnIndex,
						isCellBackgroundDuplicated,
					),
				);
			}
		}

		return tr;
	};
