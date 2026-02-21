import type { Mark, MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { textColor as textColorFactory } from '../../next-schema/generated/markTypes';

import { hexToEditorTextPaletteColor } from '../../utils/editor-palette';

import {
	rgbToHex,
	N0,
	N80,
	P50,
	P300,
	P500,
	T75,
	T300,
	T500,
	G75,
	G300,
	G500,
	R75,
	R300,
	R500,
	Y75,
	Y200,
	Y400,
	B75,
	B100,
	B500,
} from '../../utils/colors';

import { getDarkModeLCHColor } from '../../utils/lch-color-inversion';

export interface TextColorAttributes {
	/**
	 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
	 * @pattern "^#[0-9a-fA-F]{6}$"
	 */
	color: string;
}

/**
 * @name textColor_mark
 */
export interface TextColorDefinition {
	attrs: TextColorAttributes;
	type: 'textColor';
}

export interface TextColorMark extends Mark {
	attrs: TextColorAttributes;
}

export type TextColorKey =
	// row 1 original
	| 'Light gray'
	| 'Purple'
	| 'Teal'
	| 'Green'
	| 'Red'
	| 'Orange'
	// row 1 extended extras
	| 'Dark gray'
	| 'Blue'
	| 'Yellow'
	// row 2
	| 'Dark blue'
	| 'Dark teal'
	| 'Dark green'
	| 'Dark red'
	| 'Dark purple'
	// row 3
	| 'White'
	| 'Light blue'
	| 'Light teal'
	| 'Light green'
	| 'Light yellow'
	| 'Light red'
	| 'Light purple';

// used for extended palette in text color picker
const colorArrayPalette: Array<[string, TextColorKey]> = [
	// default row - first color is added programatically
	// [N800, 'Squid ink'], // default dark gray
	[B500, 'Dark blue'], // Chore coat
	[T500, 'Dark teal'], // Shabby chic
	[G500, 'Dark green'], // Keen green
	[Y400, 'Orange'], // Cheezy blasters
	[R500, 'Dark red'], // Dragon's blood
	[P500, 'Dark purple'], // Prince
	// row 2
	[N80, 'Light gray'], // Spooky ghost
	[B100, 'Blue'], // Arvo breeze
	[T300, 'Teal'], // Tamarama
	[G300, 'Green'], // Fine pine
	[Y200, 'Yellow'], // Pub mix
	[R300, 'Red'], // Poppy surprise
	[P300, 'Purple'], // Da' juice
	// row 3
	[N0, 'White'],
	[B75, 'Light blue'], // Schwag
	[T75, 'Light teal'], // Arctic chill
	[G75, 'Light green'], // Mintie
	[Y75, 'Light yellow'], // Dandelion whisper
	[R75, 'Light red'], // Bondi sunburn
	[P50, 'Light purple'], // Lavender secret
];

// @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/55979455/Colour+picker+decisions#Colourpickerdecisions-Visualdesigndecisions
export const colorPalette: Map<string, TextColorKey> = new Map<string, TextColorKey>();
// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/** @deprecated [ED-15849] The extended palette is now rolled into the main one. Use `colorPalette` instead. */
export const colorPaletteExtended: Map<string, TextColorKey> = colorPalette;

colorArrayPalette.forEach(([color, label]) => colorPalette.set(color.toLowerCase(), label));

// these are for test only
let testGlobalTheme: string;
export const setGlobalTheme = (theme: string): void => {
	testGlobalTheme = theme;
};
// This is a minimal duplication of the method from @atlaskit/tokens
// to minimise the number of dependencies required as these changes are expected
// to be patched onto CR8.
export const getGlobalTheme = (): {
	colorMode: string;
} => {
	// This should only be hit during tests.
	//
	// At time of writing Jest mocks are not working in this repository.
	if (testGlobalTheme) {
		return { colorMode: testGlobalTheme };
	}
	const element = document.documentElement;
	const colorMode = element.getAttribute('data-color-mode') || '';

	return { colorMode };
};

export const textColor: MarkSpec = textColorFactory({
	parseDOM: [
		{
			style: 'color',
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
				return hexColor && colorPalette.has(hexColor) ? { color: hexColor } : false;
			},
		},
		// This rule ensures when loading from a renderer or editor where the
		// presented text color does not match the stored hex color -- that the
		// text color is preserved.
		//
		// This was initially introduced to ensure text-color marks were not lost
		// when text-color was used inside a link, and is now also used to support
		// where the hex color stored in ADF is used as an ID for a design system
		// token (and based on theme mode -- the presented color will change).
		{
			tag: '.fabric-text-color-mark',
			getAttrs: (maybeElement) => {
				if (!(maybeElement instanceof HTMLElement)) {
					return false;
				}

				const hexColor = maybeElement.dataset.textCustomColor;

				return hexColor && colorPalette.has(hexColor) ? { color: hexColor } : false;
			},
		},
	],
	toDOM(mark) {
		let paletteColorValue: string;
		// Note -- while there is no way to create custom colors using default tooling
		// the editor does supported ad hoc color values -- and there may be content
		// which has been migrated or created via apis which use such values.

		/**
		 * The Editor persists custom text colors when content has been migrated from the old editor, or created via
		 * apis.
		 *
		 * This behaviour predates the introduction of dark mode.
		 *
		 * Without the inversion logic below, text with custom colors, can be hard to read when the user loads the page in dark mode.
		 *
		 * This introduces inversion of the presentation of the custom text colors when the user is in dark mode.
		 *
		 * This can be done without additional changes to account for users copying and pasting content inside the Editor, because of
		 * how we detect text colors copied from external editor sources. Where we load the background color from a
		 * seperate attribute (data-text-custom-color), instead of the inline style.
		 *
		 * See the following document for more details on this behaviour
		 * https://hello.atlassian.net/wiki/spaces/CCECO/pages/2908658046/Unsupported+custom+text+colors+in+dark+theme+Editor+Job+Story
		 */
		const tokenColor = hexToEditorTextPaletteColor(mark.attrs.color);
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
				class: 'fabric-text-color-mark',
				// Editor common has a common style which uses this css variable as the value for
				// the color property using the `fabric-text-color-mark` selector applied above.
				style: `--custom-palette-color: ${paletteColorValue}`,
				['data-text-custom-color']: mark.attrs.color,
			},
		];
	},
});
