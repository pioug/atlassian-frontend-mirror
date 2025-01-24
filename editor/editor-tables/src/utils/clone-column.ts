import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { CellSelection } from '../cell-selection';
import { TableMap } from '../table-map';
import type { CloneOptions } from '../types';

import { determineTableHeaderStateFromTableNode } from './analyse-table';
import { cloneTr } from './clone-tr';
import { findTable } from './find';
import { getSelectionRangeInColumn } from './get-selection-range-in-column';
import { isValidReorder } from './reorder-utils';
import type { TableNodeCache } from './table-node-types';
import { tableNodeTypes } from './table-node-types';

function normalizeDirection(
	targetDirection: 'start' | 'end',
	options?: CloneOptions,
): 'start' | 'end' {
	const override = (options?.direction ?? 0) < 0 ? 'start' : 'end';
	return options?.tryToFit && !!options?.direction ? override : targetDirection;
}

export const cloneColumn =
	(
		state: EditorState,
		originColumnIndex: number | number[],
		targetColumnIndex: number,
		targetDirection: 'start' | 'end',
		options: CloneOptions = {
			tryToFit: false,
			direction: 0,
			selectAfterClone: false,
		},
	) =>
	(tr: Transaction): Transaction => {
		const table = findTable(tr.selection);
		if (!table) {
			return tr;
		}

		// normalize the origin index to an array since this supports moving both a single & multiple cols in a single action.
		if (!Array.isArray(originColumnIndex)) {
			originColumnIndex = [originColumnIndex];
		}

		const tableMap = TableMap.get(table.node);
		const originalColumnRanges = getSelectionRangeInColumn(
			Math.min(...originColumnIndex),
			Math.max(...originColumnIndex),
		)(tr);
		const targetColumnRanges = getSelectionRangeInColumn(targetColumnIndex)(tr);
		const indexesOriginColumn = originalColumnRanges?.indexes ?? [];
		const indexesTargetColumn = targetColumnRanges?.indexes ?? [];

		const min = indexesOriginColumn[0];
		const max = indexesOriginColumn[indexesOriginColumn.length - 1];

		if (!options.tryToFit && indexesTargetColumn.length > 1) {
			isValidReorder(originColumnIndex[0], targetColumnIndex, indexesTargetColumn, 'column');
		}

		const types = tableNodeTypes(state.schema);
		const direction = normalizeDirection(targetDirection, options);
		const actualTargetIndex = Math[direction === 'start' ? 'min' : 'max'](...indexesTargetColumn);

		const { rowHeaderEnabled, columnHeaderEnabled } = determineTableHeaderStateFromTableNode(
			table.node,
			tableMap,
			types,
		);

		const createContentNode = createContentNodeFactory(table);

		const newTr = cloneTr(tr);
		const origins: ContentNodeWithPos[][] = [];
		for (let y = 0; y < tableMap.height; y++) {
			origins.push([]);

			for (let x = min; x <= max; x++) {
				if (tableMap.isCellMergedTopLeft(y, x)) {
					continue;
				}
				const nodePos = tableMap.map[y * tableMap.width + x];
				origins[y].push(createContentNode(nodePos));
			}

			if (columnHeaderEnabled && actualTargetIndex === 0 && direction === 'start') {
				// This block is handling the situation where a col is moved in/out of the header position. If the header col option
				// is enabled then;
				// When a col is moved out, the col will be converted to a normal col and the col to the right will become the header.
				// When a col is moved in, the old col header needs to be made normal, and the incoming col needs to be made a header.
				// This section only manages what happens to the other col, not the one being moved.
				const nearHeaderCol = min === 0 ? max + 1 : actualTargetIndex;
				const nodePos = tableMap.map[y * tableMap.width + nearHeaderCol];
				const { pos, node } = createContentNode(nodePos);
				newTr.setNodeMarkup(
					pos,
					actualTargetIndex !== 0 || (rowHeaderEnabled && y === 0) ? types.header_cell : types.cell,
					node.attrs,
				);
			}
		}

		origins.forEach((row, y) => {
			if (!row.length) {
				// If the origin has no cells to be moved then we can skip moving for this row. This can occur when a cell above rowspans
				// into the current row.
				return;
			}

			// The actual target index needs to be translated per row, this is because row/col spans can affect the amount of
			// cells each row contains.
			const rowTargetPosition = translateTargetPosition(y, actualTargetIndex, tableMap);
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const node = table.node.nodeAt(rowTargetPosition)!;
			const pos = table.start + rowTargetPosition;

			const insertPos =
				direction === 'end'
					? newTr.mapping.map(pos + node.nodeSize, 1)
					: newTr.mapping.map(pos, -1);

			return newTr.insert(
				insertPos,
				row.map(({ node }, x) =>
					normalizeCellNode(
						node,
						rowHeaderEnabled && y === 0,
						columnHeaderEnabled && actualTargetIndex === 0 && x === 0 && direction === 'start',
						types,
					),
				),
			);
		});

		if (options.selectAfterClone) {
			const offset = direction === 'end' ? 1 : 0;
			const selectionRange = getSelectionRangeInColumn(
				actualTargetIndex + offset,
				actualTargetIndex + offset + indexesOriginColumn.length - 1,
			)(newTr);

			if (selectionRange) {
				newTr.setSelection(new CellSelection(selectionRange.$anchor, selectionRange.$head));
			}
		}

		return newTr;
	};

function normalizeCellNode(
	cellNode: PMNode,
	rowHeaderEnabled: boolean,
	columnHeaderEnabled: boolean,
	types: TableNodeCache,
): PMNode {
	const newTargetType: NodeType =
		rowHeaderEnabled || columnHeaderEnabled ? types.header_cell : types.cell;
	return cellNode.type !== newTargetType
		? newTargetType.create(cellNode.attrs, cellNode.content, cellNode.marks)
		: cellNode;
}

function createContentNodeFactory(table: ContentNodeWithPos) {
	return (nodePos: number): ContentNodeWithPos => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const node = table.node.nodeAt(nodePos)!;
		const pos = nodePos + table.start;
		return { pos, start: pos + 1, node, depth: table.depth + 2 };
	};
}

function translateTargetPosition(row: number, startIndex: number, tableMap: TableMap) {
	if (tableMap.isCellMergedTopLeft(row, startIndex)) {
		// find the closet unmerged position to the left of the target. We scan left first because merged cells will actually
		// reduce the amount of cells in a row.
		for (let x = startIndex - 1; x >= 0; x--) {
			if (!tableMap.isCellMergedTopLeft(row, x)) {
				return tableMap.map[row * tableMap.width + x];
			}
		}

		// If no index found then we need to look to the right, this can occur when the first cell in the row is merged.
		for (let x = startIndex + 1; x < tableMap.width; x++) {
			if (!tableMap.isCellMergedTopLeft(row, x)) {
				return tableMap.map[row * tableMap.width + x];
			}
		}
	}

	return tableMap.map[row * tableMap.width + startIndex];
}
