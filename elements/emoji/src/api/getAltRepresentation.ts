import { type AltRepresentations, type EmojiServiceRepresentation } from '../types';
import { calculateScale } from './calculateScale';
import { getPixelRatio } from './getPixelRatio';

export const getAltRepresentation = (reps: AltRepresentations): EmojiServiceRepresentation => {
	// Invalid reps handled outside function - logic may change depending what the service returns
	return reps[calculateScale(getPixelRatio).altScale];
};
