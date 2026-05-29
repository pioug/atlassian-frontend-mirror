export function labF(t: number): number {
	const e = 216.0 / 24389.0;
	const kappa = 24389.0 / 27.0;
	if (t > e) {
		return Math.pow(t, 1.0 / 3.0);
	} else {
		return (kappa * t + 16) / 116;
	}
}
