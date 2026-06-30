// This import will be stripped on build
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

/**
 * This takes an adf hex color and returns a matching text palette color.
 *
 * By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.
 *
 * Example usage
 * ```tsx
 * const cssValue = hexToTextPaletteColor('#0747A6');
 * //     ^? const cssValue: string
 * <span style={{textColor: cssValue}} />
 * ```
 * The names of tokens can change over time, and the values of tokens will differ between themes.
 * The exact output of this function is an implementation detail and should only be used when rendering
 * content to the user, on a client with a matching major version of `@atlaskit/tokens`.
 * - **DO NOT**: store the output of these functions in any user-generated content or back-end.
 * - **DO**: store the ADF hex color, and use these utilities at render time to display the themed version of the color
 */
export function hexToEditorTextPaletteColor<HexColor extends string>(
	hexColor: HexColor,
): HexColor extends EditorTextPaletteKey
	? /** If the hexColor is an template literal matching a hex color -- we know what string will be returned  */
		EditorTextPalette[HexColor]
	: string | undefined {
	const normalizedHexColor = hexColor ? hexColor.toUpperCase() : undefined;

	// Ts ignore used to allow use of conditional return type
	// (preferencing better type on consumption over safety in implementation)
	// @ts-ignore
	return normalizedHexColor ? editorTextPalette[normalizedHexColor] : undefined;
}
type EditorTextPalette = typeof editorTextPalette;
export type EditorTextPaletteKey = keyof EditorTextPalette;

