import { type Appearance, appearanceMap } from '../types';
import { isColorName } from './isColorName';

export const getLozengeAppearance = (colorName: string): Appearance | undefined => {
	if (isColorName(colorName)) {
		return appearanceMap[colorName];
	}
};
