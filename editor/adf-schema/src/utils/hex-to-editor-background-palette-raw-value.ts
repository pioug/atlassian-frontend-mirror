import { editorBackgroundPalette } from './editor-palette';
import type { EditorBackgroundPaletteKey } from './editor-palette';

/**
 * Takes an ADF hex color and returns the rendered hex code for the associated background palette design token using getTokenValue.
 * If the provided color does not exist in the Editor color palette, this function returns undefined.
 *
 * This should only be used when rendering content where CSS variables are not feasible, such as a non-CSS environment
 * or to enable cross-app copy/paste.
 *
 * WARNING: If the rendered theme changes (such as from light -> dark mode) the value returned here will no longer match
 * the surrounding UI and will need to be re-fetched.
 * In addition, the values of tokens will differ between themes and the value for a given theme can and will change.
 * - **DO NOT**: store the output of these functions in any user-generated content or back-end.
 * - **DO**: store the ADF hex color, and use these utilities at render time to display the themed version of the color.
 */
export function hexToEditorBackgroundPaletteRawValue<HexColor extends string>(
	hexColor: HexColor,
): HexColor extends EditorBackgroundPaletteKey
	? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
		string
	: undefined {
	// Ts ignore was used to allow use of conditional return type
	// (preferencing better type on consumption over safety in implementation)
	const tokenData = hexColor
		? editorBackgroundPalette[hexColor.toUpperCase() as EditorBackgroundPaletteKey]
		: undefined;
	// @ts-expect-error
	return tokenData ? tokenData.getValue(hexColor) : undefined;
}
