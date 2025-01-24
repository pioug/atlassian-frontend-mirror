// Resize a given column by an amount from the current state
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

import { growColumn, shrinkColumn } from './resize-logic';
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
