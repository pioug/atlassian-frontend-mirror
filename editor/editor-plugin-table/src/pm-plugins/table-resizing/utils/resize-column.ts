// Resize a given column by an amount from the current state
import { type EditorContainerWidth } from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import {
	akEditorFullWidthLayoutWidth,
	akEditorGutterPaddingDynamic,
} from '@atlaskit/editor-shared-styles';

import { TableCssClassName as ClassName } from '../../../types';
import {
	ALIGN_CENTER,
	ALIGN_START,
	shouldChangeAlignmentToCenterResized,
} from '../../../utils/alignment';

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
	shouldUseIncreasedScalingPercent = false,
): ResizeState => {
	let scalePercent = 1;
	let resizeAmount = amount;

	if (isTableScalingEnabled) {
		scalePercent = getTableScalingPercent(tableNode, tableRef, shouldUseIncreasedScalingPercent);
		resizeAmount = amount / scalePercent;
	}

	const newState =
		resizeAmount > 0
			? growColumn(resizeState, colIndex, resizeAmount, selectedColumns)
			: resizeAmount < 0
				? shrinkColumn(resizeState, colIndex, resizeAmount, selectedColumns)
				: resizeState;

	updateColgroup(
		newState,
		tableRef,
		tableNode,
		isTableScalingEnabled,
		shouldUseIncreasedScalingPercent,
	);

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
	let resizeAmount = isTableLeftAligned ? amount : amount * 2;

	const willTableHitEditorEdge = resizeState.maxSize + resizeAmount > editorContainerWidth;

	const willResizedTableStayInOverflow =
		resizeState.overflow && resizeState.tableWidth + resizeAmount / 2 > resizeState.maxSize;

	// STEP 1: Update col width
	if (willTableHitEditorEdge || willResizedTableStayInOverflow) {
		const tableContainerWidth = tableRef.closest('.pm-table-container')?.clientWidth;
		resizeAmount =
			amount < 0
				? amount
				: resizeAmount - (resizeState.maxSize + resizeAmount - tableContainerWidth!) / 2;
	}

	if (!willResizedTableStayInOverflow && !willTableHitEditorEdge) {
		const diff = -(resizeState.tableWidth - resizeState.maxSize);
		const rest = amount - diff;
		const final = isTableLeftAligned ? diff + rest : diff + rest * 2;
		resizeAmount = final;
	}

	let newState = updateAffectedColumn(resizeState, colIndex, resizeAmount);

	// STEP 2: Update table container width
	// columns have a min width, so delta !== resizeAmount when this is reached, use this for calculations
	const delta = newState.cols[colIndex].width - resizeState.cols[colIndex].width;

	newState.maxSize = Math.round(
		resizeState.overflow
			? willResizedTableStayInOverflow
				? // CASE 1A: table will stay in overflow
					// do not grow the table because resize is happening in the overflow region
					// and the overall table container needs to be retained
					resizeState.maxSize
				: // CASE 1B: table will no longer be in overflow, so adjust container width
					// ensure the table is resized without any 'big jumps' by working out
					// the difference between the new table width and the max size and adding the resize
					resizeState.maxSize + (resizeState.tableWidth - resizeState.maxSize + delta)
			: willTableHitEditorEdge
				? // CASE 2: table will hit editor edge
					editorContainerWidth
				: // CASE 3: table is being resized from a non-overflow state
					resizeState.maxSize + delta,
	);

	// do not apply scaling logic because resize state is already scaled
	updateColgroup(newState, tableRef, tableNode, false, false);

	if (!willTableHitEditorEdge && !willResizedTableStayInOverflow) {
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
	}

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
}: TableReferences & { resizeState: ResizeState; editorWidth: number }): ResizeState => {
	// check if table is scaled, if not then avoid applying scaling values down
	if (resizeState.maxSize < getEditorContainerWidth(editorWidth)) {
		return resizeState;
	}

	const scalePercent = getTableScalingPercent(tableNode, tableRef);
	let cols = resizeState.cols.map((col) => ({
		...col,
		width: Math.round(Math.max(col.width * scalePercent, col.minWidth)),
	}));

	const scaledTableWidth = Math.round(resizeState.tableWidth * scalePercent);
	const calculatedTableWidth = cols.reduce((prev, curr) => prev + curr.width, 0);

	// using Math.round can cause the sum of col widths to be larger than the table width
	// distribute the difference to the smallest column
	if (calculatedTableWidth > scaledTableWidth) {
		const diff = calculatedTableWidth - scaledTableWidth;
		cols = cols.map((col) => {
			return col.width - diff >= col.minWidth ? { ...col, width: col.width - diff } : col;
		});
	}

	return {
		...resizeState,
		widths: cols.map((col) => col.width),
		tableWidth: scaledTableWidth,
		maxSize: Math.round(resizeState.maxSize * scalePercent),
		cols,
	};
};
