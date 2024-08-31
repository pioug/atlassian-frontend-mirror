import type { CellAttributes } from '@atlaskit/adf-schema';
import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { AttrStep } from '@atlaskit/editor-prosemirror/transform';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ResizeState } from '../pm-plugins/table-resizing/utils';
import {
	getTableContainerElementWidth,
	getTableElementWidth,
	hasTableBeenResized,
} from '../pm-plugins/table-resizing/utils';
import { isMinCellWidthTable } from '../pm-plugins/table-resizing/utils/colgroup';
import { getResizeState } from '../pm-plugins/table-resizing/utils/resize-state';
import { scaleTableTo } from '../pm-plugins/table-resizing/utils/scale-table';
import type { PluginInjectionAPI } from '../types';

/**
 * Given a new ResizeState object, create a transaction that replaces and updates the table node based on new state.
 * @param resizeState
 * @param table
 * @param start
 * @returns
 */
export const updateColumnWidths =
	(
		resizeState: ResizeState,
		table: PMNode,
		start: number,
		api: PluginInjectionAPI | undefined | null,
	) =>
	(tr: Transaction): Transaction => {
		const map = TableMap.get(table);
		const updatedCellsAttrs: { [key: number]: CellAttributes } = {};
		const steps: Array<AttrStep> = [];

		// calculating new attributes for each cell
		for (let columnIndex = 0; columnIndex < map.width; columnIndex++) {
			for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
				let { width } = resizeState.cols[columnIndex];
				if (resizeState.isScaled) {
					// Ensure that the width is an integer if the table has been scaled
					width = Math.floor(width);
				}
				const mapIndex = rowIndex * map.width + columnIndex;
				const cellPos = map.map[mapIndex];
				const attrs = updatedCellsAttrs[cellPos] || {
					...table.nodeAt(cellPos)!.attrs,
				};
				const colspan = attrs.colspan || 1;

				if (attrs.colwidth && attrs.colwidth.length > colspan) {
					attrs.colwidth = attrs.colwidth.slice(0, colspan);
				}

				// Rowspanning cell that has already been handled
				if (rowIndex && map.map[mapIndex] === map.map[mapIndex - map.width]) {
					continue;
				}
				const colspanIndex = colspan === 1 ? 0 : columnIndex - map.colCount(cellPos);
				if (attrs.colwidth && attrs.colwidth[colspanIndex] === width) {
					continue;
				}

				let colwidths = attrs.colwidth
					? attrs.colwidth.slice()
					: Array.from({ length: colspan }, (_) => 0);

				colwidths[colspanIndex] = width;
				if (colwidths.length > colspan) {
					colwidths = colwidths.slice(0, colspan);
				}
				updatedCellsAttrs[cellPos] = {
					...attrs,
					colwidth: colwidths.includes(0) ? undefined : colwidths,
				};
			}
		}

		// updating all cells with new attributes
		const seen: { [key: number]: boolean } = {};
		for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
			for (let columnIndex = 0; columnIndex < map.width; columnIndex++) {
				const mapIndex = rowIndex * map.width + columnIndex;
				const pos = map.map[mapIndex];
				const cell = table.nodeAt(pos);
				if (!seen[pos] && cell) {
					if (updatedCellsAttrs[pos]) {
						steps.push(new AttrStep(pos + start, 'colwidth', updatedCellsAttrs[pos].colwidth));
					}
					seen[pos] = true;
				}
			}
		}

		if (api?.batchAttributeUpdates && fg('platform_editor_batch_steps_table')) {
			const batchStep = api.batchAttributeUpdates.actions.batchSteps({ steps, doc: tr.doc });
			tr.step(batchStep);
		} else {
			steps.forEach((s) => {
				tr.step(s);
			});
		}

		return tr;
	};

/**
 * This function is called when user inserts/deletes a column in a table to;
 * - rescale all columns (if the table did not overflow before the insertion)
 * - and update column widths.
 *
 * This is done manually to avoid a multi-dispatch in TableComponent. See [ED-8288].
 * @param table
 * @param view
 * @returns Updated transaction with rescaled columns for a given table
 */
