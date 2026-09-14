import { knownNamedColors } from './known-named-colors';

const NAMED_COLORS = Object.keys(knownNamedColors);

export function isNamedColor(value: string): boolean {
	return NAMED_COLORS.includes(value);
}
