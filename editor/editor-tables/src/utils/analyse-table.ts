import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TableMap } from '../table-map';

import type { TableNodeCache } from './table-node-types';

export function determineTableHeaderStateFromTableNode(
	table: PMNode,
	tableMap: TableMap,
	types: TableNodeCache,
): {
	rowHeaderEnabled: boolean;
	columnHeaderEnabled: boolean;
} {
	// We only really need to check the 2nd cell in the row/col if it's a header, since we only support a single full row/col header on the top & left
	// of a table. We can assume that if the 2nd cell is a header then the entire row/col is a header.
	// Be carefull though! when checking the 1st cell as it shares its header state with both row/cols.
	// This means we wont be able to reliably identify header state on tables smaller the 2x2, however we can do best guess.

	// This is a 3 bit mask;
	// bit: 0 = Identifies if the cell at (0, 0) (row, col - 0-based) is a header cell or not
	// bit: 1 = Identifies if the cell at (0, 1) is a header cell or not
	// bit: 2 = Identifies if the cell at (1, 0) is a header cell or not
	let mask = 0;

	// At minimum we should have 1 cell in the table.
	const topLeftCell = table.nodeAt(tableMap.map[0]);
	// If this cell is a header that could indicate
	mask |= topLeftCell && topLeftCell.type === types.header_cell ? 1 : 0;

	if (tableMap.width > 1) {
		const cell = table.nodeAt(tableMap.map[1]);
		// If the cell at (0, 1) is a header then we set the bit flag to indicate row headers are enabled, otherwise if it's
		// not then we will set the col headers enabled flag (and vice versa in the branch below) only if the cell at (0,0)
		// was a header cell.
		mask |= cell && cell.type === types.header_cell ? 2 : 4 * (mask & 1);
	}

	if (tableMap.height > 1) {
		const cell = table.nodeAt(tableMap.map[tableMap.width]);
		mask |= cell && cell.type === types.header_cell ? 4 : 2 * (mask & 1);
	}

	return {
		rowHeaderEnabled: mask === 7 || mask === 3,
		columnHeaderEnabled: mask === 7 || mask === 5,
	};
}