export const rescaleColumns =
	(
		isTableScalingEnabled = false,
		isTableFixedColumnWidthsOptionEnabled = false,
		shouldUseIncreasedScalingPercent = false,
		api: PluginInjectionAPI | undefined | null,
		isCommentEditor = false,
	) =>
	(table: ContentNodeWithPos, view: EditorView | undefined) =>
	(tr: Transaction): Transaction => {
		if (!view) {
			return tr;
		}

		const newTable = tr.doc.nodeAt(table.pos);
		const domAtPos = view.domAtPos.bind(view);
		const maybeTable = domAtPos(table.start).node;
		const maybeTableElement = maybeTable instanceof HTMLElement ? maybeTable : null;
		const tableRef = maybeTableElement?.closest('table');

		if (!tableRef || !newTable) {
			return tr;
		}

		const isResized = hasTableBeenResized(table.node);

		let previousTableInfo = {
			width: 0,
			possibleMaxWidth: 0,
			isResized,
		};

		const tableDepth = view.state.doc.resolve(table.pos).depth;
		let shouldScale = isTableScalingEnabled && tableDepth === 0;

		if (shouldScale && isTableFixedColumnWidthsOptionEnabled) {
			shouldScale = newTable.attrs.displayMode !== 'fixed';
		}

		if (shouldScale) {
			previousTableInfo = {
				width: getTableElementWidth(table.node),
				possibleMaxWidth: getTableContainerElementWidth(table.node),
				isResized,
			};
		} else {
			previousTableInfo = {
				// when table is resized the tableRef client width will be 1px larger than colGroup, which is used in calculations
				width: isResized ? tableRef.clientWidth - 1 : tableRef.clientWidth,
				/** the is the width the table can reach before overflowing */
				possibleMaxWidth: tableRef?.parentElement?.clientWidth || 0,
				isResized,
			};
		}

		// determine the new table, based on new width
		const newTableInfo = {
			noOfColumns: TableMap.get(newTable).width,
		};

		if (!newTableInfo.noOfColumns || newTableInfo.noOfColumns <= 0) {
			return tr;
		}

		const averageColumnWidth = previousTableInfo.width / newTableInfo.noOfColumns;

		// If the table has not been resized (i.e. all columns will have the same width) and every column width is bigger than the minimum column width
		// we skip updating the size of columns here.
		if (!previousTableInfo.isResized && averageColumnWidth > tableCellMinWidth) {
			return tr;
		}

		const wasTableInOverflow = previousTableInfo.width > previousTableInfo.possibleMaxWidth;

		// If the table has not been resized, and each column width is smaller than the minimum column width
		// Or if the table has been resized, but each column width is either 48px or null
		// we update the table to have 48px for each column
		if (
			(!previousTableInfo.isResized && averageColumnWidth <= tableCellMinWidth) ||
			(previousTableInfo.isResized && isMinCellWidthTable(table.node))
		) {
			const widths = new Array(newTableInfo.noOfColumns).fill(tableCellMinWidth);
			const cols = widths.map((_, index) => ({
				width: tableCellMinWidth,
				minWidth: tableCellMinWidth,
				index,
			}));

			const minWidthResizeState = {
				cols,
				widths,
				maxSize: previousTableInfo.possibleMaxWidth,
				tableWidth: previousTableInfo.width,
				overflow: wasTableInOverflow,
			};
			return updateColumnWidths(minWidthResizeState, table.node, table.start, api)(tr);
		}

		let resizeState = getResizeState({
			minWidth: tableCellMinWidth,
			table: table.node,
			start: table.start,
			tableRef,
			domAtPos,
			maxSize: previousTableInfo.possibleMaxWidth,
			isTableScalingEnabled: shouldScale,
			shouldUseIncreasedScalingPercent,
			isCommentEditor,
		});
		// Two scenarios that require scaling:
		//   1. If the new table width will result in the table going into overflow
		//      we resize the cells to avoid it (e.g. adding a column)
		//   2. If the new table width will be shorter than the parent width, scale columns to fit parent
		if (
			(!wasTableInOverflow && resizeState.overflow) ||
			resizeState.tableWidth < resizeState.maxSize
		) {
			resizeState = scaleTableTo(resizeState, previousTableInfo.possibleMaxWidth);
		}

		return updateColumnWidths(resizeState, table.node, table.start, api)(tr);
	};
