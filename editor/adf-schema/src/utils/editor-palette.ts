// @ts-ignore TS2307: Cannot find module '@atlaskit/feature-gate-js-client' or its corresponding type declarations.
import FeatureGates from '@atlaskit/feature-gate-js-client';

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
type EditorBorderPalette = typeof editorBorderPalette;
export type EditorBorderPaletteKey = keyof EditorBorderPalette;
export const editorBorderPalette = {
	/** gray - subtle */
	'#091E4224': 'var(--ds-border, #091E4224)',
	/** gray */
	'#758195': 'var(--ds-border-bold, #758195)',
	/** gray - bold */
	'#172B4D': 'var(--ds-text, #172B4D)',
};

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
	// Ts ignore was used to allow use of conditional return type
	// (preferencing better type on consumption over safety in implementation)
	// @ts-expect-error
	return hexColor ? editorTextPalette[hexColor.toUpperCase()] : undefined;
}
type EditorTextPalette = typeof editorTextPalette;
export type EditorTextPaletteKey = keyof EditorTextPalette;
export const editorTextPalette = {
	/** blue - light */
	'#B3D4FF': 'var(--ds-background-accent-blue-subtler, #B3D4FF)',
	/** blue - medium */
	'#4C9AFF': 'var(--ds-icon-accent-blue, #4C9AFF)',
	/** blue - strong */
	'#0747A6': 'var(--ds-text-accent-blue, #0747A6)',
	/** teal - light */
	'#B3F5FF': 'var(--ds-background-accent-teal-subtler, #B3F5FF)',
	/** teal - medium */
	'#00B8D9': 'var(--ds-icon-accent-teal, #00B8D9)',
	/** teal - strong */
	'#008DA6': 'var(--ds-text-accent-teal, #008DA6)',
	/** green - light */
	'#ABF5D1': 'var(--ds-background-accent-green-subtler, #ABF5D1)',
	/** green - medium */
	'#36B37E': 'var(--ds-icon-accent-green, #36B37E)',
	/** green - strong */
	'#006644': 'var(--ds-text-accent-green, #006644)',
	/** yellowOrange - light */
	'#FFF0B3': 'var(--ds-background-accent-yellow-subtler, #FFF0B3)',
	/** yellowOrange - medium */
	'#FFC400': 'var(--ds-background-accent-orange-subtle, #FFC400)',
	/** yellowOrange - strong */
	'#FF991F': 'var(--ds-icon-accent-orange, #FF991F)',
	/** red - light */
	'#FFBDAD': 'var(--ds-background-accent-red-subtler, #FFBDAD)',
	/** red - medium */
	'#FF5630': 'var(--ds-icon-accent-red, #FF5630)',
	/** red - strong */
	'#BF2600': 'var(--ds-text-accent-red, #BF2600)',
	/** purple - light */
	'#EAE6FF': 'var(--ds-background-accent-purple-subtler, #EAE6FF)',
	/** purple - medium */
	'#6554C0': 'var(--ds-icon-accent-purple, #6554C0)',
	/** purple - strong */
	'#403294': 'var(--ds-text-accent-purple, #403294)',
	/** whiteGray - light */
	'#FFFFFF': 'var(--ds-text-inverse, #FFFFFF)',
	/** whiteGray - medium */
	'#97A0AF': 'var(--ds-icon-accent-gray, #97A0AF)',
	/** whiteGray - strong */
	'#172B4D': 'var(--ds-text, #172B4D)',
};

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
	if (
		FeatureGates.getExperimentValue<'control' | 'test'>(
			'platform_editor_add_orange_highlight_color',
			'cohort',
			'control',
		) !== 'test'
	) {
		textBackgroundColorPalette['#FEDEC8'] = 'var(--ds-background-accent-yellow-subtler, #F8E6A0)';
	}

	// Ts ignore was used to allow use of conditional return type
	// (preferring better type on consumption over safety in implementation)
	// @ts-expect-error
	return hexColor ? textBackgroundColorPalette[hexColor.toUpperCase()] : undefined;
}
export const textBackgroundColorPalette = {
	/** Gray - light */
	'#DCDFE4': 'var(--ds-background-accent-gray-subtler, #DCDFE4)',
	/** Teal - light */
	'#C6EDFB': 'var(--ds-background-accent-teal-subtler, #C6EDFB)',
	/** Lime - light */
	'#D3F1A7': 'var(--ds-background-accent-lime-subtler, #D3F1A7)',
	/** Yellow - light */
	'#F8E6A0': 'var(--ds-background-accent-yellow-subtler, #F8E6A0)',
	/** Orange - light */
	'#FEDEC8': 'var(--ds-background-accent-orange-subtler, #FEDEC8)',
	/** Magenta - light */
	'#FDD0EC': 'var(--ds-background-accent-magenta-subtler, #FDD0EC)',
	/** Purple - light */
	'#DFD8FD': 'var(--ds-background-accent-purple-subtler, #DFD8FD)',
};
type TextBackgroundColorPalette = typeof textBackgroundColorPalette;
export type TextBackgroundColorPaletteKey = keyof TextBackgroundColorPalette;

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
	// @ts-ignore
	const tokenData = hexColor ? editorBackgroundPalette[hexColor.toUpperCase()] : undefined;
	// @ts-expect-error
	return tokenData ? tokenData.getValue(hexColor) : undefined;
}
type EditorBackgroundPalette = typeof editorBackgroundPalette;
export type EditorBackgroundPaletteKey = keyof EditorBackgroundPalette;
/**
 * Values are asserted to improve generated type declarations
 * Using object structure as getValue() function needed for table values, and other
 * properties may be needed in the future.
 */
