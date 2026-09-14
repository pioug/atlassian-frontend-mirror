const SHORTHAND_HEX_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/iu;

export const expandShorthandHex = (input: string): string =>
	input.replace(SHORTHAND_HEX_REGEX, (_m, r, g, b) => r + r + g + g + b + b);
