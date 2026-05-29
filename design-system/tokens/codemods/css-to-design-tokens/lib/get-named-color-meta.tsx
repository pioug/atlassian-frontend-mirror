import { knownNamedColors } from './known-named-colors';

export function getNamedColorMeta(namedColor: string): string[] {
	return knownNamedColors[namedColor] ?? [];
}
