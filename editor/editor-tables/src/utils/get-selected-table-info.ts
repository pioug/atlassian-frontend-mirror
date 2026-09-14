import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { TableMap } from '../table-map';
import { findTable } from './find-table';

export function getSelectedTableInfo(selection: Selection): {
	map: TableMap | undefined;
	table: ReturnType<typeof findTable> | undefined;
	totalColumnCount: number;
	totalRowCount: number;
} {
	let map;
	let totalRowCount = 0;
	let totalColumnCount = 0;

	const table = findTable(selection);
	if (table) {
		map = TableMap.get(table.node);
		totalRowCount = map.height;
		totalColumnCount = map.width;
	}

	return {
		table,
		map,
		totalRowCount,
		totalColumnCount,
	};
}
