import { withProfiling } from '../self-measurements';

export const roundEpsilon = withProfiling(function roundEpsilon(num: number, places = 3) {
	const factor = Math.pow(10, places);
	return Math.round((num + Number.EPSILON) * factor) / factor;
});
