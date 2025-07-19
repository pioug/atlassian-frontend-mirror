import { type Node } from 'postcss-value-parser';

// https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units
const lengthAndPercentageUnitsPattern =
	/cm$|mm$|Q$|pc$|pt$|px$|%$|em$|ex$|ch$|rem$|lh$|rlh$|vw$|vh$|vmin$|vmax$|vb$|vi$|svw$|svh$|lvw$|lvh$|dvw$|dvh$|^-?[0-9]+(\.[0-9]+)*$/;

export const isLengthOrPercentage = (value: Node['value']): boolean =>
	lengthAndPercentageUnitsPattern.test(value);

const tokenMap: { [key: string]: string } = {
	'-2px': '--ds-space-negative-025',
	'-4px': '--ds-space-negative-050',
	'-6px': '--ds-space-negative-075',
	'-8px': '--ds-space-negative-100',
	'-12px': '--ds-space-negative-150',
	'-16px': '--ds-space-negative-200',
	'-20px': '--ds-space-negative-250',
	'-24px': '--ds-space-negative-300',
	'-32px': '--ds-space-negative-400',
	'0': '--ds-space-0',
	'0px': '--ds-space-0',
	'2px': '--ds-space-025',
	'4px': '--ds-space-050',
	'6px': '--ds-space-075',
	'8px': '--ds-space-100',
	'12px': '--ds-space-150',
	'16px': '--ds-space-200',
	'20px': '--ds-space-250',
	'24px': '--ds-space-300',
	'32px': '--ds-space-400',
	'40px': '--ds-space-500',
	'48px': '--ds-space-600',
	'64px': '--ds-space-800',
	'80px': '--ds-space-1000',

	'-0.125rem': '--ds-space-negative-025',
	'-0.25rem': '--ds-space-negative-050',
	'-0.375rem': '--ds-space-negative-075',
	'-0.5rem': '--ds-space-negative-100',
	'-0.75rem': '--ds-space-negative-150',
	'-1rem': '--ds-space-negative-200',
	'-1.25rem': '--ds-space-negative-250',
	'-1.5rem': '--ds-space-negative-300',
	'-2rem': '--ds-space-negative-400',
	'0.125rem': '--ds-space-025',
	'0.25rem': '--ds-space-050',
	'0.375rem': '--ds-space-075',
	'0.5rem': '--ds-space-100',
	'0.75rem': '--ds-space-150',
	'1rem': '--ds-space-200',
	'1.25rem': '--ds-space-250',
	'1.5rem': '--ds-space-300',
	'2rem': '--ds-space-400',
	'2.5rem': '--ds-space-500',
	'3rem': '--ds-space-600',
	'4rem': '--ds-space-800',
	'5rem': '--ds-space-1000',

	'-0.125em': '--ds-space-negative-025',
	'-0.25em': '--ds-space-negative-050',
	'-0.375em': '--ds-space-negative-075',
	'-0.5em': '--ds-space-negative-100',
	'-0.75em': '--ds-space-negative-150',
	'-1em': '--ds-space-negative-200',
	'-1.25em': '--ds-space-negative-250',
	'-1.5em': '--ds-space-negative-300',
	'-2em': '--ds-space-negative-400',
	'0.125em': '--ds-space-025',
	'0.25em': '--ds-space-050',
	'0.375em': '--ds-space-075',
	'0.5em': '--ds-space-100',
	'0.75em': '--ds-space-150',
	'1em': '--ds-space-200',
	'1.25em': '--ds-space-250',
	'1.5em': '--ds-space-300',
	'2em': '--ds-space-400',
	'2.5em': '--ds-space-500',
	'3em': '--ds-space-600',
	'4em': '--ds-space-800',
	'5em': '--ds-space-1000',
};

/**
 * Converts a spacing value to a design token CSS variable with fallback if a mapping exists
 *
 * This function is used by the stylelint rule to determine if a hardcoded spacing value
 * can be automatically converted to a spacing token. It checks the given value against the
 * map defined above. If a mapping exists, the function returns a CSS variable with a fallback
 * value. If no mapping exists, the function returns null.
 *
 * Examples:
 * - getSpacingToken("8px") returns "var(--ds-space-100, 8px)"
 * - getSpacingToken("0.5rem") returns "var(--ds-space-100, 0.5rem)"
 * - getSpacingToken("0") returns "var(--ds-space-0, 0)"
 * - getSpacingToken("999px") returns null (no matching token)
 *
 * @param value The spacing value to convert (e.g., "8px", "0.5rem", "12px", "0")
 * @returns The design token CSS variable string or null if no mapping exists
 */
export const getSpacingToken = (value: string): string | null => {
	return tokenMap[value] ? `var(${tokenMap[value]}, ${value})` : null;
};
