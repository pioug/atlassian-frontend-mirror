import type { Change } from 'prosemirror-changeset';

import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { findParentNodeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { token } from '@atlaskit/tokens';

import { findSafeInsertPos } from './findSafeInsertPos';
import type { NodeViewSerializer } from './NodeViewSerializer';

const deletedRowStyle = convertToInlineCss({
	color: token('color.text.accent.gray'),
	textDecoration: 'line-through',
	opacity: 0.6,
	display: 'table-row',
});

const deletedTraditionalRowStyle = convertToInlineCss({
	textDecorationColor: token('color.border.accent.red'),
	textDecoration: 'line-through',
	opacity: 0.6,
	display: 'table-row',
});

interface DeletedRowInfo {
	fromA: number;
	fromB: number;
	rowIndex: number;
	rowNode: PMNode;
	toA: number;
}

type SimpleChange = Pick<Change, 'fromA' | 'toA' | 'fromB' | 'deleted'>;

interface DeletedRowsHandlerProps {
	colourScheme?: 'standard' | 'traditional';
	deletedRows: DeletedRowInfo[];
	newDoc: PMNode;
	nodeViewSerializer: NodeViewSerializer;
	originalDoc: PMNode;
}

/**
 * Extracts information about deleted table rows from a change
 */
const extractDeletedRows = (
	change: SimpleChange,
	originalDoc: PMNode,
	newDoc: PMNode,
): DeletedRowInfo[] => {
	const deletedRows: DeletedRowInfo[] = [];

	// Find the table in the original document
	const $fromPos = originalDoc.resolve(change.fromA);

	const tableOld = findParentNodeClosestToPos($fromPos, (node) => node.type.name === 'table');
	if (!tableOld) {
		return deletedRows;
	}

	const oldTableMap = TableMap.get(tableOld.node);

	// Find the table in the new document at the insertion point
	const $newPos = newDoc.resolve(change.fromB);
	const tableNew = findParentNodeClosestToPos($newPos, (node) => node.type.name === 'table');

	if (!tableNew) {
		return deletedRows;
	}

	const newTableMap = TableMap.get(tableNew.node);

	// If no rows were deleted, return empty
	if (
		oldTableMap.height <= newTableMap.height ||
		// For now ignore if there are column deletions as well
		oldTableMap.width !== newTableMap.width
	) {
		return deletedRows;
	}

	// Find which rows were deleted by analyzing the change range
	const changeStartInTable = change.fromA - tableOld.pos - 1;
	const changeEndInTable = change.toA - tableOld.pos - 1;

	let currentOffset = 0;
	let rowIndex = 0;

	tableOld.node.content.forEach((rowNode, index) => {
		const rowStart = currentOffset;
		const rowEnd = currentOffset + rowNode.nodeSize;

		// Check if this row overlaps with the deletion range
		const rowOverlapsChange =
			(rowStart >= changeStartInTable && rowStart < changeEndInTable) ||
			(rowEnd > changeStartInTable && rowEnd <= changeEndInTable) ||
			(rowStart < changeStartInTable && rowEnd > changeEndInTable);

		if (rowOverlapsChange && rowNode.type.name === 'tableRow' && !isEmptyRow(rowNode)) {
			const startOfRow = newTableMap.mapByRow
				.slice()
				.reverse()
				.find(
					(row) =>
						row[0] + tableNew.pos < change.fromB &&
						change.fromB < row[row.length - 1] + tableNew.pos,
				);
			deletedRows.push({
				rowIndex,
				rowNode,
				fromA: tableOld.pos + 1 + rowStart,
				toA: tableOld.pos + 1 + rowEnd,
				fromB: startOfRow ? startOfRow[0] + tableNew.start : change.fromB,
			});
		}

		currentOffset += rowNode.nodeSize;
		if (rowNode.type.name === 'tableRow') {
			rowIndex++;
		}
	});

	// Filter changes that never truly got deleted
	return deletedRows.filter((deletedRow) => {
		return !tableNew.node.children.some((newRow) =>
			areNodesEqualIgnoreAttrs(newRow, deletedRow.rowNode),
		);
	});
};

/**
 * Checks if a table row is empty (contains no meaningful content)
 */
const isEmptyRow = (rowNode: PMNode): boolean => {
	let isEmpty = true;

	rowNode.descendants((node) => {
		if (!isEmpty) {
			return false;
		}

		// If we find any inline content with size > 0, the row is not empty
		if (node.isInline && node.nodeSize > 0) {
			isEmpty = false;
			return false;
		}

		// If we find text content, the row is not empty
		if (node.isText && node.text && node.text.trim() !== '') {
			isEmpty = false;
			return false;
		}

		return true;
	});

	return isEmpty;
};

/**
 * Creates a DOM representation of a deleted table row
 */
const createDeletedRowDOM = (
	rowNode: PMNode,
	nodeViewSerializer: NodeViewSerializer,
	colourScheme?: 'standard' | 'traditional',
): HTMLTableRowElement => {
	const tr = document.createElement('tr');
	tr.setAttribute(
		'style',
		colourScheme === 'traditional' ? deletedTraditionalRowStyle : deletedRowStyle,
	);
	tr.setAttribute('data-testid', 'show-diff-deleted-row');

	// Serialize each cell in the row
	rowNode.content.forEach((cellNode) => {
		if (cellNode.type.name === 'tableCell' || cellNode.type.name === 'tableHeader') {
			const nodeView = nodeViewSerializer.tryCreateNodeView(cellNode);
			if (nodeView) {
				tr.appendChild(nodeView);
			} else {
				// Fallback to fragment serialization
				const serializedContent = nodeViewSerializer.serializeFragment(cellNode.content);
				if (serializedContent) {
					tr.appendChild(serializedContent);
				}
			}
		}
	});

	return tr;
};

/**
 * Expands a diff to include whole deleted rows when table rows are affected
 */
const expandDiffForDeletedRows = (
	changes: SimpleChange[],
	originalDoc: PMNode,
	newDoc: PMNode,
): DeletedRowInfo[] => {
	const deletedRowInfo: DeletedRowInfo[] = [];
	for (const change of changes) {
		// Check if this change affects table content
		const deletedRows = extractDeletedRows(change, originalDoc, newDoc);

		if (deletedRows.length > 0) {
			deletedRowInfo.push(...deletedRows);
		}
	}

	return deletedRowInfo;
};

/**
 * Creates decorations for deleted table rows
 */
export const createDeletedRowsDecorations = ({
	deletedRows,
	originalDoc,
	newDoc,
	nodeViewSerializer,
	colourScheme,
}: DeletedRowsHandlerProps): Decoration[] => {
	return deletedRows.map((deletedRow) => {
		const rowDOM = createDeletedRowDOM(deletedRow.rowNode, nodeViewSerializer, colourScheme);

		// Find safe insertion position for the deleted row
		const safeInsertPos = findSafeInsertPos(
			newDoc,
			deletedRow.fromB - 1, // -1 to find the first safe position from the table
			originalDoc.slice(deletedRow.fromA, deletedRow.toA),
		);

		return Decoration.widget(safeInsertPos, rowDOM, {});
	});
};

/**
 * Main function to handle deleted rows - computes diff and creates decorations
 */
export const handleDeletedRows = (
	changes: SimpleChange[],
	originalDoc: PMNode,
	newDoc: PMNode,
	nodeViewSerializer: NodeViewSerializer,
	colourScheme?: 'standard' | 'traditional',
): { decorations: Decoration[] } => {
	// First, expand the changes to include complete deleted rows
	const deletedRows = expandDiffForDeletedRows(
		changes.filter((change) => change.deleted.length > 0),
		originalDoc,
		newDoc,
	);

	const allDecorations = createDeletedRowsDecorations({
		deletedRows,
		originalDoc,
		newDoc,
		nodeViewSerializer,
		colourScheme,
	});

	return {
		decorations: allDecorations,
	};
};
