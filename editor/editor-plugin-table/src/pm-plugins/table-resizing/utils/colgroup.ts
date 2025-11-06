import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import { calcTableColumnWidths, getFragmentBackingArray } from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	COLUMN_MIN_WIDTH,
	MAX_SCALING_PERCENT,
	MAX_SCALING_PERCENT_TABLES_WITH_FIXED_COLUMN_WIDTHS_OPTION,
} from './consts';
import {
	getScalingPercentForTableWithoutWidth,
	getTableContainerElementWidth,
	getTableScalingPercent,
} from './misc';

type Col = Array<string | { [name: string]: string }>;

/**
 * This ensures the combined width of the columns (and tbody) of table is always smaller or equal
 * than the table and table wrapper elements. This is necessary as there is no longer
 * padding on the .pm-table-wrapper, so all elements need to be the same width to avoid
 * overflow.
 */
export const getColWidthFix = (colwidth: number, tableColumnCount: number) =>
	colwidth - 1 / tableColumnCount;

const generateColStyle = (
	fixedColWidth: number,
	tableWidth: number,
	isCommentEditor?: boolean,
	isChromelessEditor?: boolean,
	isNested?: boolean,
	shouldUseIncreasedScalingPercent?: boolean,
	isNumberColumnEnabled?: boolean,
	isTableHasWidth?: boolean,
	hasTableBeenResized?: boolean,
) => {
	const maxScalingPercent = shouldUseIncreasedScalingPercent
		? MAX_SCALING_PERCENT_TABLES_WITH_FIXED_COLUMN_WIDTHS_OPTION
		: MAX_SCALING_PERCENT;
	const maxScaledRatio = 1 - maxScalingPercent;

	const isFullPageEditor = !isChromelessEditor && !isCommentEditor;

	// for nested tables, or chromeless editor, which used non resizable table container
	if (isNested || isChromelessEditor) {
		if (hasTableBeenResized) {
			return `width: max(${fixedColWidth}px, ${tableCellMinWidth}px)`;
		}
		return `width: ${tableCellMinWidth}px)`;
	}
	if (isFullPageEditor || (!isFullPageEditor && isTableHasWidth)) {
		const scaledPercent = isNumberColumnEnabled
			? `calc(calc(var(--ak-editor-table-width) - ${akEditorTableNumberColumnWidth}px - 1px)/${tableWidth})`
			: `calc(calc(var(--ak-editor-table-width) - 1px)/${tableWidth})`;
		return `width: max(calc(${fixedColWidth}px * ${maxScaledRatio}), calc(${fixedColWidth} * ${scaledPercent}), ${tableCellMinWidth}px)`;
	}
	// table resized to full-width in comment editor
	// it doesn't have a width attribute, and cols has been resized
	if (hasTableBeenResized) {
		const scaledPercent = isNumberColumnEnabled
			? `calc(calc(var(--ak-editor-table-width) - ${akEditorTableNumberColumnWidth}px - 1px)/${tableWidth})`
			: `calc(calc(var(--ak-editor-table-width) - 1px)/${tableWidth})`;
		return `width: max(calc(${fixedColWidth} * ${scaledPercent}), ${tableCellMinWidth}px)`;
	}
	return `width: ${tableCellMinWidth}px`;
};

export const generateColgroupFromNode = (
	table: PmNode,
	isCommentEditor?: boolean,
	isChromelessEditor?: boolean,
	isNested?: boolean,
	isTableScalingEnabled?: boolean,
	shouldUseIncreasedScalingPercent?: boolean,
) => {
	const cols: Col[] = [];
	const map = TableMap.get(table);
	const isTableHasWidth = !!table.attrs.width;
	const isNumberColumnEnabled = table.attrs.isNumberColumnEnabled || false;
	const isFullPageEditor = !isChromelessEditor && !isCommentEditor;

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	table.content.firstChild!.content.forEach((cell) => {
		const colspan = cell.attrs.colspan || 1;
		// if the table has been resized
		if (Array.isArray(cell.attrs.colwidth)) {
			cell.attrs.colwidth.slice(0, colspan).forEach((width) => {
				// existing logic for calculating the width of the column
				const fixedColWidth = getColWidthFix(width, map.width);
				const tableWidth =
					isFullPageEditor || (!isFullPageEditor && isTableHasWidth)
						? getTableContainerElementWidth(table)
						: calcTableColumnWidths(table).reduce((sum, width) => sum + width, 0);
				if (isTableScalingEnabled) {
					cols.push([
						'col',
						{
							style: generateColStyle(
								fixedColWidth,
								tableWidth,
								isCommentEditor,
								isChromelessEditor,
								isNested,
								shouldUseIncreasedScalingPercent,
								isNumberColumnEnabled,
								isTableHasWidth,
								true,
							),
						},
					]);
				} else {
					cols.push([
						'col',
						{
							style: `width: max(${fixedColWidth}px, ${tableCellMinWidth}px)`,
						},
					]);
				}
			});
		} else {
			if (!isTableScalingEnabled && fg('platform_editor_table_width_refactor')) {
				cols.push(
					...Array.from({ length: colspan }, (_) => [
						'col',
						{ style: `width: ${tableCellMinWidth}px;` },
					]),
				);
			} else {
				// columns has not been resized, so distribute the width evenly
				cols.push(
					...Array.from({ length: colspan }, (_) => {
						const tableWidth = getTableContainerElementWidth(table);
						const columnWidth = tableWidth / map.width || 0;
						const fixedColWidth = getColWidthFix(columnWidth, map.width || 0);

						return [
							'col',
							{
								style: generateColStyle(
									fixedColWidth,
									tableWidth,
									isCommentEditor,
									isChromelessEditor,
									isNested,
									shouldUseIncreasedScalingPercent,
									isNumberColumnEnabled,
									isTableHasWidth,
								),
							},
						];
					}),
				);
			}
		}
	});
	return cols;
};

export const generateColgroup = (
	table: PmNode,
	tableRef?: HTMLElement,
	shouldUseIncreasedScalingPercent?: boolean,
	isCommentEditor?: boolean,
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
					// existing logic for calculating the width of the column
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
): HTMLCollection => {
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	let colgroup = tableRef?.querySelector('colgroup') as HTMLElement;
	if (colgroup && shouldRemove) {
		tableRef?.removeChild(colgroup);
	}

	colgroup = renderColgroupFromNode(
		table,
		isTableScalingEnabled ? (tableRef ?? undefined) : undefined,
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
