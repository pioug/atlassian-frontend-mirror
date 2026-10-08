/**
 * Typography formulas for the `UNSAFE-typography` theme.
 *
 * The theme is derived from the base `atlassian-typography` schema so it always covers the same
 * tokens. Values are rewritten to read two runtime inputs:
 *
 * - `--ds-dynamic-font-family`: replaces the sans/brand font stack (code tokens keep monospace)
 * - `--ds-dynamic-font-scale`: unitless multiplier applied to font sizes and line heights
 * - `--ds-dynamic-font-heading-<size>-scale`: extra multiplier for one heading size, on top of the
 *   global scale, so individual headings can be sized out of proportion for stylistic effect
 *
 * The `_` prefix keeps this file out of the theme's token sources (see `build-themes.tsx`).
 */
import type {
	FontFamilyPaletteTokenSchema,
	FontSizeScaleTokenSchema,
	LineHeightScaleTokenSchema,
} from '../../../src/types';
import typographyPalette, {
	type FontFamilyPaletteValues,
	type FontSizeScaleValues,
	type LineHeightScaleValues,
} from '../../palettes/typography-palette';
import baseFontFamily from '../atlassian-typography/font-family';
import baseTypography from '../atlassian-typography/theme';

const FONT_FAMILY_INPUT = '--ds-dynamic-font-family';
const FONT_SCALE_INPUT = '--ds-dynamic-font-scale';

/**
 * The palette's type declares `typography` as a union of its scales, but the palette object spreads
 * every scale into one, so all of the groups read here are present.
 */
type TypographyPaletteGroups = FontFamilyPaletteTokenSchema<FontFamilyPaletteValues> &
	FontSizeScaleTokenSchema<FontSizeScaleValues> &
	LineHeightScaleTokenSchema<LineHeightScaleValues>;

const { fontFamily, fontSize, lineHeight } =
	typographyPalette.typography as TypographyPaletteGroups;

type PaletteGroup = Record<string, { value: string | number }>;

/**
 * Monospace stacks are left alone so code stays legible whatever family is chosen.
 */
const isMonospace = (paletteKey: string) => /Mono/.test(paletteKey);

/**
 * Converts a palette pixel value to rem, matching the `pixel/rem` transform.
 */
const toRem = (group: PaletteGroup, paletteKey: string) => {
	const value = group[paletteKey].value;
	return typeof value === 'number' ? `${value / 16}rem` : value;
};

const dynamicFontFamily = (paletteKey: string) =>
	isMonospace(paletteKey)
		? paletteKey
		: `var(${FONT_FAMILY_INPUT}, ${(fontFamily as PaletteGroup)[paletteKey].value})`;

/**
 * Multiplies a palette size by the global scale and, for headings, the heading's own scale.
 */
const scaled = (group: PaletteGroup, paletteKey: string, headingSize?: string) =>
	headingSize
		? `calc(${toRem(group, paletteKey)} * var(${FONT_SCALE_INPUT}, 1) * var(--ds-dynamic-font-heading-${headingSize}-scale, 1))`
		: `calc(${toRem(group, paletteKey)} * var(${FONT_SCALE_INPUT}, 1))`;

type Node = { [key: string]: unknown };

const isNode = (value: unknown): value is Node => typeof value === 'object' && value !== null;

/**
 * Recursively rewrites token leaves (objects with a `value`) using `rewrite`, which also receives
 * the token's path, e.g. `['font', 'heading', 'xxlarge']`.
 */
function mapTokens<T>(schema: T, rewrite: (value: unknown, path: string[]) => unknown): T {
	const visit = (node: unknown, path: string[]): unknown => {
		if (!isNode(node)) {
			return node;
		}

		if ('value' in node) {
			return { ...node, value: rewrite(node.value, path) };
		}

		return Object.fromEntries(
			Object.entries(node).map(([key, child]) => [key, visit(child, [...path, key])]),
		);
	};

	// Custom theme values are CSS expressions rather than palette keys, so the rewritten schema is
	// cast back to the base schema type in this one place.
	return visit(schema, []) as T;
}

/**
 * The heading size for a `font.heading.<size>` token path, if it is one.
 */
const getHeadingSize = (path: string[]) =>
	path.length === 3 && path[0] === 'font' && path[1] === 'heading' ? path[2] : undefined;

/**
 * Composite `font.*` tokens with the dynamic family and scale applied.
 */
export const dynamicTypography: typeof baseTypography = mapTokens(baseTypography, (value, path) => {
	if (!isNode(value) || typeof value.fontFamily !== 'string') {
		return value;
	}

	const headingSize = getHeadingSize(path);

	return {
		...value,
		fontFamily: dynamicFontFamily(value.fontFamily),
		fontSize: scaled(fontSize as PaletteGroup, value.fontSize as string, headingSize),
		lineHeight: scaled(lineHeight as PaletteGroup, value.lineHeight as string, headingSize),
	};
});

/**
 * `font.family.*` tokens with the dynamic family applied.
 */
export const dynamicFontFamilies: typeof baseFontFamily = mapTokens(baseFontFamily, (value) =>
	typeof value === 'string' ? dynamicFontFamily(value) : value,
);
