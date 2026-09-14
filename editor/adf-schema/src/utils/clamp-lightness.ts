import type { LAB } from './lab';
import type { LCH, RGB } from './lch-color-inversion';
import { rgbFromHex } from './rgb-from-hex';
import { rgbToLch } from './rgb-to-lch';
import type { XYZ } from './xyz';

const clamp = (i: number, min: number, max: number): number =>
	Math.round(Math.min(Math.max(i, min), max));

const rgbToHex = ({ r, g, b }: RGB): string => {
	const convertComponent = (c: number): string => {
		const cBase16 = c.toString(16);
		return cBase16.length === 1 ? `0${cBase16}` : cBase16;
	};
	return `#${convertComponent(r)}${convertComponent(g)}${convertComponent(b)}`;
};

const lchToLab = ({ l, c, h }: LCH): LAB => {
	const convertH = Number.isNaN(h) ? 0 : h * (Math.PI / 180);
	return { l, a: Math.cos(convertH) * c, b: Math.sin(convertH) * c };
};

const labToXyz = ({ l, a, b }: LAB): XYZ => {
	const convertComponent = (c: number) =>
		c > 0.206896552 ? Math.pow(c, 3) : 0.12841855 * (c - 0.137931034);

	const y = (l + 16) / 116;
	const x = a / 500 + y;
	const z = y - b / 200;

	return {
		x: convertComponent(x) * 0.95047,
		y: convertComponent(y),
		z: convertComponent(z) * 1.08883,
	};
};

const xyzToRgb = ({ x, y, z }: XYZ): RGB => {
	const convertComponent = (c: number) =>
		255 * (c <= 0.00304 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

	return {
		r: clamp(convertComponent(3.2404542 * x - 1.5371385 * y - 0.4985314 * z), 0, 255),
		g: clamp(convertComponent(-0.969266 * x + 1.8760108 * y + 0.041556 * z), 0, 255),
		b: clamp(convertComponent(0.0556434 * x - 0.2040259 * y + 1.0572252 * z), 0, 255),
	};
};

const lchToRgb = (lch: LCH): RGB => xyzToRgb(labToXyz(lchToLab(lch)));

export const clampLightness = (color: string, newPercent: number): string => {
	const rgb = rgbFromHex(color);
	if (rgb === null) {
		return color;
	}

	// LCH (rather than HSL) gives the best results here as the L component in LCH is based on human color perception
	const lch = rgbToLch(rgb);
	lch.l = clamp(newPercent, 0, 100);

	return rgbToHex(lchToRgb(lch));
};
