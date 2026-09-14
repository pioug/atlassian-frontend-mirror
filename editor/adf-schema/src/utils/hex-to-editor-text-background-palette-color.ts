import { textBackgroundColorPalette } from './editor-palette';
import type { TextBackgroundColorPalette, TextBackgroundColorPaletteKey } from './editor-palette';

/**
 * This takes an ADF hex color and returns a matching text background palette color.
 *
 * By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.
 *
 * Example usage
 * ```tsx
 * const cssValue = hexToEditorTextBackgroundPaletteColor('#0747A6');
 * //     ^? const cssValue: string
 * <span style={{backgroundColor: cssValue}} />
 * ```
 * The names of tokens can change over time, and the values of tokens will differ between themes.
 * The exact output of this function is an implementation detail and should only be used when rendering
 * content to the user, on a client with a matching major version of `@atlaskit/tokens`.
 * - **DO NOT**: store the output of these functions in any user-generated content or back-end.
 * - **DO**: store the ADF hex color, and use these utilities at render time to display the themed version of the color
 */
export function hexToEditorTextBackgroundPaletteColor<HexColor extends string>(
	hexColor: HexColor,
): HexColor extends TextBackgroundColorPaletteKey
	? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
		TextBackgroundColorPalette[HexColor]
	: string | undefined {
	// Ts ignore was used to allow use of conditional return type
	// (preferring better type on consumption over safety in implementation)
	// @ts-expect-error
	return hexColor ? textBackgroundColorPalette[hexColor.toUpperCase()] : undefined;
}
