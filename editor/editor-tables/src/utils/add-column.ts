import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { TableContext } from '../table-map';
import type { CellAttributes, CellAttributesWithColSpan } from '../types';
import { addColSpan } from './add-col-span';
import { assertColspan } from './assert-colspan';
import { columnIsHeader } from './column-is-header';
import { tableNodeTypes } from './table-node-types';

// eslint-disable-next-line @atlaskit/editor/no-re-export -- Preserve the existing public entry-point API.
export { columnIsHeader } from './column-is-header';

// Add a column at the given position in a table.
export function addColumn(
	tr: Transaction,
	{ map, tableStart, table }: TableContext,
	col: number,
): Transaction {
	let refColumn: number | null = col > 0 ? -1 : 0;
	if (columnIsHeader(map, table, col + refColumn)) {
		refColumn = col === 0 || col === map.width ? null : 0;
	}

	for (let row = 0; row < map.height; row++) {
		const index = row * map.width + col;

		// If this position falls inside a col-spanning cell
		if (col > 0 && col < map.width && map.map[index - 1] === map.map[index]) {
			const pos = map.map[index];
			const cell = table.nodeAt(pos);
			if (!cell) {
				throw new Error(`addColumn: invalid cell for pos ${pos}`);
			}
			const attributes = cell.attrs;
			assertColspan(attributes);

			tr.setNodeMarkup(
				tr.mapping.map(tableStart + pos),
				undefined,
				addColSpan(attributes as CellAttributesWithColSpan, col - map.colCount(pos)),
			);
			// Skip ahead if rowspan > 1
			row += attributes.rowspan - 1;
		} else {
			let type: NodeType;
			let attrs: CellAttributes = {};
			if (refColumn === null) {
				type = tableNodeTypes(table.type.schema).cell;
			} else {
				const mappedPos = map.map[index + refColumn];
				const cell = table.nodeAt(mappedPos);
				if (!cell) {
					throw new Error(`addColumn: invalid node at mapped pos ${mappedPos}`);
				}
				type = cell.type;
				if (cell.attrs.background) {
					attrs = { background: cell.attrs.background };
				}
			}
			const pos = map.positionAt(row, col, table);
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			tr.insert(tr.mapping.map(tableStart + pos), type.createAndFill(attrs)!);
		}
	}

	return tr;
}
