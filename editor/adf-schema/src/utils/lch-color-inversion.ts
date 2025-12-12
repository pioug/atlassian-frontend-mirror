type RGB = { b: number; g: number; r: number };

// https://en.wikipedia.org/wiki/HCL_color_space
type LCH = { c: number; h: number; l: number };

// https://en.wikipedia.org/wiki/CIE_1931_color_space#CIE_xy_chromaticity_diagram_and_the_CIE_xyY_color_space
type XYZ = { x: number; y: number; z: number };

// https://en.wikipedia.org/wiki/CIELAB_color_space
type LAB = { a: number; b: number; l: number };

const clamp = (i: number, min: number, max: number): number =>
	Math.round(Math.min(Math.max(i, min), max));

const expandShorthandHex = (input: string): string =>
	// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
	input.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/iu, (m, r, g, b) => r + r + g + g + b + b);

const rgbFromHex = (input: string): RGB | null => {
	const fullHex = expandShorthandHex(input);
	// @ts-ignore TS1501: This regular expression flag is only available when targeting 'es6' or later.
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/iu.exec(fullHex);
	return result === null
		? null
		: {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			};
};

const rgbToHex = ({ r, g, b }: RGB): string => {
	const convertComponent = (c: number): string => {
		const cBase16 = c.toString(16);
		return cBase16.length === 1 ? `0${cBase16}` : cBase16;
	};
	return `#${convertComponent(r)}${convertComponent(g)}${convertComponent(b)}`;
};

const rgbToXyz = (rgb: RGB): XYZ => {
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

const xyzToLab = ({ x, y, z }: XYZ): LAB => ({
	l: Math.max(116 * y - 16, 0),
	a: 500 * (x - y),
	b: 200 * (y - z),
});

const labToLch = ({ l, a, b }: LAB): LCH => {
	let h = (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360;
	const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	if (Math.round(c * 10000) === 0) {
		h = Number.NaN;
	}
	return { l, c, h };
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

const rgbToLch = (rgb: RGB): LCH => labToLch(xyzToLab(rgbToXyz(rgb)));

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

const getLightness = (color: string): number => {
	const rgb = rgbFromHex(color);
	if (rgb === null) {
		return 0;
	}

	const lch = rgbToLch(rgb);
	return lch.l;
};

export const getDarkModeLCHColor = (currentBackgroundColor: string): string => {
	const lightness = getLightness(currentBackgroundColor);
	const newLightness = Math.abs(100 - lightness);
	return clampLightness(currentBackgroundColor, newLightness).toUpperCase();
};
