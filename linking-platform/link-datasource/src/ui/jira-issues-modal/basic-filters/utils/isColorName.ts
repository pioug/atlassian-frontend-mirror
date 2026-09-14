import { appearanceMap, type ColorName } from '../types';

export function isColorName(colorName: string): colorName is ColorName {
	return Object.keys(appearanceMap).includes(colorName);
}
