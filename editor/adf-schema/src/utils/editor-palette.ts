import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

export type EditorBorderPalette = typeof editorBorderPalette;

export type EditorBorderPaletteKey = keyof EditorBorderPalette;

export const editorBorderPalette = {
	/** gray - subtle */
	'#091E4224': 'var(--ds-border, #091E4224)',
	/** gray */
	'#758195': 'var(--ds-border-bold, #758195)',
	/** gray - bold */
	'#172B4D': 'var(--ds-text, #172B4D)',
};

export type EditorTextPalette = typeof editorTextPalette;

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
	/** lime - light */
	'#D3F1A7': 'var(--ds-background-accent-lime-subtler, #D3F1A7)',
	/** lime - medium */
	'#6A9A23': 'var(--ds-icon-accent-lime, #6A9A23)',
	/** lime - strong */
	'#4C6B1F': 'var(--ds-text-accent-lime, #4C6B1F)',
	/** orange - light */
	'#FCE4A6': 'var(--ds-background-accent-orange-subtler, #FCE4A6)',
	/** orange - medium */
	'#E06C00': 'var(--ds-icon-accent-orange, #E06C00)',
	/** orange - strong */
	'#9E4C00': 'var(--ds-text-accent-orange, #9E4C00)',
	/** magenta - light */
	'#FDD0EC': 'var(--ds-background-accent-magenta-subtler, #FDD0EC)',
	/** magenta - medium */
	'#CD519D': 'var(--ds-icon-accent-magenta, #CD519D)',
	/** magenta - strong */
	'#943D73': 'var(--ds-text-accent-magenta, #943D73)',
	/** yellow - medium */
	get ['#B38600']():
		| 'var(--ds-border-accent-yellow, #B38600)'
		| 'var(--ds-icon-accent-yellow, #B38600)' {
		return expValEqualsNoExposure('platform_editor_lovability_text_bg_color', 'isEnabled', true) &&
			fg('platform_editor_lovability_text_bg_color_patch_1')
			? 'var(--ds-border-accent-yellow, #B38600)'
			: 'var(--ds-icon-accent-yellow, #B38600)';
	},
	/** yellow - strong */
	'#7F5F01': 'var(--ds-text-accent-yellow, #7F5F01)',
};

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
	/** Red - light */
	'#FFD5D2': 'var(--ds-background-accent-red-subtler, #FFD5D2)',
	/** Magenta - light */
	'#FDD0EC': 'var(--ds-background-accent-magenta-subtler, #FDD0EC)',
	/** Purple - light */
	'#DFD8FD': 'var(--ds-background-accent-purple-subtler, #DFD8FD)',
	/** Blue - light */
	'#B3D4FF': 'var(--ds-background-accent-blue-subtler, #B3D4FF)',
	/** Green - light */
	'#ABF5D1': 'var(--ds-background-accent-green-subtler, #ABF5D1)',
};

export type TextBackgroundColorPalette = typeof textBackgroundColorPalette;

export type TextBackgroundColorPaletteKey = keyof TextBackgroundColorPalette;

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
	/** lime - light */
	'#EFFFD6': {
		getValue: () => '#EFFFD6',
		token: 'var(--ds-background-accent-lime-subtlest, #EFFFD6)',
	},
	/** lime - medium */
	'#D3F1A7': {
		getValue: () => '#D3F1A7',
		token: 'var(--ds-background-accent-lime-subtler, #D3F1A7)',
	},
	/** lime - bold */
	'#BDE97C': {
		getValue: () => '#BDE97C',
		token: 'var(--ds-background-accent-lime-subtler-hovered, #BDE97C)',
	},
	/** orange - light */
	'#FFF5DB': {
		getValue: () => '#FFF5DB',
		token: 'var(--ds-background-accent-orange-subtlest, #FFF5DB)',
	},
	/** orange - medium */
	'#FCE4A6': {
		getValue: () => '#FCE4A6',
		token: 'var(--ds-background-accent-orange-subtler, #FCE4A6)',
	},
	/** orange - bold */
	'#FBD779': {
		getValue: () => '#FBD779',
		token: 'var(--ds-background-accent-orange-subtler-hovered, #FBD779)',
	},
	/** magenta - light */
	'#FFECF8': {
		getValue: () => '#FFECF8',
		token: 'var(--ds-background-accent-magenta-subtlest, #FFECF8)',
	},
	/** magenta - medium */
	'#FDD0EC': {
		getValue: () => '#FDD0EC',
		token: 'var(--ds-background-accent-magenta-subtler, #FDD0EC)',
	},
	/** magenta - bold */
	'#FCB6E1': {
		getValue: () => '#FCB6E1',
		token: 'var(--ds-background-accent-magenta-subtler-hovered, #FCB6E1)',
	},
	// Bold row mappings using subtler.hovered tokens. These use new hex codes
	// so pre-existing documents keep their old subtle-token mappings above.
	/** blue - bold */
	'#ADCBFB': {
		getValue: () => '#ADCBFB',
		token: 'var(--ds-background-accent-blue-subtler-hovered, #ADCBFB)',
	},
	/** teal - bold */
	'#B1E4F7': {
		getValue: () => '#B1E4F7',
		token: 'var(--ds-background-accent-teal-subtler-hovered, #B1E4F7)',
	},
	/** green - bold */
	'#97EDC9': {
		getValue: () => '#97EDC9',
		token: 'var(--ds-background-accent-green-subtler-hovered, #97EDC9)',
	},
	/** yellow - bold */
	'#EFDD4E': {
		getValue: () => '#EFDD4E',
		token: 'var(--ds-background-accent-yellow-subtler-hovered, #EFDD4E)',
	},
	/** red - bold */
	'#FFB8B2': {
		getValue: () => '#FFB8B2',
		token: 'var(--ds-background-accent-red-subtler-hovered, #FFB8B2)',
	},
	/** purple - bold */
	'#E3BDFA': {
		getValue: () => '#E3BDFA',
		token: 'var(--ds-background-accent-purple-subtler-hovered, #E3BDFA)',
	},
	/** gray - bold */
	'#B7B9BE': {
		getValue: () => '#B7B9BE',
		token: 'var(--ds-background-accent-gray-subtler-hovered, #B7B9BE)',
	},
};
