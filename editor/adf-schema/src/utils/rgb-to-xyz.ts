import type { RGB } from './lch-color-inversion';
import type { XYZ } from './xyz';

export const rgbToXyz = (rgb: RGB): XYZ => {
	const convertRgbComponent = (c: number) =>
		c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;

	const convertXyzComponent = (c: number) =>
		c > 0.008856452 ? Math.pow(c, 1 / 3) : c / 0.12841855 + 0.137931034;

	const r = convertRgbComponent(rgb.r / 255);
	const g = convertRgbComponent(rgb.g / 255);
	const b = convertRgbComponent(rgb.b / 255);

	return {
		x: convertXyzComponent((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047),
		y: convertXyzComponent(0.2126729 * r + 0.7151522 * g + 0.072175 * b),
		z: convertXyzComponent((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883),
	};
};
