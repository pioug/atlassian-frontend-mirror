import type { PaletteColor } from './Palettes/type';

export const DEFAULT_COLOR_PICKER_COLUMNS = 7;

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

export function getSelectedRowAndColumn(
	colorsPerRow: PaletteColor[][],
	selectedColor: string | null,
) {
	let selectedRowIndex = -1;
	let selectedColumnIndex = -1;

	colorsPerRow.forEach((row, rowIndex) => {
		row.forEach(({ value }, columnIndex) => {
			if (value === selectedColor) {
				selectedRowIndex = rowIndex;
				selectedColumnIndex = columnIndex;
			}
		});
	});

	return {
		selectedRowIndex,
		selectedColumnIndex,
	};
}

export function getSelectedRowAndColumnFromPalette(
	palette: PaletteColor[],
	selectedColor: string | null,
	cols: number = DEFAULT_COLOR_PICKER_COLUMNS,
) {
	const colorsPerRow = getColorsPerRowFromPalette(palette, cols);
	return getSelectedRowAndColumn(colorsPerRow, selectedColor);
}

export const getTokenCSSVariableValue = (variableExpression: string): string => {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const matcher = variableExpression.match(/var\(([^,\)]+)(,.*)?\)/);
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
