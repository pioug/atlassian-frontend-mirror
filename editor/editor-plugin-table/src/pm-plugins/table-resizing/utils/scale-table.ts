import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DomAtPos } from '@atlaskit/editor-prosemirror/utils';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';

import type { PluginInjectionAPI } from '../../../types';
import { updateColumnWidths } from '../../transforms/column-width';
import { getTableWidth } from '../../utils/nodes';
import { getLayoutSize } from '../utils/misc';
import { reduceSpace } from '../utils/resize-logic';
import {
	adjustColumnsWidths,
	getResizeState,
	getTotalWidth,
	updateColgroup,
} from '../utils/resize-state';
import type { ResizeState } from '../utils/types';

import { hasTableBeenResized, insertColgroupFromNode } from './colgroup';
import { syncStickyRowToTable } from './dom';

interface ScaleOptions {
	node: PMNode;
	prevNode: PMNode;
	start: number;
	containerWidth?: number;
	previousContainerWidth?: number;
	parentWidth?: number;
	layoutChanged?: boolean;
	isFullWidthModeEnabled?: boolean;
	isTableResizingEnabled?: boolean;
}

// Base function to trigger the actual scale on a table node.
// Will only resize/scale if a table has been previously resized.
const scale = (
	tableRef: HTMLTableElement,
	options: ScaleOptions,
	domAtPos: DomAtPos,
	isTableScalingEnabledOnCurrentTable = false,
	shouldUseIncreasedScalingPercent = false,
	isCommentEditor = false,
): ResizeState | undefined => {
	const {
		node,
		containerWidth,
		previousContainerWidth,
		prevNode,
		start,
		layoutChanged,
		isTableResizingEnabled,
	} = options;

	const maxSize = isTableResizingEnabled
		? getTableContainerWidth(node)
		: getLayoutSize(node.attrs.layout, containerWidth, {});

	const prevTableWidth = getTableWidth(prevNode);
	const previousMaxSize = isTableResizingEnabled
		? getTableContainerWidth(node)
		: getLayoutSize(prevNode.attrs.layout, previousContainerWidth, {});

	let newWidth = maxSize;

	// adjust table width if layout is updated
	const hasOverflow = prevTableWidth > previousMaxSize;

	if (layoutChanged && hasOverflow) {
		// No keep overflow if the old content can be in the new size
		const canFitInNewSize = prevTableWidth < maxSize;
		if (canFitInNewSize) {
			newWidth = maxSize;
		} else {
			// Keep the same scale.
			const overflowScale = prevTableWidth / previousMaxSize;
			newWidth = Math.floor(newWidth * overflowScale);
		}
	}

	if (node.attrs.isNumberColumnEnabled) {
		newWidth -= akEditorTableNumberColumnWidth;
	}

	const resizeState = getResizeState({
		minWidth: tableCellMinWidth,
		maxSize,
		table: node,
		tableRef,
		start,
		domAtPos,
		isTableScalingEnabled: isTableScalingEnabledOnCurrentTable,
		shouldUseIncreasedScalingPercent,
		isCommentEditor,
	});

	return scaleTableTo(resizeState, newWidth);
};

const scaleWithParent = (
	tableRef: HTMLTableElement,
	parentWidth: number,
	table: PMNode,
	start: number,
	domAtPos: DomAtPos,
	isTableScalingEnabledOnCurrentTable = false,
	shouldUseIncreasedScalingPercent = false,
	isCommentEditor = false,
) => {
	const resizeState = getResizeState({
		minWidth: tableCellMinWidth,
		maxSize: parentWidth,
		table,
		tableRef,
		start,
		domAtPos,
		isTableScalingEnabled: isTableScalingEnabledOnCurrentTable,
		shouldUseIncreasedScalingPercent,
		isCommentEditor,
	});

	if (table.attrs.isNumberColumnEnabled) {
		parentWidth -= akEditorTableNumberColumnWidth;
	}

	return scaleTableTo(resizeState, Math.floor(parentWidth));
};

// Scales the table to a given size and updates its colgroup DOM node
export function scaleTableTo(state: ResizeState, maxSize: number): ResizeState {
	const scaleFactor = maxSize / getTotalWidth(state);

	let newState = {
		...state,
		maxSize,
		cols: state.cols.map((col) => {
			const { minWidth, width } = col;
			let newColWidth = Math.floor(width * scaleFactor);
			if (newColWidth < minWidth) {
				newColWidth = minWidth;
			}
			return { ...col, width: newColWidth };
		}),
	};

	const newTotalWidth = getTotalWidth(newState);
	if (newTotalWidth > maxSize) {
		newState = reduceSpace(newState, newTotalWidth - maxSize);
	}

	return adjustColumnsWidths(newState, maxSize);
}

