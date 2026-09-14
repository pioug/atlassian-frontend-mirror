import { editorBorderPalette } from './editor-palette';
import type { EditorBorderPalette, EditorBorderPaletteKey } from './editor-palette';

/**
 * This takes an adf hex color and returns a matching border palette color.
 *
 * By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.
 *
 * Example usage
 * ```tsx
 * const cssValue = hexToEditorBorderPaletteColor('#091E4224');
 * //     ^? const cssValue: string
 * <div style={{borderColor: cssValue}} />
 * ```
 * The names of tokens can change over time, and the values of tokens will differ between themes.
 * The exact output of this function is an implementation detail and should only be used when rendering
 * content to the user, on a client with a matching major version of `@atlaskit/tokens`.
 * - **DO NOT**: store the output of these functions in any user-generated content or back-end.
 * - **DO**: store the ADF hex color, and use these utilities at render time to display the themed version of the color
 */
export function hexToEditorBorderPaletteColor<HexColor extends string>(
	hexColor: HexColor,
): HexColor extends EditorBorderPaletteKey
	? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
		EditorBorderPalette[HexColor]
	: string | undefined {
	// Ts ignore was used to allow use of conditional return type
	// (preferencing better type on consumption over safety in implementation)
	// @ts-expect-error
	return hexColor ? editorBorderPalette[hexColor.toUpperCase()] : undefined;
}
