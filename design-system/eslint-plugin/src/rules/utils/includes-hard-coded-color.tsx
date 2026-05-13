import { namedColors } from './named-colors';

const includesWholeWord = (value: string, options: Set<string>) => {
	const values = value
		.replace(/[^a-zA-Z ]/g, ' ')
		.trim()
		.split(/(?:,|\.| )+/);
	return values.some((value) => options.has(value));
};

export const includesHardCodedColor = (raw: string): boolean => {
	const value = raw.toLowerCase();

	if (
		/#(?:[a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})\b|((?:rgb|hsl)a?|(lch|lab|color))\([^\)]*\)/.exec(
			value.toLowerCase(),
		)
	) {
		return true;
	}

	if (includesWholeWord(value, namedColors)) {
		return true;
	}

	return false;
};
