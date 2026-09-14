import { colorRegexp } from './color';
import { namedColors } from './named-colors';

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