// Colors taken from
// https://hello.atlassian.net/wiki/spaces/DST/pages/1790979421/DSTRFC-002+-+Shifting+Editor+s+color+palette+to+design+tokens
// values are asserted to improve generated type declarations
export const editorTextPalette = {
	// blue
	/** blue - light */
	['#B3D4FF']: token(
		'color.background.accent.blue.subtler',
	) as 'var(--ds-background-accent-blue-subtler, #B3D4FF)', // source for hex code was legacy token B75
	/** blue - medium */
	['#4C9AFF']: token('color.icon.accent.blue') as 'var(--ds-icon-accent-blue, #4C9AFF)', // source for hex code was legacy token B100
	/** blue - strong */
	['#0747A6']: token('color.text.accent.blue') as 'var(--ds-text-accent-blue, #0747A6)', // source for hex code was legacy token B500

	// teal
	/** teal - light */
	['#B3F5FF']: token(
		'color.background.accent.teal.subtler',
	) as 'var(--ds-background-accent-teal-subtler, #B3F5FF)', // source for hex code was legacy token T75
	/** teal - medium */
	['#00B8D9']: token('color.icon.accent.teal') as 'var(--ds-icon-accent-teal, #00B8D9)', // source for hex code was legacy token T300
	/** teal - strong */
	['#008DA6']: token('color.text.accent.teal') as 'var(--ds-text-accent-teal, #008DA6)', // source for hex code was legacy token T500

	// green
	/** green - light */
	['#ABF5D1']: token(
		'color.background.accent.green.subtler',
	) as 'var(--ds-background-accent-green-subtler, #ABF5D1)', // source for hex code was legacy token G75
	/** green - medium */
	['#36B37E']: token('color.icon.accent.green') as 'var(--ds-icon-accent-green, #36B37E)', // source for hex code was legacy token G300
	/** green - strong */
	['#006644']: token('color.text.accent.green') as 'var(--ds-text-accent-green, #006644)', // source for hex code was legacy token G500

	// yellowOrange
	/** yellowOrange - light */
	['#FFF0B3']: token(
		'color.background.accent.yellow.subtler',
	) as 'var(--ds-background-accent-yellow-subtler, #FFF0B3)', // source for hex code was legacy token Y75
	/** yellowOrange - medium */
	['#FFC400']: token(
		'color.background.accent.orange.subtle',
	) as 'var(--ds-background-accent-orange-subtle, #FFC400)', // source for hex code was legacy token Y200
	/** yellowOrange - strong */
	['#FF991F']: token('color.icon.accent.orange') as 'var(--ds-icon-accent-orange, #FF991F)', // source for hex code was legacy token Y400

	// red
	/** red - light */
	['#FFBDAD']: token(
		'color.background.accent.red.subtler',
	) as 'var(--ds-background-accent-red-subtler, #FFBDAD)', // source for hex code was legacy token R75
	/** red - medium */
	['#FF5630']: token('color.icon.accent.red') as 'var(--ds-icon-accent-red, #FF5630)', // source for hex code was legacy token R300
	/** red - strong */
	['#BF2600']: token('color.text.accent.red') as 'var(--ds-text-accent-red, #BF2600)', // source for hex code was legacy token R500

	// purple
	/** purple - light */
	['#EAE6FF']: token(
		'color.background.accent.purple.subtler',
	) as 'var(--ds-background-accent-purple-subtler, #EAE6FF)', // source for hex code was legacy token P50
	/** purple - medium */
	['#6554C0']: token('color.icon.accent.purple') as 'var(--ds-icon-accent-purple, #6554C0)', // source for hex code was legacy token P300
	/** purple - strong */
	['#403294']: token('color.text.accent.purple') as 'var(--ds-text-accent-purple, #403294)', // source for hex code was legacy token P500

	// whiteGray
	/** whiteGray - light */
	['#FFFFFF']: token('color.text.inverse') as 'var(--ds-text-inverse, #FFFFFF)', // source for hex code was legacy token N0
	/** whiteGray - medium */
	['#97A0AF']: token('color.icon.accent.gray') as 'var(--ds-icon-accent-gray, #97A0AF)', // source for hex code was legacy token N80
	/** whiteGray - strong */
	['#172B4D']: token('color.text') as 'var(--ds-text, #172B4D)', // source for hex code was legacy token N800

	// lime
	/** lime - light */
	['#D3F1A7']: token(
		'color.background.accent.lime.subtler',
	) as 'var(--ds-background-accent-lime-subtler, #D3F1A7)',
	/** lime - medium */
	['#6A9A23']: token('color.icon.accent.lime') as 'var(--ds-icon-accent-lime, #6A9A23)',
	/** lime - strong */
	['#4C6B1F']: token('color.text.accent.lime') as 'var(--ds-text-accent-lime, #4C6B1F)',

	// orange
	/** orange - light */
	['#FCE4A6']: token(
		'color.background.accent.orange.subtler',
	) as 'var(--ds-background-accent-orange-subtler, #FCE4A6)',
	/** orange - medium */
	['#E06C00']: token('color.icon.accent.orange') as 'var(--ds-icon-accent-orange, #E06C00)',
	/** orange - strong */
	['#9E4C00']: token('color.text.accent.orange') as 'var(--ds-text-accent-orange, #9E4C00)',

	// magenta
	/** magenta - light */
	['#FDD0EC']: token(
		'color.background.accent.magenta.subtler',
	) as 'var(--ds-background-accent-magenta-subtler, #FDD0EC)',
	/** magenta - medium */
	['#CD519D']: token('color.icon.accent.magenta') as 'var(--ds-icon-accent-magenta, #CD519D)',
	/** magenta - strong */
	['#943D73']: token('color.text.accent.magenta') as 'var(--ds-text-accent-magenta, #943D73)',

	// yellow
	/** yellow - medium */
	get ['#B38600']():
		| 'var(--ds-border-accent-yellow, #B38600)'
		| 'var(--ds-icon-accent-yellow, #B38600)' {
		return fg('platform_editor_lovability_text_bg_color_patch_1')
			? (token('color.border.accent.yellow') as 'var(--ds-border-accent-yellow, #B38600)')
			: (token('color.icon.accent.yellow') as 'var(--ds-icon-accent-yellow, #B38600)');
	},
	/** yellow - strong */
	['#7F5F01']: token('color.text.accent.yellow') as 'var(--ds-text-accent-yellow, #7F5F01)',
};
