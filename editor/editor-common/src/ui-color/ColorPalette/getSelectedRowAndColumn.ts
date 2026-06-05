import type { PaletteColor } from './Palettes/type';

export function getSelectedRowAndColumn(
	colorsPerRow: PaletteColor[][],
	selectedColor: string | null,
): {
	selectedRowIndex: number;
	selectedColumnIndex: number;
} {
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
