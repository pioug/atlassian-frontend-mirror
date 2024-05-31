import type { CellAttributes } from '@atlaskit/adf-schema';
import {
	getParentNodeWidth,
	getTableContainerWidth,
	layoutToWidth,
} from '@atlaskit/editor-common/node-width';
import { calcTableWidth } from '@atlaskit/editor-common/styles';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import { getBreakpoint, mapBreakpointToLayoutMaxWidth } from '@atlaskit/editor-common/ui';
import { calcTableColumnWidths, containsClassName } from '@atlaskit/editor-common/utils';
import type { NodeSpec, Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-shared-styles';

import type { TableOptions } from '../../../nodeviews/types';

import { hasTableBeenResized } from './colgroup';
import { MAX_SCALING_PERCENT } from './consts';

// Translates named layouts in number values.
export function getLayoutSize(
	tableLayout: 'default' | 'wide' | 'full-width',
	containerWidth: number = 0,
	options: TableOptions,
): number {
	const { isFullWidthModeEnabled } = options;

	if (isFullWidthModeEnabled) {
		return containerWidth
			? Math.min(containerWidth - akEditorGutterPadding * 2, akEditorFullWidthLayoutWidth)
			: akEditorFullWidthLayoutWidth;
	}

	const calculatedTableWidth = calcTableWidth(tableLayout, containerWidth, true);
	if (calculatedTableWidth !== 'inherit') {
		return calculatedTableWidth;
	}

	return layoutToWidth[tableLayout] || containerWidth;
}

export function getDefaultLayoutMaxWidth(containerWidth?: number): number {
	return mapBreakpointToLayoutMaxWidth(getBreakpoint(containerWidth));
}

// Does the current position point at a cell.
export function pointsAtCell($pos: ResolvedPos) {
	return (
		($pos.parent.type.spec as NodeSpec & { tableRole: string }).tableRole === 'row' &&
		$pos.nodeAfter
	);
}

// Get the current col width, handles colspan.
export function currentColWidth(
	view: EditorView,
	cellPos: number,
	{ colspan, colwidth }: CellAttributes,
): number {
	let width = colwidth && colwidth[colwidth.length - 1];
	if (width) {
		return width;
	}
	// Not fixed, read current width from DOM
	let domWidth = (view.domAtPos(cellPos + 1).node as HTMLElement).offsetWidth;
	let parts = colspan || 0;
	if (colwidth) {
		for (let i = 0; i < (colspan || 0); i++) {
			if (colwidth[i]) {
				domWidth -= colwidth[i];
				parts--;
			}
		}
	}

	return domWidth / parts;
}

// Attempts to find a parent TD/TH depending on target element.
export function domCellAround(target: HTMLElement | null): HTMLElement | null {
	while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
		target = containsClassName(target, 'ProseMirror')
			? null
			: (target.parentNode as HTMLElement | null);
	}
	return target;
}

interface getTableMaxWidthProps {
	table: PMNode;
	tableStart: number;
	state: EditorState;
	layout: 'default' | 'wide' | 'full-width';
	getEditorContainerWidth: GetEditorContainerWidth;
}

export const getTableMaxWidth = ({
	table,
	tableStart,
	state,
	layout,
	getEditorContainerWidth,
}: getTableMaxWidthProps) => {
	const containerWidth = getEditorContainerWidth();
	const parentWidth = getParentNodeWidth(tableStart, state, containerWidth);

	let maxWidth =
		parentWidth || table.attrs.width || getLayoutSize(layout, containerWidth.width, {});

	if (table.attrs.isNumberColumnEnabled) {
		maxWidth -= akEditorTableNumberColumnWidth;
	}

	return maxWidth as number;
};

/**
 *
 * @param table
 * @returns calculated width of <table /> element derived from sum of colwidths on tableCell or tableHeader nodes or falls back to container width
 */
export const getTableElementWidth = (table: PMNode) => {
	if (hasTableBeenResized(table)) {
		// TODO: is there a scenario where ADF columns are SMALLER than container width?
		return calcTableColumnWidths(table).reduce((sum, width) => sum + width, 0);
	}

	return getTableContainerElementWidth(table);
};

export const getTableContainerElementWidth = (table: PMNode) => {
	return getTableContainerWidth(table);
};

export const getTableScalingPercent = (table: PMNode, tableRef: HTMLElement | null) => {
	const tableWidth = getTableContainerElementWidth(table);
	let renderWidth = tableRef?.parentElement?.clientWidth || tableWidth;
	// minus 1 here to avoid any 1px scroll in Firefox
	let scalePercent = (renderWidth - 1) / tableWidth;
	scalePercent = Math.max(scalePercent, 1 - MAX_SCALING_PERCENT);
	return Math.min(scalePercent, 1);
};

export const getStaticTableScalingPercent = (table: PMNode, tableRenderWidth: number) => {
	const tableWidth = getTableContainerElementWidth(table);
	// minus 1 here to avoid any 1px scroll in Firefox
	let scalePercent = (tableRenderWidth - 1) / tableWidth;
	scalePercent = Math.max(scalePercent, 1 - MAX_SCALING_PERCENT);
	return Math.min(scalePercent, 1);
};
