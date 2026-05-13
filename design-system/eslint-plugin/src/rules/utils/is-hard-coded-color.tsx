import { namedColors } from './named-colors';

const includesWholeWord = (value: string, options: Set<string>) => {
	const values = value
		.replace(/[^a-zA-Z ]/g, ' ')
		.trim()
		.split(/(?:,|\.| )+/);
	return values.some((value) => options.has(value));
};

export const isHardCodedColor = (value: string): boolean => {
	if (includesWholeWord(value.toLowerCase(), namedColors)) {
		return true;
	}

	if (
		value.startsWith('rgb(') ||
		value.startsWith('rgba(') ||
		value.startsWith('hsl(') ||
		value.startsWith('hsla(') ||
		value.startsWith('lch(') ||
		value.startsWith('lab(') ||
		value.startsWith('color(')
	) {
		return true;
	}

	if (
		value.startsWith('#') &&
		// short hex, hex, or hex with alpha
		(value.length === 4 || value.length === 7 || value.length === 9)
	) {
		return true;
	}

	return false;
};
