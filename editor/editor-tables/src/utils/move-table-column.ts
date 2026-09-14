import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { convertArrayOfRowsToTableNode } from './convert-array-of-rows-to-table-node';
import { convertTableNodeToArrayOfRows } from './convert-table-node-to-array-of-rows';
import { moveRowInArrayOfRows } from './move-row-in-array-of-rows';
import { transpose } from './transpose';

export const moveTableColumn = (
	table: NodeWithPos,
	indexesOrigin: number[],
	indexesTarget: number[],
	direction: number,
): PMNode => {
	let rows = transpose(convertTableNodeToArrayOfRows(table.node));

	rows = moveRowInArrayOfRows(rows, indexesOrigin, indexesTarget, direction);
	rows = transpose(rows);

	return convertArrayOfRowsToTableNode(table.node, rows);
};
