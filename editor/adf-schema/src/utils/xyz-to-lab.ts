import type { LAB } from './lab';
import type { XYZ } from './xyz';

export const xyzToLab = ({ x, y, z }: XYZ): LAB => ({
	l: Math.max(116 * y - 16, 0),
	a: 500 * (x - y),
	b: 200 * (y - z),
});
