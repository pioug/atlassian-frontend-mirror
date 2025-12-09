import type { CSSProperties } from 'react';
import React from 'react';

import { tableCellBorderWidth, tableCellMinWidth } from '@atlaskit/editor-common/styles';
import {
	akEditorTableNumberColumnWidth,
	akEditorTableLegacyCellMinWidth,
	akEditorTableCellMinWidth,
} from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import type { SharedTableProps } from './types';
import { useFeatureFlags } from '../../../use-feature-flags';
import type { RendererContextProps } from '../../../renderer-context';
import { useRendererContext } from '../../../renderer-context';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

// we allow scaling down column widths by no more than 30%
// this intends to reduce unwanted scrolling in the Renderer in these scenarios:
// User A creates a table with column widths → User B views it on a smaller screen
// User A creates a table with column widths → User A views it with reduced viewport space (eg. Confluence sidebar is open)
const MAX_SCALING_PERCENT = 0.3;
const MAX_SCALING_PERCENT_TABLES_WITH_FIXED_COLUMN_WIDTHS_OPTION = 0.4;

const isTableColumnResized = (columnWidths: Array<number>) => {
	const filteredWidths = columnWidths.filter((width) => width !== 0);
	return !!filteredWidths.length;
};

const fixColumnWidth = ({
	columnWidth,
	zeroWidthColumnsCount,
	scaleDownPercent,
}: {
	columnWidth: number;
	scaleDownPercent: number;
	zeroWidthColumnsCount: number;
}): number => {
	if (columnWidth === 0) {
		return columnWidth;
	}

	// If the tables total width (including no zero widths col or cols without width) is less than the current layout
	// We scale up the columns to meet the minimum of the table layout.
	if (zeroWidthColumnsCount === 0 && scaleDownPercent) {
		return Math.max(Math.floor((1 - scaleDownPercent) * columnWidth), tableCellMinWidth);
	}

	return Math.max(
		// We need to take tableCellBorderWidth, to avoid unnecessary overflow.
		columnWidth - tableCellBorderWidth,
		zeroWidthColumnsCount ? akEditorTableLegacyCellMinWidth : tableCellMinWidth,
	);
};

interface ScaleOptions {
	isNumberColumnEnabled: boolean;
	maxScale: number;
	renderWidth: number;
	tableWidth: number;
}
const calcScalePercent = ({
	renderWidth,
	tableWidth,
	maxScale,
	isNumberColumnEnabled,
}: ScaleOptions) => {
	const noNumColumnScalePercent = renderWidth / tableWidth;
	// when numbered column is enabled, we need to calculate the scale percent without the akEditorTableNumberColumnWidth
	// As numbered column width is not scaled down
	const numColumnScalePercent =
		(renderWidth - akEditorTableNumberColumnWidth) / (tableWidth - akEditorTableNumberColumnWidth);
	const diffPercent = 1 - noNumColumnScalePercent;

	return diffPercent < maxScale
		? isNumberColumnEnabled
			? 1 - numColumnScalePercent
			: diffPercent
		: maxScale;
};

export const colWidthSum = (columnWidths: number[]) =>
	columnWidths.reduce((prev, curr) => curr + prev, 0);

