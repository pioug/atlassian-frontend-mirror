export function labInvf(ft: number): number {
	const e = 216.0 / 24389.0;
	const kappa = 24389.0 / 27.0;
	const ft3 = ft * ft * ft;
	if (ft3 > e) {
		return ft3;
	} else {
		return (116 * ft - 16) / kappa;
	}
}
