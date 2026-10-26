import type { CustomProperty } from '../../../scripts/style-dictionary/formatters/css-variable-formatter';
import spacingPalette, { type SpacingPaletteToken } from '../../palettes/spacing-scale';
import baseSpacing from '../atlassian-spacing/spacing';

const customProperties: CustomProperty[] = [];

const inputDefaults = { scale: 1, curve: 1, uniformity: 0, round: 1 } as const;

/**
 * Derive semantic values from the standard theme and palette, preserving their rem-based units.
 * Each unrounded value is clamped against its predecessor before rounding, matching the original
 * spacing controls even when contraction and a strong curve would otherwise reverse sizes.
 */
function curveFamily<T extends Record<string, { value: SpacingPaletteToken }>>(
	family: 'gap' | 'inset',
	tokens: T,
): T {
	const entries = Object.entries(tokens);
	const sizes = entries.map(([, token]) => spacingPalette.space[token.value].value);
	const minimum = Math.min(...sizes);
	const maximum = Math.max(...sizes);
	const input = (name: keyof typeof inputDefaults) =>
		`var(--ds-dynamic-space-${family}-${name}, ${inputDefaults[name]})`;
	let previous = '0rem';

	const result = Object.fromEntries(
		entries.map(([name, token], index) => {
			const size = sizes[index];
			const position = maximum === minimum ? 0 : (size - minimum) / (maximum - minimum);
			const influence = `${input('uniformity')} + (1 - ${input('uniformity')}) * pow(${position}, ${input('curve')})`;
			const property = `--ds-dynamic-space-${family}-${name}-unrounded`;
			const value = `max(${previous}, ${size / 16}rem * pow(${input('scale')}, ${influence}))`;
			customProperties.push({ property, value, resolvedValue: value });
			previous = `var(${property})`;
			return [
				name,
				{
					...token,
					value: `calc(${previous} * (1 - ${input('round')}) + round(nearest, ${previous}, 1px) * ${input('round')})`,
				},
			];
		}),
	);

	// This theme supplies CSS expressions in place of the base schema's palette references.
	return result as T;
}

export const dynamicSpacing: typeof baseSpacing = {
	space: {
		...baseSpacing.space,
		gap: curveFamily('gap', baseSpacing.space.gap),
		inset: curveFamily('inset', baseSpacing.space.inset),
	},
};

export const dynamicSpacingCustomProperties: readonly CustomProperty[] = customProperties;