const renderScaleDownColgroup = (
	props: SharedTableProps & {
		isTableFixedColumnWidthsOptionEnabled: boolean;
		isTableScalingEnabled: boolean;
		isTopLevelRenderer?: boolean;
	},
): CSSProperties[] | null => {
	const {
		columnWidths,
		isNumberColumnEnabled,
		renderWidth,
		tableNode,
		rendererAppearance,
		isInsideOfBlockNode,
		isInsideOfTable,
		isinsideMultiBodiedExtension,
		isTableScalingEnabled,
		isTableFixedColumnWidthsOptionEnabled,
		allowTableResizing,
		isTopLevelRenderer,
	} = props;
	if (
		!columnWidths ||
		(columnWidths.every((width) => width === 0) && fg('platform_editor_numbered_column_in_include'))
	) {
		return [];
	}

	const tableColumnResized = isTableColumnResized(columnWidths);
	const noOfColumns = columnWidths.length;
	let targetWidths;

	// This is a fix for ED-23259
	// Some extensions (for ex: Page Properties or Excerpt) do not renderer tables directly inside themselves. They use ReactRenderer.
	// So if we add a check like isInsideExtension (similar to exising isInsideBlockNode), it will fail, and to the only way to learn
	// if the table is rendered inside another node, is to check if the Renderer itself is nested.
	const isRendererNested = isTopLevelRenderer === false;

	// appearance == comment && allowTableResizing && !tableNode?.attrs.width, means it is a comment
	// appearance == comment && !allowTableResizing && !tableNode?.attrs.width, means it is a inline comment
	// When comment and inline comment table width inherits from the parent container, we want tableContainerWidth === renderWidth

	// Tables with numbered columns inside of extensions cannot use the renderWidth when it is 0. In this case, it should
	// explicitly use the width coming from the table node as the final table container width.
	const tableContainerWidth =
		(rendererAppearance === 'comment' && !tableNode?.attrs.width) ||
		(isRendererNested && (!fg('platform_fix_nested_num_column_scaling') || !isNumberColumnEnabled))
			? renderWidth
			: getTableContainerWidth(tableNode);

	if (
		allowTableResizing &&
		!isInsideOfBlockNode &&
		!isInsideOfTable &&
		!isinsideMultiBodiedExtension &&
		!tableColumnResized
	) {
		// when no columns are resized, each column should have equal width, equals to tableWidth / noOfColumns
		const tableWidth =
			(isNumberColumnEnabled
				? tableContainerWidth - akEditorTableNumberColumnWidth
				: tableContainerWidth) - 1;

		const defaultColumnWidth = tableWidth / noOfColumns;
		targetWidths = new Array(noOfColumns).fill(defaultColumnWidth);
	} else if (!tableColumnResized) {
		return null;
	}

	const sumOfColumns = colWidthSum(columnWidths);

	// tables in the wild may be smaller than table container width (col resizing bugs, created before custom widths etc.)
	// this causes issues with num column scaling as we add a new table column in renderer
	const isTableSmallerThanContainer = sumOfColumns < tableContainerWidth - 1;

	const forceScaleForNumColumn =
		isTableScalingEnabled && isNumberColumnEnabled && tableColumnResized;

	// when table resized and number column is enabled, we need to scale down the table in render
	if (forceScaleForNumColumn) {
		const calculatedTableContainerWidth =
			rendererAppearance === 'comment' ? sumOfColumns : tableContainerWidth;
		const scalePercentage = +(
			(calculatedTableContainerWidth - akEditorTableNumberColumnWidth) /
			calculatedTableContainerWidth
		);

		const targetMaxWidth = calculatedTableContainerWidth - akEditorTableNumberColumnWidth;

		let totalWidthAfterScale = 0;
		const newScaledTargetWidths = columnWidths.map((width) => {
			// we need to scale each column UP, to ensure total width of table matches table container
			const patchedWidth = isTableSmallerThanContainer
				? (width / sumOfColumns) * (calculatedTableContainerWidth - 1)
				: width;
			const newWidth = Math.floor(patchedWidth * scalePercentage);
			totalWidthAfterScale += newWidth;
			return newWidth;
		});

		const diff = targetMaxWidth - totalWidthAfterScale;
		targetWidths = newScaledTargetWidths;

		if (diff > 0 || (diff < 0 && Math.abs(diff) < tableCellMinWidth)) {
			let updated = false;
			targetWidths = targetWidths.map((width: number) => {
				if (!updated && width + diff > tableCellMinWidth) {
					updated = true;
					width += diff;
				}
				return width;
			});
		}
	}

	targetWidths = targetWidths || columnWidths;

	// @see ED-6056
	const maxTableWidth = renderWidth < tableContainerWidth ? renderWidth : tableContainerWidth;

	let tableWidth = isNumberColumnEnabled ? akEditorTableNumberColumnWidth : 0;
	let minTableWidth = tableWidth;
	let zeroWidthColumnsCount = 0;

	targetWidths.forEach((width) => {
		if (width) {
			tableWidth += Math.ceil(width);
		} else {
			zeroWidthColumnsCount += 1;
		}
		minTableWidth += Math.ceil(width) || akEditorTableLegacyCellMinWidth;
	});
	let cellMinWidth = 0;
	let scaleDownPercent = 0;

	const isTableScalingWithFixedColumnWidthsOptionEnabled =
		isTableScalingEnabled && isTableFixedColumnWidthsOptionEnabled;

	const isTableWidthFixed =
		isTableScalingWithFixedColumnWidthsOptionEnabled &&
		props.tableNode?.attrs.displayMode === 'fixed';
	const maxScalingPercent =
		isTableScalingWithFixedColumnWidthsOptionEnabled ||
		(isTableScalingEnabled && rendererAppearance === 'comment')
			? MAX_SCALING_PERCENT_TABLES_WITH_FIXED_COLUMN_WIDTHS_OPTION
			: MAX_SCALING_PERCENT;

	// fixes migration tables with zero-width columns
	if (zeroWidthColumnsCount > 0) {
		if (minTableWidth > maxTableWidth) {
			const minWidth = Math.ceil((maxTableWidth - tableWidth) / zeroWidthColumnsCount);
			cellMinWidth =
				minWidth < akEditorTableLegacyCellMinWidth ? akEditorTableLegacyCellMinWidth : minWidth;
		}
	}
	// scaling down
	else if (renderWidth < tableWidth && !isTableWidthFixed) {
		const shouldTable100ScaleDown =
			rendererAppearance === 'comment' && allowTableResizing && !tableNode?.attrs.width;
		scaleDownPercent = calcScalePercent({
			renderWidth,
			tableWidth,
			maxScale: fg('platform-ssr-table-resize')
				? maxScalingPercent
				: shouldTable100ScaleDown
					? 1
					: maxScalingPercent,
			isNumberColumnEnabled: isNumberColumnEnabled,
		});
	}
	if (
		isNumberColumnEnabled &&
		(tableWidth < maxTableWidth || maxTableWidth === 0) &&
		expValEquals('editor_prevent_numbered_column_too_big_jira_1', 'isEnabled', true)
	) {
		const fixedColWidths = targetWidths.map(
			(width) =>
				fixColumnWidth({ columnWidth: width, zeroWidthColumnsCount, scaleDownPercent }) ||
				cellMinWidth,
		);
		const sumFixedColumnWidths = colWidthSum(fixedColWidths);

		return fixedColWidths.map((colWidth) => {
			const width = Math.max(colWidth, cellMinWidth);

			if (colWidth > akEditorTableCellMinWidth) {
				// To make sure the numbered column isn't scaled, use
				// percentages for the other columns.
				// Calculate the percentage based on the sum of the fixed column widths
				return {
					width: `${(width / sumFixedColumnWidths) * 100}%`,
				};
			} else {
				// If the column is equal to or less than the minimum cell width, we need to return a fixed pixel width.
				// This is to prevent columns being scaled below the minimum cell width.
				const style = width ? { width: `${width}px` } : {};
				return style;
			}
		});
	}

	/**
	 * When cleaning up editor_prevent_numbered_column_too_big_jira_1 experiment,
	 * resuse the fixedColWidths const to avoid code duplication.
	 */
	return targetWidths.map((colWidth) => {
		const width =
			fixColumnWidth({ columnWidth: colWidth, zeroWidthColumnsCount, scaleDownPercent }) ||
			cellMinWidth;
		const style = width ? { width: `${width}px` } : {};
		return style;
	});
};

