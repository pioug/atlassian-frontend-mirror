import type { AccentColor, SemanticColor } from '@atlaskit/lozenge/types';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

/** Named colours the ADF `color` attribute can carry. */
export type NamedColor = 'neutral' | 'purple' | 'blue' | 'red' | 'yellow' | 'green';

export const NAMED_COLORS: readonly NamedColor[] = [
	'neutral',
	'purple',
	'blue',
	'red',
	'yellow',
	'green',
];

/**
 * Hex ids the picker persists — the hues with no existing named ADF colour.
 * Each is the panel-medium hex for that accent, so it resolves to the same token
 * the editor palette would give it.
 */
export type HexColor = '#B3F5FF' | '#ABF5D1' | '#D3F1A7' | '#FFF0B3' | '#FCE4A6' | '#FDD0EC';

export const HEX_PALETTE: readonly HexColor[] = [
	'#B3F5FF', // Teal
	'#ABF5D1', // Green
	'#D3F1A7', // Lime — named `green` renders identically
	'#FFF0B3', // Yellow
	'#FCE4A6', // Orange — named `yellow` renders identically
	'#FDD0EC', // Magenta
];

export type PaletteColor = NamedColor | HexColor;

export const DEFAULT_LOZENGE_APPEARANCE: SemanticColor = 'neutral';

/** Pre-experiment mapping. Delete with `platform_editor_update_status_colors`. */
export const colorToLozengeAppearanceMap: { [K in NamedColor]: SemanticColor } = {
	neutral: 'neutral',
	purple: 'discovery',
	blue: 'information',
	red: 'danger',
	yellow: 'warning',
	green: 'success',
};

/**
 * Check-mark colour for the selected swatch. Uniform across the ten-colour palette, so
 * it is not a per-colour field. (The legacy six-colour palette does vary it, which is
 * why `ColorProps` still takes it per swatch.)
 */
export const SWATCH_ICON_COLOR: string = token('color.icon');

/**
 * Keys of `messages` usable as a swatch's accessible name. Kept as a union so
 * `getColorLabelKey` returns something `messages` is guaranteed to have — the
 * call site in `color.tsx` then needs no cast, and an unregistered colour cannot
 * produce a missing key.
 */
type ColorLabelKey =
	| 'neutralColor'
	| 'purpleColor'
	| 'blueColor'
	| 'redColor'
	| 'yellowColor'
	| 'greenColor'
	| 'tealColor'
	| 'limeColor'
	| 'orangeColor'
	| 'magentaColor';

type ColorSpec = {
	appearance: SemanticColor | AccentColor;
	/** Key in `messages` for the picker swatch's accessible name. */
	labelKey: ColorLabelKey;
	/** Present when the colour is offered as a swatch in the ten-colour picker. */
	swatch?: { backgroundColor: string; borderColor: string };
};

/**
 * Single source of truth for status colours: appearance, swatch tokens and i18n key.
 * Typed as a total `Record`, so adding a value to NAMED_COLORS or HEX_PALETTE
 * fails to compile until it is described here.
 *
 * Legacy named `yellow`/`green` have no swatch — they are not offered separately,
 * because `accent-orange`/`accent-lime` are byte-identical to the Orange/Lime swatches
 * in both themes. The distinct Yellow and Green swatches are the #FFF0B3 / #ABF5D1 hues.
 *
 * CSS cannot be derived from this: Compiled needs static literals and the styling lint
 * rule rejects computed values. `statusStylesHexAccent` in editor-core mirrors it by hand.
 */
