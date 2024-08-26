import type { CellAttributes } from '@atlaskit/adf-schema';
import {
	getParentNodeWidth,
	getTableContainerWidth,
	layoutToWidth,
} from '@atlaskit/editor-common/node-width';
import { calcTableWidth } from '@atlaskit/editor-common/styles';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import { calcTableColumnWidths } from '@atlaskit/editor-common/utils';
import type { NodeSpec, Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorFullWidthLayoutWidth,
	akEditorGutterPaddingDynamic,
	akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-shared-styles';

import type { TableOptions } from '../../../nodeviews/types';

import { hasTableBeenResized, hasTableColumnBeenResized } from './colgroup';
import {
	MAX_SCALING_PERCENT,
	MAX_SCALING_PERCENT_TABLES_WITH_FIXED_COLUMN_WIDTHS_OPTION,
} from './consts';

// Translates named layouts in number values.
export function getLayoutSize(
	tableLayout: 'default' | 'wide' | 'full-width',
	containerWidth: number = 0,
	options: TableOptions,
): number {
	const { isFullWidthModeEnabled } = options;

	if (isFullWidthModeEnabled) {
		return containerWidth
			? Math.min(containerWidth - akEditorGutterPaddingDynamic() * 2, akEditorFullWidthLayoutWidth)
			: akEditorFullWidthLayoutWidth;
	}

	const calculatedTableWidth = calcTableWidth(tableLayout, containerWidth, true);
	if (calculatedTableWidth !== 'inherit') {
		return calculatedTableWidth;
	}

	return layoutToWidth[tableLayout] || containerWidth;
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

export const getTableScalingPercent = (
	table: PMNode,
	tableRef: HTMLElement | null,
	shouldUseIncreasedScalingPercent?: boolean,
) => {
	const maxScalingPercent = shouldUseIncreasedScalingPercent
		? MAX_SCALING_PERCENT_TABLES_WITH_FIXED_COLUMN_WIDTHS_OPTION
		: MAX_SCALING_PERCENT;

	const tableWidth = getTableContainerElementWidth(table);
	let renderWidth = tableRef?.parentElement?.clientWidth || tableWidth;
	// minus 1 here to avoid any 1px scroll in Firefox
	let scalePercent = (renderWidth - 1) / tableWidth;
	scalePercent = Math.max(scalePercent, 1 - maxScalingPercent);

	return Math.min(scalePercent, 1);
};

// This function is used to default and full-width tables in Comment/Chromeless editors
// These tables don't have node.attrs.width set. Their pm-table-wrapper width depend on the editor container width.
// actual table node width can be calculated as sum of colwidth values if table's columns were resized.
// If colwidth are not set, table columns are not resized, they all are equal widths.
export const getScalingPercentForTableWithoutWidth = (
	table: PMNode,
	tableRef: HTMLElement | null,
) => {
	// are table columns resized
	if (hasTableColumnBeenResized(table)) {
		const tableWidth = calcTableColumnWidths(table).reduce((sum, width) => sum + width, 0);
		let renderWidth = tableRef?.parentElement?.clientWidth || tableWidth;

		// minus 1 here to avoid any 1px scroll in Firefox
		return (renderWidth - 1) / tableWidth;
	}

	// When table cols are not resized and table width is not set,
	// tableWidth is equal to renderWidth
	return 1;
};

export const getStaticTableScalingPercent = (
	table: PMNode,
	tableRenderWidth: number,
	shouldUseIncreasedScalingPercent?: boolean,
) => {
	const maxScalingPercent = shouldUseIncreasedScalingPercent
		? MAX_SCALING_PERCENT_TABLES_WITH_FIXED_COLUMN_WIDTHS_OPTION
		: MAX_SCALING_PERCENT;

	const tableWidth = getTableContainerElementWidth(table);
	// minus 1 here to avoid any 1px scroll in Firefox
	let scalePercent = (tableRenderWidth - 1) / tableWidth;
	scalePercent = Math.max(scalePercent, 1 - maxScalingPercent);
	return Math.min(scalePercent, 1);
};
