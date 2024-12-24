import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';

import type { ReportInvalidNodeAttrs } from '../../types';
import { calculateColumnWidth, getCellsRefsInColumn } from '../table-resizing/utils/column-state';
import { contentWidth } from '../table-resizing/utils/content-width';
import { getLayoutSize } from '../table-resizing/utils/misc';

const validateTableCellNodeAttrs = (
	{ colspan, rowspan, tableLocalId }: { colspan?: number; rowspan?: number; tableLocalId: string },
	reportInvalidTableCellSpanAttrs: ReportInvalidNodeAttrs,
): void => {
	if (colspan && colspan < 0) {
		reportInvalidTableCellSpanAttrs({
			nodeType: 'tableCell',
			attribute: 'colspan',
			reason: 'negative value',
			tableLocalId,
			spanValue: colspan,
		});
	}

	if (rowspan && rowspan < 0) {
		reportInvalidTableCellSpanAttrs({
			nodeType: 'tableCell',
			attribute: 'rowspan',
			reason: 'negative value',
			tableLocalId,
			spanValue: rowspan,
		});
	}
	return;
};

// We attempt to patch the document when we have extra, unneeded, column widths
// Take this node for example:
//
//    ['td', { colwidth: [100, 100, 100], colspan: 2 }]
//
// This row only spans two columns, yet it contains widths for 3.
// We remove the third width here, assumed duplicate content.
export const removeExtraneousColumnWidths = (
	node: PMNode,
	basePos: number,
	tr: Transaction,
	reportInvalidTableCellSpanAttrs?: ReportInvalidNodeAttrs,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
): boolean => {
	let hasProblems = false;

	tr = replaceCells(tr, node, basePos, (cell) => {
		const { colwidth, colspan, rowspan } = cell.attrs;

		if (reportInvalidTableCellSpanAttrs) {
			validateTableCellNodeAttrs(
				{ colspan, rowspan, tableLocalId: node.attrs.localId },
				reportInvalidTableCellSpanAttrs,
			);
		}

		if (colwidth && colwidth.length > colspan) {
			hasProblems = true;
			return cell.type.createChecked(
				{
					...cell.attrs,
					colwidth: colwidth.slice(0, colspan),
				},
				cell.content,
				cell.marks,
			);
		}

		return cell;
	});

	if (hasProblems) {
		return true;
	}

	return false;
};

export const fixTables = (
	tr: Transaction,
	reportInvalidTableCellSpanAttrs?: ReportInvalidNodeAttrs,
): Transaction | undefined => {
	let hasProblems = false;
	tr.doc.descendants((node, pos) => {
		if (node.type.name === 'table') {
			// in the unlikely event of having to fix multiple tables at the same time
			hasProblems = removeExtraneousColumnWidths(
				node,
				tr.mapping.map(pos),
				tr,
				reportInvalidTableCellSpanAttrs,
			);
		}
	});

	if (hasProblems) {
		return tr;
	}
};