export const Colgroup = (props: SharedTableProps): React.JSX.Element | null => {
	const { isTopLevelRenderer } = useRendererContext();
	const { columnWidths, isNumberColumnEnabled } = props;
	const flags = useFeatureFlags() as RendererContextProps['featureFlags'] | undefined;

	if (!columnWidths) {
		return null;
	}

	const colStyles = renderScaleDownColgroup({
		...props,
		isTopLevelRenderer,
		isTableScalingEnabled:
			props.rendererAppearance === 'full-page' ||
			props.rendererAppearance === 'full-width' ||
			(props.rendererAppearance === 'max' &&
				expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true)) ||
			(props.rendererAppearance === 'comment' &&
				editorExperiment('support_table_in_comment', true, { exposure: true })) ||
			(props.rendererAppearance === 'comment' &&
				editorExperiment('support_table_in_comment_jira', true, { exposure: true })),
		isTableFixedColumnWidthsOptionEnabled:
			!!(
				flags &&
				'tableWithFixedColumnWidthsOption' in flags &&
				flags.tableWithFixedColumnWidthsOption
			) &&
			(props.rendererAppearance === 'full-page' ||
				props.rendererAppearance === 'full-width' ||
				(props.rendererAppearance === 'max' &&
					expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true))),
	});

	if (!colStyles) {
		return null;
	}

	return (
		<colgroup>
			{isNumberColumnEnabled && (
				<col
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					style={{ width: akEditorTableNumberColumnWidth }}
					data-test-id={'num'}
				/>
			)}
			{colStyles.map((style, idx) => (
				// Ignored via go/ees005
				// eslint-disable-next-line react/no-array-index-key, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<col key={idx} style={style} />
			))}
		</colgroup>
	);
};
