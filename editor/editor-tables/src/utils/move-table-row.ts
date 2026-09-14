import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { convertArrayOfRowsToTableNode } from './convert-array-of-rows-to-table-node';
import { convertTableNodeToArrayOfRows } from './convert-table-node-to-array-of-rows';
import { moveRowInArrayOfRows } from './move-row-in-array-of-rows';

export const moveTableRow = (
	table: NodeWithPos,
	indexesOrigin: number[],
	indexesTarget: number[],
	direction: number,
): PMNode => {
	let rows = convertTableNodeToArrayOfRows(table.node);

	rows = moveRowInArrayOfRows(rows, indexesOrigin, indexesTarget, direction);

	return convertArrayOfRowsToTableNode(table.node, rows);
};
