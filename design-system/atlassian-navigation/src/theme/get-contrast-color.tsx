import chromatism from 'chromatism';

import { hexToRGBA } from './hex-to-rgba';

export const getContrastColor = (
	contrastValue: number,
	opacityValue: number,
	color: string,
): string => hexToRGBA(chromatism.contrast(contrastValue, color).hex, opacityValue);
