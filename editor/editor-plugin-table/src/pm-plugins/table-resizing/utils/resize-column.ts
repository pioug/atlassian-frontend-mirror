// Resize a given column by an amount from the current state
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

import { type AlignmentOptions, TableCssClassName as ClassName } from '../../../types';
import {
	ALIGN_CENTER,
	ALIGN_START,
	shouldChangeAlignmentToCenterResized,
} from '../../../utils/alignment';

import { getTableContainerElementWidth, getTableScalingPercent } from './misc';
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

// try not scale table during resize
export const resizeColumnAndTable = (
	resizeState: ResizeState,
	colIndex: number,
	amount: number,
	tableRef: HTMLElement,
	tableNode: PmNode,
	selectedColumns?: number[],
	isTableScalingEnabled = false,
	originalTableWidth?: number,
	shouldUseIncreasedScalingPercent = false,
	lineLength?: number,
	isTableAlignmentEnabled = false,
): ResizeState => {
	// TODO: can we use document state, and apply scaling factor?
	const tableWidth = tableRef.clientWidth;
	const tableContainerWidth = tableRef.closest('.pm-table-container')?.clientWidth;

	const isOverflowed = !!(tableWidth && tableContainerWidth && tableWidth > tableContainerWidth);
	let resizeAmount = tableNode.attrs.layout === ALIGN_START && !isOverflowed ? amount : amount * 2;

	// todo: reimplement - use getTableScalingPercentFrozen to get scaled percent before table width changes dynamically
	// let scalePercent = 1;
	// if (isTableScalingEnabled) {
	// import from ./misc
	//   scalePercent = getStaticTableScalingPercent(
	//     tableNode,
	//     originalTableWidth || resizeState.maxSize,
	//   );
	//   resizeAmount = amount / scalePercent;
	// }

	// need to look at the resize amount and try to adjust the colgroups
	if (isOverflowed) {
		resizeAmount =
			amount < 0
				? amount
				: resizeAmount - (tableNode.attrs.width + resizeAmount - tableContainerWidth) / 2;
	}

	const newState = updateAffectedColumn(resizeState, colIndex, resizeAmount);

	// this function only updates the colgroup in DOM, it reverses the scalePercent
	// todo: change isScalingEnabled to true when reimplementing scaling
	updateColgroup(newState, tableRef, tableNode, false, shouldUseIncreasedScalingPercent);

	// use the difference in width from affected column to update overall table width
	const delta = newState.cols[colIndex].width - resizeState.cols[colIndex].width;

	if (!isOverflowed) {
		// If the table is aligned to the start and the table width is greater than the line length, we should change the alignment to center
		const shouldChangeAlignment = shouldChangeAlignmentToCenterResized(
			isTableAlignmentEnabled,
			tableNode,
			lineLength,
			newState.tableWidth + delta,
		);

		shouldChangeAlignment
			? updateTablePreview(delta, tableRef, tableNode, ALIGN_CENTER)
			: updateTablePreview(delta, tableRef, tableNode);
	}

	return {
		...newState,
		// resizeState.tableWidth sometimes is off by ~3px on load on resized table when !isOverflowed, using resizeState.maxSize instead
		tableWidth: isOverflowed ? tableContainerWidth : resizeState.maxSize + delta,
	};
};

const updateTablePreview = (
	resizeAmount: number,
	tableRef: HTMLElement | null,
	tableNode: PmNode,
	tableAligment?: AlignmentOptions,
) => {
	const currentWidth = getTableContainerElementWidth(tableNode);
	const resizingContainer = tableRef?.closest(`.${ClassName.TABLE_RESIZER_CONTAINER}`);
	const resizingItem = resizingContainer?.querySelector('.resizer-item');
	const alignmentContainer = resizingContainer?.parentElement;

	if (resizingItem) {
		const newWidth = `${currentWidth + resizeAmount}px`;
		if (tableRef) {
			tableRef.style.width = newWidth;
		}
		(resizingContainer as HTMLElement).style.width = newWidth;
		(resizingItem as HTMLElement).style.width = newWidth;

		if (tableAligment && alignmentContainer) {
			alignmentContainer.style.justifyContent = tableAligment;
		}
	}
};
