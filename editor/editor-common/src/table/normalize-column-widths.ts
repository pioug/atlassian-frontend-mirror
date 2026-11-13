import {
	akEditorTableLegacyCellMinWidth,
	akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-shared-styles/constants';

import { tableCellBorderWidth, tableCellMinWidth } from '../styles/shared/table';

/**
 * Fits columns to a saved table width, independently of the viewport. Zero widths share the
 * remaining space; minimum widths can require overflow when the saved table is too narrow.
 */
export const normalizeTableColumnWidths = ({
	columnWidths,
	isNumberColumnEnabled,
	skipMinWidth = false,
	tableWidth,
}: {
	columnWidths: number[];
	isNumberColumnEnabled: boolean;
	skipMinWidth?: boolean;
	tableWidth: number;
}): number[] => {
	const unsizedCount = columnWidths.filter((width) => width === 0).length;
	const minWidth = skipMinWidth
		? 0
		: unsizedCount && unsizedCount < columnWidths.length
			? akEditorTableLegacyCellMinWidth
			: tableCellMinWidth;
	let availableWidth = Math.max(
		tableWidth -
			tableCellBorderWidth -
			(isNumberColumnEnabled ? akEditorTableNumberColumnWidth : 0),
		columnWidths.length * minWidth,
	);
	const widths = columnWidths.map((width) =>
		width ? Math.max(width - tableCellBorderWidth, minWidth) : 0,
	);
	let remaining = columnWidths.flatMap((width, index) => (width ? [index] : []));
	if (unsizedCount) {
		const sizedTotal = widths.reduce((sum, width) => sum + width, 0);
		const unsizedWidth = Math.max((availableWidth - sizedTotal) / unsizedCount, minWidth);
		columnWidths.forEach((width, index) => {
			if (!width) {
				widths[index] = unsizedWidth;
			}
		});
		availableWidth -= unsizedWidth * unsizedCount;
	}
	while (remaining.length) {
		const total = remaining.reduce((sum, index) => sum + widths[index], 0);
		const scale = total ? availableWidth / total : 0;
		const constrained = remaining.filter((index) => widths[index] * scale < minWidth);
		if (!constrained.length) {
			remaining.forEach((index) => {
				widths[index] = total ? widths[index] * scale : availableWidth / remaining.length;
			});
			break;
		}
		constrained.forEach((index) => {
			widths[index] = minWidth;
			availableWidth -= minWidth;
		});
		remaining = remaining.filter((index) => !constrained.includes(index));
	}
	return widths;
};
