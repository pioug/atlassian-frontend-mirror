import { colorRegexp } from './color';
import { namedColors } from './named-colors';

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
