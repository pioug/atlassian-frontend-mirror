// Resize a given column by an amount from the current state
import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import { type EditorContainerWidth } from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import {
	akEditorFullWidthLayoutWidth,
	akEditorGutterPaddingDynamic,
	akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-shared-styles';

import { TableCssClassName as ClassName } from '../../../types';
import {
	ALIGN_CENTER,
	ALIGN_START,
	shouldChangeAlignmentToCenterResized,
} from '../../utils/alignment';

import { getTableScalingPercent } from './misc';
import { growColumn, shrinkColumn, updateAffectedColumn } from './resize-logic';
import { updateColgroup } from './resize-state';
import type { ResizeState } from './types';

export const resizeColumn = (
	resizeState: ResizeState,
	colIndex: number,
	amount: number,
	tableRef: HTMLElement | null,
	tableNode: PmNode,
	selectedColumns?: number[],
	isTableScalingEnabled = false,
	scalePercent = 1,
): ResizeState => {
	let resizeAmount = amount;

	if (isTableScalingEnabled) {
		resizeAmount = amount / scalePercent;
	}

	const newState =
		resizeAmount > 0
			? growColumn(resizeState, colIndex, resizeAmount, selectedColumns)
			: resizeAmount < 0
				? shrinkColumn(resizeState, colIndex, resizeAmount, selectedColumns)
				: resizeState;

	updateColgroup(newState, tableRef, tableNode, isTableScalingEnabled, scalePercent);

	return newState;
};

type ResizeInformation = {
	resizeState: ResizeState;
	colIndex: number;
	amount: number;
};

type TableReferences = {
	tableRef: HTMLElement;
	tableNode: PmNode;
};

type TableResizingPluginOptions = {
	isTableAlignmentEnabled?: boolean;
};

type ResizeColumnAndTable = ResizeInformation &
	TableResizingPluginOptions &
	TableReferences &
	EditorContainerWidth;

export const resizeColumnAndTable = ({
	resizeState,
	colIndex,
	amount,
	tableRef,
	tableNode,
	lineLength,
	width: editorWidth,
	isTableAlignmentEnabled,
}: ResizeColumnAndTable): ResizeState => {
	const editorContainerWidth = getEditorContainerWidth(editorWidth);
	const isTableLeftAligned = tableNode.attrs.layout === ALIGN_START;
	const isNumberColumnEnabled = tableNode.attrs.isNumberColumnEnabled;
	const isOverflow = resizeState.tableWidth > resizeState.maxSize;
	let resizeAmount = isTableLeftAligned ? amount : amount * 2;
	const willTableHitEditorEdge = resizeState.maxSize + resizeAmount > editorContainerWidth;

	const willResizedTableStayInOverflow =
		isOverflow && resizeState.tableWidth + resizeAmount / 2 > resizeState.maxSize;

	// STEP 1: Update col width
	if (willTableHitEditorEdge || willResizedTableStayInOverflow) {
		const tableContainerWidth = tableRef.closest('.pm-table-container')?.clientWidth;
		resizeAmount =
			amount < 0
				? amount
				: resizeAmount - (resizeState.maxSize + resizeAmount - tableContainerWidth!) / 2;
	} else {
		const diff = -(resizeState.tableWidth - resizeState.maxSize);
		const rest = amount - diff;
		const final = isTableLeftAligned ? diff + rest : diff + rest * 2;
		resizeAmount = final;
	}

	const newState = updateAffectedColumn(resizeState, colIndex, resizeAmount);

	// STEP 2: Update table container width
	// columns have a min width, so delta !== resizeAmount when this is reached, use this for calculations
	const delta = newState.cols[colIndex].width - resizeState.cols[colIndex].width;

	newState.maxSize = Math.round(
		isOverflow
			? willResizedTableStayInOverflow
				? // CASE 1A: table will stay in overflow
					// do not grow the table because resize is happening in the overflow region
					// and the overall table container needs to be retained
					isNumberColumnEnabled
					? resizeState.maxSize + akEditorTableNumberColumnWidth
					: resizeState.maxSize
				: // CASE 1B: table will no longer be in overflow, so adjust container width
					// ensure the table is resized without any 'big jumps' by working out
					// the difference between the new table width and the max size and adding the resize
					isNumberColumnEnabled
					? resizeState.maxSize +
						akEditorTableNumberColumnWidth +
						(resizeState.tableWidth - resizeState.maxSize + akEditorTableNumberColumnWidth + delta)
					: resizeState.maxSize + (resizeState.tableWidth - resizeState.maxSize + delta)
			: willTableHitEditorEdge
				? // CASE 2: table will hit editor edge
					editorContainerWidth
				: // CASE 3: table is being resized from a non-overflow state
					isNumberColumnEnabled
					? resizeState.maxSize + akEditorTableNumberColumnWidth + delta
					: resizeState.maxSize + delta,
	);

	// do not apply scaling logic because resize state is already scaled
	updateColgroup(newState, tableRef, tableNode, false, 1);

	updateTablePreview(
		tableRef,
		newState.maxSize,
		shouldChangeAlignmentToCenterResized(
			isTableAlignmentEnabled,
			tableNode,
			lineLength,
			newState.maxSize,
		),
	);

	return newState;
};

const updateTablePreview = (
	tableRef: HTMLElement,
	newTableWidth: number,
	shouldChangeAlignment?: boolean,
) => {
	const resizingContainer = tableRef.closest(`.${ClassName.TABLE_RESIZER_CONTAINER}`);
	const resizingItem = resizingContainer?.querySelector('.resizer-item');
	const alignmentContainer = resizingContainer?.parentElement;

	if (resizingItem) {
		const newWidth = `${newTableWidth}px`;
		(resizingContainer as HTMLElement).style.width = newWidth;
		(resizingItem as HTMLElement).style.width = newWidth;

		if (shouldChangeAlignment && alignmentContainer) {
			alignmentContainer.style.justifyContent = ALIGN_CENTER;
		}
	}
};

const getEditorContainerWidth = (editorWidth: number) =>
	Math.min(editorWidth - akEditorGutterPaddingDynamic() * 2, akEditorFullWidthLayoutWidth);

/**
 * Apply a scaling factor to resize state
 */
export const scaleResizeState = ({
	resizeState,
	tableRef,
	tableNode,
	editorWidth,
	shouldUseIncreasedScalingPercent,
}: TableReferences & {
	resizeState: ResizeState;
	editorWidth: number;
	shouldUseIncreasedScalingPercent: boolean;
}): ResizeState => {
	const isNumberColumnEnabled = tableNode.attrs.isNumberColumnEnabled;
	const isTableScaled =
		isNumberColumnEnabled || resizeState.maxSize > getEditorContainerWidth(editorWidth);

	// Tables with number column can cause the table to be in two different states:
	// 1. The table sum of col widths will be smaller than the max size, which is incorrect. For this
	// avoid scaling and take the document width
	// 2. The table sum of col widths will be the same size as max width, which happens when the table
	// is scaled using preserve table width logic, for this apply a scaled width
	// return early if table isn't scaled
	if (!isTableScaled || (isNumberColumnEnabled && resizeState.maxSize > resizeState.tableWidth)) {
		return resizeState;
	}

	const scalePercent = getTableScalingPercent(
		tableNode,
		tableRef,
		shouldUseIncreasedScalingPercent,
	);
	const scaledTableWidth = Math.round(resizeState.tableWidth * scalePercent);
	let cols = resizeState.cols.map((col) => {
		return {
			...col,
			minWidth: tableCellMinWidth,
			width: Math.max(Math.round(col.width * scalePercent), tableCellMinWidth),
		};
	});

	const calculatedTableWidth = cols.reduce((prev, curr) => prev + curr.width, 0);

	// using Math.round can cause the sum of col widths to be larger than the table width
	// distribute the difference to the first column
	if (calculatedTableWidth > scaledTableWidth) {
		const diff = calculatedTableWidth - scaledTableWidth;
		let hasDiffBeenDistributed = false;
		cols = cols.map((col) => {
			if (!hasDiffBeenDistributed && col.width - diff >= col.minWidth) {
				hasDiffBeenDistributed = true;
				return { ...col, width: col.width - diff };
			}
			return col;
		});
	}

	const maxSize = isNumberColumnEnabled
		? Math.round((resizeState.maxSize + akEditorTableNumberColumnWidth) * scalePercent)
		: Math.round(resizeState.maxSize * scalePercent);

	return {
		...resizeState,
		widths: cols.map((col) => col.width),
		tableWidth: scaledTableWidth,
		maxSize,
		cols,
	};
};
