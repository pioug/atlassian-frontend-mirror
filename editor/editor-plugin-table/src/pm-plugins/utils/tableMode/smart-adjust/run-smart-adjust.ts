import {
	type TableMeasurement,
	getTableMeasurement,
} from '../../../transforms/content-mode';

import { distributeByEvenShareRatio, sumWidths } from './distribute-column-widths';

const measureWithIntrinsicWidth = (
	tableRef: HTMLTableElement,
	resizerContainer: HTMLElement | undefined | null,
	resizerItem: HTMLElement | undefined | null,
): TableMeasurement => {
	if (resizerContainer) {
		resizerContainer.style.width = 'var(--ak-editor-table-width)';
		resizerContainer.style.setProperty('--ak-editor-table-width', 'max-content');
	}
	if (resizerItem) {
		resizerItem.style.width = 'max-content';
	}
	const prevTableWidth = tableRef.style.width;
	const prevTableMaxWidth = tableRef.style.maxWidth;
	const prevTableMinWidth = tableRef.style.minWidth;
	tableRef.style.setProperty('width', 'max-content', 'important');
	tableRef.style.setProperty('max-width', 'none', 'important');
	tableRef.style.setProperty('min-width', '0', 'important');
	try {
		return getTableMeasurement(tableRef);
	} finally {
		tableRef.style.width = prevTableWidth;
		tableRef.style.maxWidth = prevTableMaxWidth;
		tableRef.style.minWidth = prevTableMinWidth;
	}
};

export const restoreResizerContainer = (resizerContainer: HTMLElement | undefined | null): void => {
	if (!resizerContainer) {
		return;
	}
	resizerContainer.style.width = 'var(--ak-editor-table-width)';
	resizerContainer.style.removeProperty('--ak-editor-table-width');
};

/**
 * Smart-adjust: measure unconstrained max-content per column, then clamp via
 * `distributeByEvenShareRatio`.
 */
export const runSmartAdjust = (
	tableRef: HTMLTableElement,
	resizerContainer: HTMLElement | undefined | null,
	resizerItem: HTMLElement | undefined | null,
	editorContainerWidthFromApi: number | undefined,
): TableMeasurement => {
	const preferredMeasurement = measureWithIntrinsicWidth(
		tableRef,
		resizerContainer,
		resizerItem,
	);

	const desiredWidths = preferredMeasurement.colWidths;
	const editorContainerWidth = editorContainerWidthFromApi ?? sumWidths(desiredWidths);
	const colWidths = distributeByEvenShareRatio(desiredWidths, editorContainerWidth);

	return {
		...preferredMeasurement,
		colWidths,
		tableWidth: sumWidths(colWidths),
	};
};