export const COLORS: Record<PaletteColor, ColorSpec> = {
	neutral: {
		appearance: 'neutral',
		labelKey: 'neutralColor',
		swatch: {
			backgroundColor: token('color.background.neutral'),
			borderColor: token('color.border'),
		},
	},
	blue: {
		appearance: 'accent-blue',
		labelKey: 'blueColor',
		swatch: {
			backgroundColor: token('color.background.accent.blue.subtler'),
			borderColor: token('color.border.accent.blue.subtle'),
		},
	},
	'#B3F5FF': {
		appearance: 'accent-teal',
		labelKey: 'tealColor',
		swatch: {
			backgroundColor: token('color.background.accent.teal.subtler'),
			borderColor: token('color.border.accent.teal.subtle'),
		},
	},
	'#ABF5D1': {
		appearance: 'accent-green',
		labelKey: 'greenColor',
		swatch: {
			backgroundColor: token('color.background.accent.green.subtler'),
			borderColor: token('color.border.accent.green.subtle'),
		},
	},
	'#D3F1A7': {
		appearance: 'accent-lime',
		labelKey: 'limeColor',
		swatch: {
			backgroundColor: token('color.background.accent.lime.subtler'),
			borderColor: token('color.border.accent.lime.subtle'),
		},
	},
	'#FFF0B3': {
		appearance: 'accent-yellow',
		labelKey: 'yellowColor',
		swatch: {
			backgroundColor: token('color.background.accent.yellow.subtler'),
			borderColor: token('color.border.accent.yellow.subtle'),
		},
	},
	'#FCE4A6': {
		appearance: 'accent-orange',
		labelKey: 'orangeColor',
		swatch: {
			backgroundColor: token('color.background.accent.orange.subtler'),
			borderColor: token('color.border.accent.orange.subtle'),
		},
	},
	red: {
		appearance: 'accent-red',
		labelKey: 'redColor',
		swatch: {
			backgroundColor: token('color.background.accent.red.subtler'),
			borderColor: token('color.border.accent.red.subtle'),
		},
	},
	'#FDD0EC': {
		appearance: 'accent-magenta',
		labelKey: 'magentaColor',
		swatch: {
			backgroundColor: token('color.background.accent.magenta.subtler'),
			borderColor: token('color.border.accent.magenta.subtle'),
		},
	},
	purple: {
		appearance: 'accent-purple',
		labelKey: 'purpleColor',
		swatch: {
			backgroundColor: token('color.background.accent.purple.subtler'),
			borderColor: token('color.border.accent.purple.subtle'),
		},
	},
	yellow: { appearance: 'accent-orange', labelKey: 'yellowColor' },
	green: { appearance: 'accent-lime', labelKey: 'greenColor' },
};

/** Swatch order in the ten-colour picker: two rows of five. */
export const PICKER_SWATCHES: readonly PaletteColor[] = [
	'neutral', // Gray
	'blue', // Blue
	'#B3F5FF', // Teal
	'#ABF5D1', // Green
	'#D3F1A7', // Lime
	'#FFF0B3', // Yellow
	'#FCE4A6', // Orange
	'red', // Red
	'#FDD0EC', // Magenta
	'purple', // Purple
];

export const isNamedColor = (color: string): color is NamedColor =>
	NAMED_COLORS.includes(color as NamedColor);

export const normalizeColor = (color: string): string =>
	color.startsWith('#') ? color.toUpperCase() : color;

const specFor = (color: string): ColorSpec | undefined =>
	COLORS[normalizeColor(color) as PaletteColor];

/**
 * Falls back to the neutral label rather than building a key from the colour: an
 * unregistered value would otherwise yield a key `messages` does not have, and
 * spreading the resulting `undefined` into `FormattedMessage` throws.
 */
export const getColorLabelKey = (color: string): ColorLabelKey =>
	specFor(color)?.labelKey ?? 'neutralColor';

export const isSwatchSelected = (swatchValue: string, selectedColor?: string): boolean => {
	if (!selectedColor) {
		return false;
	}

	if (normalizeColor(swatchValue) === normalizeColor(selectedColor)) {
		return true;
	}

	// A swatch also counts as selected when it renders the same hue under a different
	// id — legacy named `green`/`yellow` share the Lime/Orange swatches. Unknown values
	// have no spec, so they never collide on the neutral fallback.
	const swatchAppearance = specFor(swatchValue)?.appearance;
	return swatchAppearance !== undefined && swatchAppearance === specFor(selectedColor)?.appearance;
};

export const getLozengeAppearance = (color: string): SemanticColor | AccentColor => {
	const isUpdateStatusColorsEnabled =
		UNSAFE_expValNoExposure('platform_editor_update_status_colors', 'isEnabled', false) ||
		UNSAFE_expValNoExposure('platform_editor_update_status_colors_jira', 'isEnabled', false);

	// Named colours are recoloured only by the experiment. `gracefully_render_status_color`
	// is a read-path gate for hex written by another cohort, so it must never reach here.
	if (isNamedColor(color)) {
		return isUpdateStatusColorsEnabled
			? COLORS[color].appearance
			: colorToLozengeAppearanceMap[color];
	}

	if (isUpdateStatusColorsEnabled || fg('platform_editor_gracefully_render_status_color')) {
		return specFor(color)?.appearance ?? DEFAULT_LOZENGE_APPEARANCE;
	}

	return DEFAULT_LOZENGE_APPEARANCE;
};
