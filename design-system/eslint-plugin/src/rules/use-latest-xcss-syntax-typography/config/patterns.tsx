export const PATTERNS = [
	'restricted-property',
	'wrapped-token-value',
	'restricted-capitalisation',
] as const;

export type Pattern = (typeof PATTERNS)[number];
