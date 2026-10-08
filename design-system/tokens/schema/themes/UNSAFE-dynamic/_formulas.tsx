/**
 * Colour formulas for the `UNSAFE-dynamic` theme.
 *
 * The theme derives every colour from two runtime inputs using CSS relative colour syntax, so the
 * consumer (e.g. `ThemeProvider`) only has to provide the input variables:
 *
 * - `--ds-dynamic-foreground`
 * - `--ds-dynamic-background`
 *
 * The `_` prefix keeps this file out of the theme's token sources (see `build-themes.tsx`).
 */
import type { BaseToken } from '../../palettes/palette';

/**
 * Lightness bands (OKLCH `l`, 0-1) used to decide whether a colour is lightened or darkened.
 */
const LIGHTNESS_THRESHOLDS = {
	veryDark: 0.3,
	dark: 0.5,
	light: 0.5,
	veryLight: 0.9,
} as const;

const LIGHTNESS_ADJUSTMENTS = {
	hovered: 0.03,
	pressed: 0.05,
	subtle: 0.1,
	subtlest: 0.15,
} as const;

const ALPHA = {
	borderSubtle: 0.6,
	disabled: 0.3,
} as const;

const INPUT_FALLBACKS = {
	foreground: '#FFFFFF',
	background: '#000000',
} as const;

/**
 * Custom theme values are CSS expressions rather than palette keys. This is the single place the
 * schema's `BaseToken` type is widened to accept them.
 */
const cssValue = (value: string): BaseToken => value as BaseToken;

/**
 * Returns a CSS `calc()` for the OKLCH lightness channel that nudges `l` by `amount`, choosing the
 * direction based on how light the colour already is:
 *
 * - very light (l >= 0.9): darken
 * - light (0.5 <= l < 0.9): lighten
 * - dark (0.3 <= l < 0.5): darken
 * - very dark (l < 0.3): lighten, with a multiplier so the change is still visible
 *
 * Each band is detected with `sign()` so the result is resolved entirely by the browser.
 */
function adaptiveLightness(amount: number, isHovered: boolean): string {
	const { veryDark, dark, light, veryLight } = LIGHTNESS_THRESHOLDS;
	const isVeryLight = `max(0, sign(l - ${veryLight} + 0.0001))`;
	const isLight = `max(0, sign(${veryLight} - l - 0.0001) * sign(l - ${light} + 0.0001))`;
	const isDark = `max(0, sign(${dark} - l - 0.0001) * sign(l - ${veryDark} - 0.0001))`;
	const isVeryDark = `max(0, sign(${veryDark} - l + 0.0001))`;
	const veryDarkMultiplier = isHovered ? 2 : 1.5;

	return `calc(l - (${amount} * ${isVeryLight}) + (${amount} * ${isLight}) - (${amount} * ${isDark}) + (${amount} * ${veryDarkMultiplier} * ${isVeryDark}))`;
}

const adjustLightness =
	(amount: number, isHovered: boolean) =>
	(color: string): string =>
		`oklch(from ${color} ${adaptiveLightness(amount, isHovered)} c h)`;

const withAlpha =
	(alpha: number) =>
	(color: string): string =>
		`oklch(from ${color} l c h / ${alpha})`;

/**
 * A derived colour emitted once as a custom property by the CSS theme formatter, so tokens can
 * reference it with `var()` instead of repeating (and nesting) the full expression.
 */
export interface DynamicColorCustomProperty {
	// Custom property name, e.g. `--ds-dynamic-color-background-subtle`.
	property: string;
	// Declared value; references the parent colour's custom property rather than inlining it.
	value: string;
	// Fully expanded value, identical to the token value in the schema.
	resolvedValue: string;
}

/**
 * A colour in two forms: fully expanded (used as the schema token value) and as the shortest
 * CSS reference to it (used when deriving further custom properties).
 */
interface DerivableColor {
	resolved: string;
	reference: string;
}

const customProperties: DynamicColorCustomProperty[] = [];

const input = (value: string): DerivableColor => ({ resolved: value, reference: value });

/**
 * Derives a colour from `parent` and registers it as a custom property. Colours that expand to the
 * same value share the first registered custom property.
 */
function derive(
	name: string,
	parent: DerivableColor,
	transform: (color: string) => string,
): DerivableColor {
	const resolved = transform(parent.resolved);
	const existing = customProperties.find(({ resolvedValue }) => resolvedValue === resolved);
	if (existing) {
		return { resolved, reference: `var(${existing.property})` };
	}

	const property = `--ds-dynamic-color-${name}`;
	customProperties.push({ property, value: transform(parent.reference), resolvedValue: resolved });
	return { resolved, reference: `var(${property})` };
}

const { hovered, pressed, subtle, subtlest } = LIGHTNESS_ADJUSTMENTS;

const foreground = input(`var(--ds-dynamic-foreground, ${INPUT_FALLBACKS.foreground})`);
const background = input(`var(--ds-dynamic-background, ${INPUT_FALLBACKS.background})`);
const backgroundSubtle = derive('background-subtle', background, adjustLightness(hovered, true));

type DynamicColorKey =
	| 'foreground'
	| 'foregroundSubtle'
	| 'foregroundSubtlest'
	| 'foregroundHovered'
	| 'foregroundPressed'
	| 'borderSubtle'
	| 'background'
	| 'backgroundHovered'
	| 'backgroundPressed'
	| 'backgroundSubtle'
	| 'backgroundSubtleHovered'
	| 'backgroundSubtlePressed'
	| 'disabled';

const colors: Record<DynamicColorKey, DerivableColor> = {
	foreground,
	foregroundSubtle: derive('foreground-subtle', foreground, adjustLightness(subtle, true)),
	foregroundSubtlest: derive('foreground-subtlest', foreground, adjustLightness(subtlest, true)),
	foregroundHovered: derive('foreground-hovered', foreground, adjustLightness(hovered, true)),
	foregroundPressed: derive('foreground-pressed', foreground, adjustLightness(pressed, false)),
	borderSubtle: derive('border-subtle', foreground, withAlpha(ALPHA.borderSubtle)),
	background,
	backgroundHovered: derive('background-hovered', background, adjustLightness(hovered, true)),
	backgroundPressed: derive('background-pressed', background, adjustLightness(pressed, false)),
	backgroundSubtle,
	backgroundSubtleHovered: derive(
		'background-subtle-hovered',
		backgroundSubtle,
		adjustLightness(hovered, true),
	),
	backgroundSubtlePressed: derive(
		'background-subtle-pressed',
		backgroundSubtle,
		adjustLightness(pressed, false),
	),
	disabled: derive('disabled', background, withAlpha(ALPHA.disabled)),
};

/**
 * Semantic colours available to the `UNSAFE-dynamic` theme schema.
 */
export const dynamicColor: Readonly<Record<DynamicColorKey, BaseToken>> = Object.fromEntries(
	Object.entries(colors).map(([key, { resolved }]) => [key, cssValue(resolved)]),
) as Record<DynamicColorKey, BaseToken>;

/**
 * Custom properties for the derived colours, in dependency order. The CSS theme formatter declares
 * these once and replaces matching token values with `var()` references to them.
 */
export const dynamicColorCustomProperties: readonly DynamicColorCustomProperty[] = customProperties;
