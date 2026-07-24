import { tableBackgroundColorNames } from '@atlaskit/adf-schema/tableNodes';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette/background';

const tableCellBackgroundColorVariablePrefix = '--ak-editor-table-cell-background';

const getTableCellBackgroundColorVariableName = (colorName: string) =>
	`${tableCellBackgroundColorVariablePrefix}-${colorName.replace(/\s+/gu, '-')}`;

/**
 * CSS custom properties for every named table cell background color.
 *
 * Compiled consumers can use these with static cssMap/cssMapScoped selectors to
 * avoid rendering a runtime <style> tag while still deriving the themed palette
 * value from tableBackgroundColorNames + hexToEditorBackgroundPaletteColor.
 */
export const tableCellBackgroundColorVariablesForCompiled: Record<string, string> = Array.from(
	tableBackgroundColorNames.entries(),
).reduce<Record<string, string>>((acc, [colorName, hexColor]) => {
	const paletteColorValue = hexToEditorBackgroundPaletteColor(hexColor);

	if (paletteColorValue) {
		acc[getTableCellBackgroundColorVariableName(colorName)] = paletteColorValue;
	}

	return acc;
}, {});
