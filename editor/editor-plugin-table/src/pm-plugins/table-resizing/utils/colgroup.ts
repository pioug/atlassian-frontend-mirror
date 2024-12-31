import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import { getFragmentBackingArray } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { TableMap } from '@atlaskit/editor-tables/table-map';

import { COLUMN_MIN_WIDTH } from './consts';
import { getScalingPercentForTableWithoutWidth, getTableScalingPercent } from './misc';

type Col = Array<string | { [name: string]: string }>;

/**
 * This ensures the combined width of the columns (and tbody) of table is always smaller or equal
 * than the table and table wrapper elements. This is necessary as there is no longer
 * padding on the .pm-table-wrapper, so all elements need to be the same width to avoid
 * overflow.
 */
export const getColWidthFix = (colwidth: number, tableColumnCount: number) =>
	colwidth - 1 / tableColumnCount;

export const generateColgroup = (
	table: PmNode,
	tableRef?: HTMLElement,
	shouldUseIncreasedScalingPercent?: boolean,
	isCommentEditor?: boolean,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const cols: Col[] = [];
	const map = TableMap.get(table);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	table.content.firstChild!.content.forEach((cell) => {
		const colspan = cell.attrs.colspan || 1;
		if (Array.isArray(cell.attrs.colwidth)) {
			// We slice here to guard against our colwidth array having more entries
			// Than the we actually span. We'll patch the document at a later point.
			if (tableRef) {
				// if we have tableRef here, isTableScalingEnabled is true
				let scalePercent = 1;

				if (isCommentEditor && !table.attrs?.width) {
					scalePercent = getScalingPercentForTableWithoutWidth(table, tableRef);
				} else {
					scalePercent = getTableScalingPercent(table, tableRef, shouldUseIncreasedScalingPercent);
				}

				cell.attrs.colwidth.slice(0, colspan).forEach((width) => {
					const fixedColWidth = getColWidthFix(width, map.width);
					const scaledWidth = fixedColWidth * scalePercent;
					const finalWidth = Math.max(scaledWidth, tableCellMinWidth);
					cols.push([
						'col',
						{
							style: `width: ${finalWidth}px;`,
						},
					]);
				});
			} else {
				cell.attrs.colwidth.slice(0, colspan).forEach((width) => {
					cols.push([
						'col',
						{
							style: `width: ${getColWidthFix(
								width ? Math.max(width, tableCellMinWidth) : tableCellMinWidth,
								map.width,
							)}px;`,
						},
					]);
				});
			}
		} else {
			// When we have merged cells on the first row (firstChild),
			// We want to ensure we're creating the appropriate amount of
			// cols the table still has.
			cols.push(
				...Array.from({ length: colspan }, (_) => [
					'col',
					{ style: `width: ${tableCellMinWidth}px;` },
				]),
			);
		}
	});

	return cols;
};

export const insertColgroupFromNode = (
	tableRef: HTMLTableElement | null,
	table: PmNode,
	isTableScalingEnabled = false,
	shouldRemove = true,
	shouldUseIncreasedScalingPercent = false,
	isCommentEditor = false,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
): HTMLCollection => {
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	let colgroup = tableRef?.querySelector('colgroup') as HTMLElement;
	if (colgroup && shouldRemove) {
		tableRef?.removeChild(colgroup);
	}

	colgroup = renderColgroupFromNode(
		table,
		isTableScalingEnabled ? tableRef ?? undefined : undefined,
		shouldUseIncreasedScalingPercent,
		isCommentEditor,
	);
	if (shouldRemove) {
		tableRef?.insertBefore(colgroup, tableRef?.firstChild);
	}

	return colgroup.children;
};

export const hasTableBeenResized = (table: PmNode) => {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return !!getFragmentBackingArray(table.content.firstChild!.content).find(
		(cell) => cell.attrs.colwidth,
	);
};

export const hasTableColumnBeenResized = hasTableBeenResized;

/**
 * Check if a table has all the column width set to tableCellMinWidth(48px) or null
 *
 * @param table
 * @returns true if all column width is equal to tableCellMinWidth or null, false otherwise
 */
export const isMinCellWidthTable = (table: PmNode) => {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const cellArray = getFragmentBackingArray(table.content.firstChild!.content);
	const isTableMinCellWidth = cellArray.every((cell) => {
		return (
			(cell.attrs.colwidth && cell.attrs.colwidth[0] === tableCellMinWidth) ||
			cell.attrs.colwidth === null
		);
	});

	return isTableMinCellWidth;
};

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
function renderColgroupFromNode(
	table: PmNode,
	maybeTableRef: HTMLElement | undefined,
	shouldUseIncreasedScalingPercent: boolean,
	isCommentEditor: boolean,
): HTMLElement {
	const rendered = DOMSerializer.renderSpec(document, [
		'colgroup',
		{},
		...generateColgroup(table, maybeTableRef, shouldUseIncreasedScalingPercent, isCommentEditor),
	]);

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	return rendered.dom as HTMLElement;
}

export const getColgroupChildrenLength = (table: PmNode): number => {
	const map = TableMap.get(table);
	return map.width;
};

export const getResizerMinWidth = (node: PmNode) => {
	const currentColumnCount = getColgroupChildrenLength(node);
	const minColumnWidth = Math.min(3, currentColumnCount) * COLUMN_MIN_WIDTH;
	// add an extra pixel as the scale table logic will scale columns to be tableContainerWidth - 1
	// the table can't scale past its min-width, so instead restrict table container min width to avoid that situation
	return minColumnWidth + 1;
};