// When we get a table with an 'auto' attribute, we want to:
// 1. render with table-layout: auto
// 2. capture the column widths
// 3. set the column widths as attributes, and remove the 'auto' attribute,
//    so the table renders the same, but is now fixed-width
//
// This can be used to migrate table appearances from other sources that are
// usually rendered with 'auto'.
//
// We use this when migrating TinyMCE tables for Confluence, for example:
// https://pug.jira-dev.com/wiki/spaces/AEC/pages/3362882215/How+do+we+map+TinyMCE+tables+to+Fabric+tables
export const fixAutoSizedTable = (
	view: EditorView,
	tableNode: PMNode,
	tableRef: HTMLTableElement,
	tablePos: number,
	opts: { containerWidth: number },
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
): Transaction => {
	let { tr } = view.state;
	const domAtPos = view.domAtPos.bind(view);
	const tableStart = tablePos + 1;
	const colWidths = parseDOMColumnWidths(domAtPos, tableNode, tableStart, tableRef);
	const totalContentWidth = colWidths.reduce((acc, current) => acc + current, 0);
	const tableLayout = getLayoutBasedOnWidth(totalContentWidth);
	const maxLayoutSize = getLayoutSize(tableLayout, opts.containerWidth, {});

	// Content width will generally not meet the constraints of the layout
	// whether it be below or above, so we scale our columns widths
	// to meet these requirements
	let scale = 1;
	if (totalContentWidth !== maxLayoutSize) {
		scale = maxLayoutSize / totalContentWidth;
	}

	const scaledColumnWidths = colWidths.map((width) => Math.floor(width * scale));

	tr = replaceCells(tr, tableNode, tablePos, (cell, _rowIndex, colIndex) => {
		const newColWidths = scaledColumnWidths.slice(colIndex, colIndex + cell.attrs.colspan);
		return cell.type.createChecked(
			{
				...cell.attrs,
				colwidth: newColWidths.length ? newColWidths : null,
			},
			cell.content,
			cell.marks,
		);
	});

	// clear autosizing on the table node
	return tr
		.setNodeMarkup(tablePos, undefined, {
			...tableNode.attrs,
			layout: tableLayout,
			__autoSize: false,
		})
		.setMeta('addToHistory', false);
};

const getLayoutBasedOnWidth = (totalWidth: number) => {
	if (totalWidth > akEditorWideLayoutWidth) {
		return 'full-width';
	} else if (totalWidth > akEditorDefaultLayoutWidth && totalWidth < akEditorWideLayoutWidth) {
		return 'wide';
	} else {
		return 'default';
	}
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
function parseDOMColumnWidths(
	domAtPos: (pos: number) => { node: Node; offset: number },
	tableNode: PMNode,
	tableStart: number,
	tableRef: HTMLTableElement,
): Array<number> {
	const row = tableRef.querySelector('tr');

	if (!row) {
		return [];
	}

	let cols: Array<number> = [];

	for (let col = 0; col < row.childElementCount; col++) {
		const currentCol = row.children[col];
		const colspan = Number(currentCol.getAttribute('colspan') || 1);
		for (let span = 0; span < colspan; span++) {
			const colIdx = col + span;
			const cells = getCellsRefsInColumn(colIdx, tableNode, tableStart, domAtPos);
			const colWidth = calculateColumnWidth(cells, (_, col) => {
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				return contentWidth(col as HTMLElement, tableRef).width;
			});

			cols[colIdx] = Math.max(colWidth, tableCellMinWidth);
		}
	}

	return cols;
}

// TODO: move to prosemirror-utils
const replaceCells = (
	tr: Transaction,
	table: PMNode,
	tablePos: number,
	modifyCell: (cell: PMNode, rowIndex: number, colIndex: number) => PMNode,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
): Transaction => {
	const rows: PMNode[] = [];
	let modifiedCells = 0;
	for (let rowIndex = 0; rowIndex < table.childCount; rowIndex++) {
		const row = table.child(rowIndex);
		const cells: PMNode[] = [];

		for (let colIndex = 0; colIndex < row.childCount; colIndex++) {
			const cell = row.child(colIndex);

			// FIXME
			// The rowIndex and colIndex are not accurate in a merged cell scenario
			// e.g. table with 5 columns might have only one cell in a row, colIndex will be 1, where it should be 4
			const node = modifyCell(cell, rowIndex, colIndex);
			if (node.sameMarkup(cell) === false) {
				modifiedCells++;
			}
			cells.push(node);
		}

		if (cells.length) {
			rows.push(row.type.createChecked(row.attrs, cells, row.marks));
		}
	}

	// Check if the table has changed before replacing.
	// If no cells are modified our counter will be zero.
	if (rows.length && modifiedCells !== 0) {
		const newTable = table.type.createChecked(table.attrs, rows, table.marks);
		return tr.replaceWith(tablePos, tablePos + table.nodeSize, newTable);
	}

	return tr;
};
