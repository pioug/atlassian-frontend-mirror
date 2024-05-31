// This import will be stripped on build
import { token } from '@atlaskit/tokens';

// Color tokens defined on https://hello.atlassian.net/wiki/spaces/EOU/pages/3587733210/Text+highlighting+-+designs#Colour-palette
// values are asserted to improve generated type declarations
export const textBackgroundColorPalette = {
	/** Gray - light */
	['#DCDFE4']: token(
		'color.background.accent.gray.subtler',
		'#DCDFE4',
	) as 'var(--ds-background-accent-gray-subtler, #DCDFE4)',
	/** Teal - light */
	['#C6EDFB']: token(
		'color.background.accent.teal.subtler',
		'#C6EDFB',
	) as 'var(--ds-background-accent-teal-subtler, #C6EDFB)',
	/** Lime - light */
	['#D3F1A7']: token(
		'color.background.accent.lime.subtler',
		'#D3F1A7',
	) as 'var(--ds-background-accent-lime-subtler, #D3F1A7)',
	/** Orange - light */
	['#FEDEC8']: token(
		'color.background.accent.orange.subtler',
		'#FEDEC8',
	) as 'var(--ds-background-accent-orange-subtler, #FEDEC8)',
	/** Magenta - light */
	['#FDD0EC']: token(
		'color.background.accent.magenta.subtler',
		'#FDD0EC',
	) as 'var(--ds-background-accent-magenta-subtler, #FDD0EC)',
	/** Purple - light */
	['#DFD8FD']: token(
		'color.background.accent.purple.subtler',
		'#DFD8FD',
	) as 'var(--ds-background-accent-purple-subtler, #DFD8FD)',
};
type TextBackgroundColorPalette = typeof textBackgroundColorPalette;
export type TextBackgroundColorPaletteKey = keyof TextBackgroundColorPalette;

/**
 * This takes an ADF hex color and returns a matching text background palette color.
 *
 * By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.
 *
 * Example usage
 * ```tsx
 * const cssValue = hexToEditorTextBackgroundPaletteColor('#D3F1A7');
 *
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
	// @ts-ignore
	return textBackgroundColorPalette[hexColor.toUpperCase()];
}
