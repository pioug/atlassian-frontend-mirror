import type { PaletteColor } from './types';

/**
 * Default number of columns in the color picker
 */
export const DEFAULT_COLOR_PICKER_COLUMNS = 7;

/**
 * Splits a palette array into rows based on the specified number of columns
 * @param palette - Array of palette colors
 * @param cols - Number of columns per row
 * @returns Array of color rows
 */
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

/**
 * Finds the row and column indices of a selected color in the palette grid
 * @param colorsPerRow - 2D array of colors organized by rows
 * @param selectedColor - The currently selected color value
 * @returns Object containing row and column indices
 */
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

/**
 * Finds the row and column indices of a selected color in a flat palette array
 * @param palette - Flat array of palette colors
 * @param selectedColor - The currently selected color value
 * @param cols - Number of columns per row
 * @returns Object containing row and column indices
 */
export function getSelectedRowAndColumnFromPalette(
	palette: PaletteColor[],
	selectedColor: string | null,
	cols: number = DEFAULT_COLOR_PICKER_COLUMNS,
) {
	const colorsPerRow = getColorsPerRowFromPalette(palette, cols);
	return getSelectedRowAndColumn(colorsPerRow, selectedColor);
}

/**
 * Extracts the actual color value from a CSS variable expression
 * Handles both token variables and fallback values
 * @param variableExpression - CSS variable expression (e.g., "var(--ds-background-accent-blue-subtle, #0052CC)")
 * @returns The resolved color value or empty string if not found
 */
export const getTokenCSSVariableValue = (variableExpression: string): string => {
	// Match CSS variable pattern: var(--variable-name, fallback)
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const matcher = variableExpression.match(/var\(([^,\)]+)(,.*)?/);
	if (matcher) {
		const variable = matcher[1].trim();
		const fallback = matcher[2] ? matcher[2].replace(',', '').trim() : '';

		// Return fallback if we're in a server environment
		if (typeof document === 'undefined') {
			return fallback;
		}

		// Get the computed value from the document
		const value = window
			.getComputedStyle(document.documentElement)
			.getPropertyValue(variable)
			.trim();

		return value || fallback;
	}

	return '';
};
