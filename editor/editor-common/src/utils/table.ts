import type { Node as PmNode, ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

export function calcTableColumnWidths(node: PmNode): number[] {
	if (fg('platform_editor_table_row_span_fix')) {
		const firstRow = node.firstChild;
		let tableColumnWidths: Array<number> = [];

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
			let colwidth = colNode.attrs.colwidth || [0];

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
	let doc = pos.doc;
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
