// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function round(n: number): number {
	if (isNaN(n)) {
		return 0;
	}
	return Math.round(n * 10000) / 10000;
}