export const editorBackgroundPalette = {
	/** blue - light */
	'#DEEBFF': {
		getValue: () => '#DEEBFF',
		token: 'var(--ds-background-accent-blue-subtlest, #DEEBFF)',
	},
	/** blue - medium */
	'#B3D4FF': {
		getValue: () => '#B3D4FF',
		token: 'var(--ds-background-accent-blue-subtler, #B3D4FF)',
	},
	/** blue - strong */
	'#4C9AFF': {
		getValue: () => '#4C9AFF',
		token: 'var(--ds-background-accent-blue-subtle, #4C9AFF)',
	},
	/** teal - light */
	'#E6FCFF': {
		getValue: () => '#E6FCFF',
		token: 'var(--ds-background-accent-teal-subtlest, #E6FCFF)',
	},
	/** teal - medium */
	'#B3F5FF': {
		getValue: () => '#B3F5FF',
		token: 'var(--ds-background-accent-teal-subtler, #B3F5FF)',
	},
	/** teal - strong */
	'#79E2F2': {
		getValue: () => '#79E2F2',
		token: 'var(--ds-background-accent-teal-subtle, #79E2F2)',
	},
	/** green - light */
	'#E3FCEF': {
		getValue: () => '#E3FCEF',
		token: 'var(--ds-background-accent-green-subtlest, #E3FCEF)',
	},
	/** green - medium */
	'#ABF5D1': {
		getValue: () => '#ABF5D1',
		token: 'var(--ds-background-accent-green-subtler, #ABF5D1)',
	},
	/** green - strong */
	'#57D9A3': {
		getValue: () => '#57D9A3',
		token: 'var(--ds-background-accent-green-subtle, #57D9A3)',
	},
	/** yellowOrange - light */
	'#FFFAE6': {
		getValue: () => '#FFFAE6',
		token: 'var(--ds-background-accent-yellow-subtlest, #FFFAE6)',
	},
	/** yellowOrange - medium */
	'#FFF0B3': {
		getValue: () => '#FFF0B3',
		token: 'var(--ds-background-accent-yellow-subtler, #FFF0B3)',
	},
	/** yellowOrange - strong */
	'#FFC400': {
		getValue: () => '#FFC400',
		token: 'var(--ds-background-accent-orange-subtle, #FFC400)',
	},
	/** red - light */
	'#FFEBE6': {
		getValue: () => '#FFEBE6',
		token: 'var(--ds-background-accent-red-subtlest, #FFEBE6)',
	},
	/** red - medium */
	'#FFBDAD': {
		getValue: () => '#FFBDAD',
		token: 'var(--ds-background-accent-red-subtler, #FFBDAD)',
	},
	/** red - strong */
	'#FF8F73': {
		getValue: () => '#FF8F73',
		token: 'var(--ds-background-accent-red-subtle, #FF8F73)',
	},
	/** purple - light */
	'#EAE6FF': {
		getValue: () => '#EAE6FF',
		token: 'var(--ds-background-accent-purple-subtlest, #EAE6FF)',
	},
	/** purple - medium */
	'#C0B6F2': {
		getValue: () => '#C0B6F2',
		token: 'var(--ds-background-accent-purple-subtler, #C0B6F2)',
	},
	/** purple - strong */
	'#998DD9': {
		getValue: () => '#998DD9',
		token: 'var(--ds-background-accent-purple-subtle, #998DD9)',
	},
	/** whiteGray - light */
	'#FFFFFF': {
		getValue: () => '#FFFFFF',
		token: 'var(--ds-surface, #FFFFFF)',
	},
	/** whiteGray - medium */
	'#F4F5F7': {
		getValue: () => '#F4F5F7',
		token: 'var(--ds-background-accent-gray-subtlest, #F4F5F7)',
	},
	/** whiteGray - strong */
	'#B3BAC5': {
		getValue: () => '#B3BAC5',
		token: 'var(--ds-background-accent-gray-subtle, #B3BAC5)',
	},
};

export {};
