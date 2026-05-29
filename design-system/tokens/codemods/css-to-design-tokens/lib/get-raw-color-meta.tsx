import { knownRawColors } from './known-raw-colors';

export function getRawColorMeta(rawColor: string): string[] {
	let cleanColor = rawColor.toLowerCase();

	if (cleanColor.length === 4) {
		cleanColor = cleanColor + cleanColor.substring(cleanColor.indexOf('#') + 1);
	}

	return knownRawColors[cleanColor] ?? [];
}
