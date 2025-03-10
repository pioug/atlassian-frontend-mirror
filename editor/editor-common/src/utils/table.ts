import type { CellAttributes } from '@atlaskit/adf-schema';
import type { Node as PmNode, ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * Looks at every table row to find the correct number of columns for table, which
 * accounts for tables with uneven rows.
 *
 * Returns an array of column widths if defined otherwise 0, positions respect table order.
 */
export function getColumnWidths(node: PmNode): number[] {
	let tableColumnWidths: Array<number> = [];
	node.forEach((row) => {
		const currentTableWidth: Array<number> = [];
		row.forEach((cell) => {
			const { colspan, colwidth } = cell.attrs as CellAttributes;
			// column has been resized, colWidth will be an array, can safely take values even if cell is merged
			if (Array.isArray(colwidth)) {
				currentTableWidth.push(...colwidth);
				// table has merged cells but no colWidth, so columns haven't been resized, default to 0
			} else if (colspan !== undefined && colspan > 1) {
				currentTableWidth.push(...Array(colspan).fill(0));
				// no merged cells, no column resized, default to 0
			} else {
				currentTableWidth.push(0);
			}
		});

		if (currentTableWidth.length > tableColumnWidths.length) {
			tableColumnWidths = currentTableWidth;
		}
	});

	return tableColumnWidths;
}

export function calcTableColumnWidths(node: PmNode): number[] {
	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
	// TODO: replaced with getColumnWidths, which correctly scans entire table for column widths
	if (fg('platform_editor_table_row_span_fix')) {
		const firstRow = node.firstChild;
		const tableColumnWidths: Array<number> = [];

		if (firstRow) {
			firstRow.forEach((cell) => {
				const { colspan, colwidth } = cell.attrs;
				// column has been resized, colWidth will be an array, can safely take values even if cell is merged
				if (Array.isArray(colwidth)) {
					tableColumnWidths.push(...colwidth);
					// table has merged cells but no colWidth, so columns haven't been resized, default to 0
				} else if (colspan > 1) {
					tableColumnWidths.push(...Array(colspan).fill(0));
					// no merged cells, no column resized, default to 0
				} else {
					tableColumnWidths.push(0);
				}
			});
		}
		return tableColumnWidths;
	}

	let tableColumnWidths: Array<number> = [];
	const firstRow = node.firstChild;

	if (firstRow) {
		// Sanity validation, but it should always have a first row
		// Iterate for the cells in the first row
		firstRow.forEach((colNode) => {
			const colwidth = colNode.attrs.colwidth || [0];

			// If we have colwidth, we added it
			if (colwidth) {
				tableColumnWidths = [...tableColumnWidths, ...colwidth];
			}
		});
	}

	return tableColumnWidths;
}

export function hasMergedCell(tableNode: PmNode): boolean {
	let hasSpan = false;

	tableNode.descendants((node) => {
		if (node.type.name === 'tableRow') {
			return true;
		}

		const { colspan, rowspan } = node.attrs;

		if (colspan > 1 || rowspan > 1) {
			hasSpan = true;
		}

		return false;
	});

	return hasSpan;
}

export function convertProsemirrorTableNodeToArrayOfRows(
	tableNode: PmNode,
): Array<Array<PmNode | null>> {
	const result: Array<Array<PmNode>> = [];

	tableNode.forEach((rowNode) => {
		if (rowNode.type.name === 'tableRow') {
			const row: Array<PmNode> = [];
			rowNode.forEach((n) => row.push(n));
			result.push(row);
		}
	});

	return result;
}

/*
  isPositionNearTableRow()
  Returns true when a sibling node, or any  of the parent's sibling
  nodes are a tableRow
 */
export function isPositionNearTableRow(
	pos: ResolvedPos,
	schema: Schema,
	direction: 'before' | 'after',
) {
	if (!schema.nodes.tableRow) {
		return false;
	}
	const doc = pos.doc;
	let resolved = pos;
	const sibling = direction === 'before' ? 'nodeBefore' : 'nodeAfter';
	while (resolved.depth > 0) {
		const siblingType = resolved[sibling]?.type;
		if (siblingType === schema.nodes.tableRow) {
			return true;
		}
		resolved = doc.resolve(resolved[direction]());
	}
	return false;
}
