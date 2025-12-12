import type { Mark, MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { backgroundColor as backgroundColorFactory } from '../../next-schema/generated/markTypes';

import { hexToEditorTextBackgroundPaletteColor } from '../../utils/editor-palette';

import { rgbToHex, L200, T200, P200, M200, Neutral300, O200, Yellow200 } from '../../utils/colors';
import type { TextColorAttributes } from './text-color';
import { getGlobalTheme } from './text-color';
import { getDarkModeLCHColor } from '../../utils/lch-color-inversion';

/**
 * @name backgroundColor_mark
 */
export interface BackgroundColorDefinition {
	attrs: TextColorAttributes;
	type: 'backgroundColor';
}

export interface BackgroundColorMark extends Mark {
	attrs: TextColorAttributes;
}

// Remove this when cleaning up platform_editor_add_orange_highlight_color
export type BackgroundColorKey = 'Gray' | 'Teal' | 'Lime' | 'Orange' | 'Magenta' | 'Purple';

export type BackgroundColorKeyNext =
	| 'Gray'
	| 'Teal'
	| 'Lime'
	| 'Yellow'
	| 'Orange'
	| 'Magenta'
	| 'Purple';

const colorArrayPalette: Array<[string, BackgroundColorKey]> = [
	[Neutral300, 'Gray'], // token: color.background.accent.gray.subtler
	[T200, 'Teal'], // token: color.background.accent.teal.subtler
	[L200, 'Lime'], // token: color.background.accent.lime.subtler
	[O200, 'Orange'], // token: color.background.accent.orange.subtler
	[M200, 'Magenta'], // token: color.background.accent.magenta.subtler
	[P200, 'Purple'], // token: color.background.accent.purple.subtler
];

const colorArrayPaletteNext: Array<[string, BackgroundColorKeyNext]> = [
	[Neutral300, 'Gray'], // token: color.background.accent.gray.subtler
	[P200, 'Purple'], // token: color.background.accent.purple.subtler
	[M200, 'Magenta'], // token: color.background.accent.magenta.subtler
	[O200, 'Orange'], // token: color.background.accent.orange.subtler
	[Yellow200, 'Yellow'], // token: color.background.accent.yellow.subtler
	[L200, 'Lime'], // token: color.background.accent.lime.subtler
	[T200, 'Teal'], // token: color.background.accent.teal.subtler
];

// @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/55979455/Colour+picker+decisions#Colourpickerdecisions-Visualdesigndecisions
// Remove this when cleaning up platform_editor_add_orange_highlight_color
// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * @deprecated use backgroundColorPaletteNext instead, which in addition supports yellow highlight
 */
export const backgroundColorPalette = new Map<string, BackgroundColorKey>();
colorArrayPalette.forEach(([color, label]) =>
	backgroundColorPalette.set(color.toLowerCase(), label),
);

export const backgroundColorPaletteNext = new Map<string, BackgroundColorKeyNext>();
colorArrayPaletteNext.forEach(([color, label]) =>
	backgroundColorPaletteNext.set(color.toLowerCase(), label),
);

export const backgroundColor: MarkSpec = backgroundColorFactory({
	parseDOM: [
		{
			style: 'background-color',
			getAttrs: (maybeValue) => {
				const value = maybeValue as string;
				let hexColor;
				// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
				if (value.match(/^rgb/iu)) {
					hexColor = rgbToHex(value);
				} else if (value[0] === '#') {
					hexColor = value.toLowerCase();
				}
				// else handle other colour formats
				return hexColor && backgroundColorPalette.has(hexColor) ? { color: hexColor } : false;
			},
		},
		// This rule ensures when loading from a renderer or editor where the
		// presented text color does not match the stored hex color -- that the
		// text color is preserved.
		//
		// This is used to support the work-around that converts the hex color to
		// a design system token to enable light / dark mode (through a CSS variable --custom-palette-color)
		{
			tag: '.fabric-background-color-mark',
			getAttrs: (maybeElement) => {
				if (!(maybeElement instanceof HTMLElement)) {
					return false;
				}

				const hexColor = maybeElement.dataset.backgroundCustomColor;

				return hexColor && backgroundColorPalette.has(hexColor) ? { color: hexColor } : false;
			},
		},
	],
	toDOM(mark) {
		let paletteColorValue: string;
		/**
		 * Documents can contain custom colors when content has been migrated from the old editor, or created via APIs.
		 *
		 * This behaviour predates the introduction of dark mode.
		 *
		 * Without the inversion logic below, text with custom colors, can be hard to read when the user loads the page in dark mode.
		 *
		 * This introduces inversion of the presentation of the custom text colors when the user is in dark mode.
		 *
		 * This can be done without additional changes to account for users copying and pasting content inside the Editor, because of
		 * how we detect text colors copied from external editor sources. Where we load the background color from a
		 * separate attribute (data-text-custom-color), instead of the inline style.
		 *
		 * See the following document for more details on this behaviour
		 * https://hello.atlassian.net/wiki/spaces/CCECO/pages/2908658046/Unsupported+custom+text+colors+in+dark+theme+Editor+Job+Story
		 */
		const tokenColor = hexToEditorTextBackgroundPaletteColor(mark.attrs.color);
		if (tokenColor) {
			paletteColorValue = tokenColor;
		} else {
			if (getGlobalTheme().colorMode === 'dark') {
				// if we have a custom color, we need to check if we are in dark mode
				paletteColorValue = getDarkModeLCHColor(mark.attrs.color);
			} else {
				// if we are in light mode, we can just set the color
				paletteColorValue = mark.attrs.color;
			}
		}

		return [
			'span',
			{
				class: 'fabric-background-color-mark',
				// Editor common has a common style which uses this css variable as the value for
				// the color property using the `fabric-text-background-color-mark` selector applied above.
				style: `--custom-palette-color: ${paletteColorValue}`,
				['data-background-custom-color']: mark.attrs.color,
			},
		];
	},
});
