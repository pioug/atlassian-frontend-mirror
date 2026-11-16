const MAX_HEADING_LEVEL = 6;

/**
 * Creates a function that returns the decimal outline number (`1`, `1.1`, `1.1.1`) of each heading,
 * called once per heading in document order. Use it when headings are visited one at a time.
 *
 * Each number has exactly `level` segments. Skipped levels are backfilled with `1` and count as
 * real siblings, and a higher-level heading resets all deeper counters.
 *
 * @example
 * const getNextHeadingNumber = createHeadingNumberer();
 * getNextHeadingNumber(1); // '1'
 * getNextHeadingNumber(3); // '1.1.1'
 * getNextHeadingNumber(2); // '1.2'
 */
export const createHeadingNumberer = (): ((level: number) => string) => {
	const counters = new Array<number>(MAX_HEADING_LEVEL).fill(0);

	return (rawLevel) => {
		const level = Math.min(Math.max(Math.trunc(rawLevel) || 1, 1), MAX_HEADING_LEVEL);
		for (let index = 0; index < level - 1; index++) {
			if (counters[index] === 0) {
				counters[index] = 1;
			}
		}
		counters[level - 1] += 1;
		for (let index = level; index < MAX_HEADING_LEVEL; index++) {
			counters[index] = 0;
		}
		return counters.slice(0, level).join('.');
	};
};
