import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TableMap } from '../table-map';
import { tableNodeTypes } from './table-node-types';

export function columnIsHeader(map: TableMap, table: PMNode, col: number): boolean {
	const headerCell = tableNodeTypes(table.type.schema).header_cell;
	for (let row = 0; row < map.height; row++) {
		const cell = table.nodeAt(map.map[col + row * map.width]);
		if (cell && cell.type !== headerCell) {
			return false;
		}
	}

	return true;
}
