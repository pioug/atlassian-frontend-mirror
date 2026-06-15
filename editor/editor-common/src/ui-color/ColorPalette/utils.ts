import { getSelectedRowAndColumn } from './getSelectedRowAndColumn';
import type { PaletteColor } from './Palettes/type';

export const DEFAULT_COLOR_PICKER_COLUMNS = 7;

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const CSS_VAR_EXPRESSION_REGEX = /var\(([^,\)]+)(,.*)?\)/;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getColorsPerRowFromPalette(
	palette: PaletteColor[],
	cols: number = DEFAULT_COLOR_PICKER_COLUMNS,
): PaletteColor[][] {
	return palette.reduce((resultArray: PaletteColor[][], item: PaletteColor, index: number) => {
		const chunkIndex = Math.floor(index / cols);

		resultArray[chunkIndex] = resultArray[chunkIndex] || []; // start a new chunk
		resultArray[chunkIndex].push(item);

		return resultArray;
	}, []);
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getSelectedRowAndColumnFromPalette(
	palette: PaletteColor[],
	selectedColor: string | null,
	cols: number = DEFAULT_COLOR_PICKER_COLUMNS,
): {
	selectedColumnIndex: number;
	selectedRowIndex: number;
} {
	const colorsPerRow = getColorsPerRowFromPalette(palette, cols);
	return getSelectedRowAndColumn(colorsPerRow, selectedColor);
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getTokenCSSVariableValue = (variableExpression: string): string => {
	const matcher = variableExpression.match(CSS_VAR_EXPRESSION_REGEX);
	if (matcher) {
		const variable = matcher[1].trim();
		const fallback = matcher[2] ? matcher[2].replace(',', '').trim() : '';
		if (typeof document === 'undefined') {
			return fallback;
		}
		const value = window
			.getComputedStyle(document.documentElement)
			.getPropertyValue(variable)
			.trim();

		return value || fallback;
	}

	return '';
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getSelectedRowAndColumn } from './getSelectedRowAndColumn';
