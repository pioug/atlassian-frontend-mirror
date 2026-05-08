import chromatism from 'chromatism';

import { convertHexShorthand } from './convert-hex-shorthand';

export const generateTextColor = (color: string): string => {
	const converted = convertHexShorthand(color);
	return chromatism.contrastRatio(converted).hex;
};