export const previewScaleTable = (
	tableRef: HTMLTableElement | null | undefined,
	options: ScaleOptions,
	domAtPos: DomAtPos,
	isTableScalingEnabled: boolean = false,
	isTableWithFixedColumnWidthsOptionEnabled: boolean = false,
	isCommentEditor: boolean = false,
) => {
	const { node, start, parentWidth } = options;

	if (!tableRef) {
		return;
	}

	if (parentWidth) {
		const isNumberColumnEnabled = node.attrs.isNumberColumnEnabled;
		const width = isNumberColumnEnabled
			? parentWidth - akEditorTableNumberColumnWidth
			: parentWidth;
		tableRef.style.width = `${width}px`;
	}

	let isTableScalingEnabledOnCurrentTable = isTableScalingEnabled;
	const isTableScalingWithFixedColumnWidthsOptionEnabled =
		isTableScalingEnabled && isTableWithFixedColumnWidthsOptionEnabled;

	if (isTableScalingWithFixedColumnWidthsOptionEnabled) {
		isTableScalingEnabledOnCurrentTable =
			isTableScalingEnabled && node.attrs.displayMode !== 'fixed';
	}
	// If the table hasn't been resize, the colgroup 48px width values will gracefully scale down.
	// If we are scaling the table down with isTableScalingEnabled, the colgroup widths may be scaled to a value that is not 48px.
	if (!hasTableBeenResized(node) && !isTableScalingEnabledOnCurrentTable) {
		syncStickyRowToTable(tableRef);
		return;
	}

	const shouldUseIncreasedScalingPercent =
		isTableScalingWithFixedColumnWidthsOptionEnabled || (isTableScalingEnabled && isCommentEditor);

	const resizeState = parentWidth
		? scaleWithParent(
				tableRef,
				parentWidth,
				node,
				start,
				domAtPos,
				false, // Here isTableScalingEnabled = false
				shouldUseIncreasedScalingPercent,
			)
		: scale(tableRef, options, domAtPos, false, shouldUseIncreasedScalingPercent);

	if (resizeState) {
		updateColgroup(resizeState, tableRef, node, false, 1);
	}
};

// Scale the table to meet new requirements (col, layout change etc)
export const scaleTable =
	(
		tableRef: HTMLTableElement | null | undefined,
		options: ScaleOptions,
		domAtPos: DomAtPos,
		api: PluginInjectionAPI | undefined | null,
		isTableScalingEnabledOnCurrentTable = false,
		shouldUseIncreasedScalingPercent = false,
		isCommentEditor = false,
	) =>
	(tr: Transaction) => {
		if (!tableRef) {
			return tr;
		}
		const { node, start, parentWidth, layoutChanged } = options;
		// If a table has not been resized yet, columns should be auto.
		if (hasTableBeenResized(node) === false) {
			// If its not a re-sized table, we still want to re-create cols
			// To force reflow of columns upon delete.
			if (!isTableScalingEnabledOnCurrentTable) {
				const isTableScalingEnabled = false;
				insertColgroupFromNode(
					tableRef,
					node,
					isTableScalingEnabled,
					undefined,
					shouldUseIncreasedScalingPercent,
					isCommentEditor,
				);
			}
			tr.setMeta('scrollIntoView', false);
			return tr;
		}

		let resizeState;
		if (parentWidth) {
			resizeState = scaleWithParent(
				tableRef,
				parentWidth,
				node,
				start,
				domAtPos,
				isTableScalingEnabledOnCurrentTable,
				shouldUseIncreasedScalingPercent,
			);
		} else {
			resizeState = scale(
				tableRef,
				options,
				domAtPos,
				isTableScalingEnabledOnCurrentTable,
				shouldUseIncreasedScalingPercent,
			);
		}

		if (resizeState) {
			tr = updateColumnWidths(resizeState, node, start, api)(tr);

			if (tr.docChanged) {
				tr.setMeta('scrollIntoView', false);
				// TODO: ED-8995
				// We need to do this check to reduce the number of race conditions when working with tables.
				// This metadata is been used in the sendTransaction function in the Collab plugin
				/* Added !layoutChanged check here to solve unnecessary scroll bar after publish when click on breakout button multiple times and publish
           scaleTable is only called once every time a breakout button is clicked, so it is safe not to add the meta 'scaleTable' to the tr.
           Leaving the tr.setMeta('scaleTable', true) here for race conditions that we aren't aware of.
         */
				!layoutChanged && tr.setMeta('scaleTable', true);
				return tr;
			}
		}

		return tr;
	};
