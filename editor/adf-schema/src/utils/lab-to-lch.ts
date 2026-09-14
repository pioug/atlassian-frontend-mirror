import type { LAB } from './lab';

type LCH = { c: number; h: number; l: number };

export const labToLch = ({ l, a, b }: LAB): LCH => {
	let h = (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360;
	const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	if (Math.round(c * 10000) === 0) {
		h = Number.NaN;
	}
	return { l, c, h };
};
