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
	akEditorGutterPaddingReduced,
	akEditorFullPageNarrowBreakout,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { TableOptions } from '../../../nodeviews/types';

import { hasTableBeenResized, hasTableColumnBeenResized } from './colgroup';
import {
	MAX_SCALING_PERCENT,
	MAX_SCALING_PERCENT_TABLES_WITH_FIXED_COLUMN_WIDTHS_OPTION,
	TABLE_MAX_WIDTH,
} from './consts';

// Translates named layouts in number values.
export function getLayoutSize(
	tableLayout: 'default' | 'wide' | 'full-width',
	containerWidth: number = 0,
	options: TableOptions,
): number {
	const { isFullWidthModeEnabled } = options;

	if (isFullWidthModeEnabled) {
		let padding: number = akEditorGutterPaddingDynamic();
		if (
			containerWidth <= akEditorFullPageNarrowBreakout &&
			expValEquals('platform_editor_preview_panel_responsiveness', 'isEnabled', true)
		) {
			padding = akEditorGutterPaddingReduced;
		}

		return containerWidth
			? Math.min(containerWidth - padding * 2, akEditorFullWidthLayoutWidth)
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
	const width = colwidth && colwidth[colwidth.length - 1];
	if (width) {
		return width;
	}
	// Not fixed, read current width from DOM
	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
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
		// TODO: ED-26961 - is there a scenario where ADF columns are SMALLER than container width?
		return calcTableColumnWidths(table).reduce((sum, width) => sum + width, 0);
	}

	return getTableContainerElementWidth(table);
};

export const getTableContainerElementWidth = (table: PMNode) => {
	return getTableContainerWidth(table);
};

// eslint-disable-next-line jsdoc/require-example
/**
 * This function is used to set the max width for table resizer container.
 * @param isCommentEditor Whether the editor is in comment mode.
 * @param isChromelessEditor Whether the editor is chromeless.
 * @param isTableScalingEnabled Whether table scaling is enabled.
 * @returns The CSS max-width value
 */
export const getTableResizerContainerMaxWidthInCSS = (
	isCommentEditor?: boolean,
	isChromelessEditor?: boolean,
	isTableScalingEnabled?: boolean,
): string => {
	const maxResizerWidthForNonCommentEditor = isTableScalingEnabled
		? `min(calc(100cqw - calc(var(--ak-editor--large-gutter-padding) * 2)), ${TABLE_MAX_WIDTH}px)`
		: `min(calc(100cqw - calc(var(--ak-editor--large-gutter-padding) * 2) - var(--ak-editor--resizer-handle-spacing)), ${TABLE_MAX_WIDTH}px)`;
	return isCommentEditor || isChromelessEditor ? '100%' : maxResizerWidthForNonCommentEditor;
};

// eslint-disable-next-line jsdoc/require-example
/**
 * This function is used in NodeView for TableResizer to set the max width for table resizer container
 * @param node The ProseMirror node representing the table.
 * @param isCommentEditor Whether the editor is in comment mode.
 * @param isChromelessEditor Whether the editor is chromeless.
 * @returns The CSS max-width value for the table resizer container.
 */
export const getTableResizerItemWidth = (
	node: PMNode,
	isCommentEditor?: boolean,
	isChromelessEditor?: boolean,
): number | undefined => {
	const tableWidthAttribute = getTableContainerWidth(node);
	if (!node.attrs.width && (isCommentEditor || isChromelessEditor)) {
		// width undefined would make .resizer-item width to be `auto`
		return undefined;
	}
	return tableWidthAttribute;
};

// eslint-disable-next-line jsdoc/require-example
/**
 * This function is used to set the CSS width value for the table resizer-item.
 * Because comment and chromeless editors don't have container-type: inline-size set,
 * we need to calculate the width based on the table node width.
 * If the table node width is not set, it will return 'auto'.
 * This is used in table toDOM
 * @param node The ProseMirror node representing the table.
 * @param isCommentEditor Whether the editor is in comment mode.
 * @param isChromelessEditor Whether the editor is chromeless.
 * @returns The CSS width value for the table container.
 */
export const getTableResizerItemWidthInCSS = (
	node: PMNode,
	isCommentEditor?: boolean,
	isChromelessEditor?: boolean,
): string => {
	const tableWidthAttribute = getTableResizerItemWidth(node, isCommentEditor, isChromelessEditor);
	return tableWidthAttribute ? `${tableWidthAttribute}px` : 'auto';
};

// eslint-disable-next-line jsdoc/require-example
/**
 * This function is used to set the table width --ak-editor-table-width CSS property for full page editor.
 * Which is applied to the table resizer container.
 * For Full page appearance, we don't need to use containerWidth from JS, as we can use cqw value.
 * So we set dynamic containerWidth from JS to CSS property.
 * @param node The ProseMirror node representing the table.
 * @param isCommentEditor Whether the editor is in comment mode.
 * @param isChromelessEditor Whether the editor is chromeless.
 * @param isTableScalingEnabled Whether table scaling is enabled.
 * @param tableWidthFromJS The width of the container element. In toDOM it'd be undefined, but will have a value from nodeView.
 * @returns The CSS width value for the table.
 */
export const getTableResizerContainerForFullPageWidthInCSS = (
	node: PMNode,
	isTableScalingEnabled?: boolean,
): string => {
	const tableWidth = getTableContainerElementWidth(node);
	// for full page appearance
	if (isTableScalingEnabled) {
		return `min(calc(100cqw - calc(var(--ak-editor--large-gutter-padding) * 2)), ${tableWidth}px)`;
	}
	return `min(calc(100cqw - calc(var(--ak-editor--large-gutter-padding) * 2) - var(--ak-editor--resizer-handle-spacing)), ${tableWidth}px)`;
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
	const renderWidth = tableRef?.parentElement?.clientWidth || tableWidth;
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
		const renderWidth = tableRef?.parentElement?.clientWidth || tableWidth;

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
