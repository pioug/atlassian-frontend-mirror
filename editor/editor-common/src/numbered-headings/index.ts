const MAX_HEADING_LEVEL = 6;

/**
 * DOM attribute carrying a heading's computed number. Editor and renderer styles render it with
 * `[data-heading-number]::before { content: attr(data-heading-number) "." }`.
 */
export const HEADING_NUMBER_ATTRIBUTE = 'data-heading-number';

/**
 * Computes decimal outline numbers (`1`, `1.1`, `1.1.1`) for headings in document order.
 *
 * Each number has exactly `level` segments. Skipped levels are backfilled with `1` and count as
 * real siblings, and a higher-level heading resets all deeper counters.
 *
 * @example getHeadingNumbers([1, 3, 2]) // ['1', '1.1.1', '1.2']
 */
export const getHeadingNumbers = (levels: readonly number[]): string[] => {
	const counters = new Array<number>(MAX_HEADING_LEVEL).fill(0);

	return levels.map((rawLevel) => {
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
	});
};
