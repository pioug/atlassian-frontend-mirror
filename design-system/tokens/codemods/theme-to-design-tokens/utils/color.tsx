import { namedColors } from './named-colors';

const colorRegexp =
	/#(?:[a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})\b|(?:rgb|rgba|hsl|hsla|lch|lab|color)\([^\)]*\)/;

export const includesHardCodedColor: (raw: string) => boolean = (raw: string) => {
	const value = raw.toLowerCase();
	if (colorRegexp.exec(value)) {
		return true;
	}

	for (let i = 0; i < namedColors.length; i++) {
		if (value.includes(`${namedColors[i]};`)) {
			return true;
		}
	}

	return false;
};

export const isHardCodedColor: (raw: string) => boolean = (raw: string) => {
	const value = raw.toLowerCase();

	if (namedColors.includes(value)) {
		return true;
	}

	const match = value.toLowerCase().match(colorRegexp);
	if (match && match[0] === value) {
		return true;
	}

	return false;
};

export { isLegacyColor } from './is-legacy-color';
export { isLegacyNamedColor } from './is-legacy-named-color';
export { isBoldColor } from './is-bold-color';
