import type { CellAttributes } from '@atlaskit/adf-schema';
import type { Node as PmNode, ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns an array of column widths (0 if column width is undefined) of a given table node by scanning the **entire table**.
 *
 * Warning: the entire table is scanned and should only be used if where the table can be in a broken state such that rows have different number of cells (e.g. in **renderer**).
 * @param node - Table node
 * @example
 * ```ts
 * const columnWidths = getColumnWidths(tableNode);
 * console.log(columnWidths);
 * // Output: [100, 200, 300]
 * ```
 * @returns Array<number>
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

/**
 * Returns an array of column widths (0 if column width is undefined) of a given table node by scanning the **first row**.
 *
 * Warning: is preferred and should be used if the table is not in a broken state (e.g. in **editor**).
 * @param node - Table node
 * @example
 * ```ts
 * const columnWidths = calcTableColumnWidths(tableNode);
 * console.log(columnWidths);
 * // Output: [100, 200, 300]
 * ```
 * @returns Array<number>
 */
export function calcTableColumnWidths(node: PmNode): number[] {
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

/**
 *
 * @param tableNode
 * @example
 */
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

/**
 *
 * @param tableNode
 * @example
 */
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
/**
 *
 * @param pos
 * @param schema
 * @param direction
 * @example
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
