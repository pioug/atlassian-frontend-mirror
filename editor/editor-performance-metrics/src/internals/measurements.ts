import {
	type Heatmap,
	type HeatmapEntryData,
	isElementMoved,
	isLayoutShift,
	isNodeReplacement,
} from './heatmap';
import type { UserEvent } from './timelineTypes';

export type VCTargetsTuple = ['25', '50', '75', '80', '85', '90', '95', '98', '99'];
const VCTargets: VCTargetsTuple = ['25', '50', '75', '80', '85', '90', '95', '98', '99'];

/**
 * Returns an object containing timestamps for specified percentiles.
 *
 * This function takes an object where keys are percentiles as strings and
 * values are timestamps. It returns an object where the keys are a predefined
 * set of target VC target percentiles ('25', '50', '75', '80', '85', '90', '95', '98', '99')
 * and the values are the timestamps corresponding to the closest lower or exact
 * available percentile from the input.
 *
 * @param {Record<string, number>} timestampPercent - An object with percentile keys and timestamp values.
 * @returns {Record<VCTargetsTuple[number], number>} - An object with predefined percentile keys and corresponding timestamps.
 *
 * @example
 * const timestampPercent = {
 *   "34": 161,
 *   "37": 759,
 *   "39": 1357,
 *   "55": 2176,
 *   "71": 2571,
 *   "96": 3177,
 *   "100": 4183
 * };
 *
 * const result = getVCPercentileTargets(timestampPercent);
 * console.log(result);
 * // Output:
 * // {
 * //   "25": 161,
 * //   "50": 2176,
 * //   "75": 3177,
 * //   "80": 3177,
 * //   "85": 3177,
 * //   "90": 3177,
 * //   "95": 3177,
 * //   "98": 4183,
 * //   "99": 4183
 * // }
 */
export function getVCPercentileTargets(
	timestampPercent: Record<string, number>,
): Record<VCTargetsTuple[number], number> {
	// Parse and sort the input percentiles in descending order.
	const descSortedPercentiles = Object.keys(timestampPercent)
		.map((key) => parseInt(key, 10))
		.sort((a, b) => b - a);

	// Initialize the result object with default values.
	const result: Record<VCTargetsTuple[number], number> = {
		'25': -1,
		'50': -1,
		'75': -1,
		'80': -1,
		'85': -1,
		'90': -1,
		'95': -1,
		'98': -1,
		'99': -1,
	};

	// Function to find the closest lower or exact percentile.
	function findClosestLowerOrExact(target: number) {
		let closest = -1;
		for (let i = 0; i < descSortedPercentiles.length; i++) {
			const percentile = descSortedPercentiles[i];

			if (percentile >= target) {
				closest = percentile;
			}
		}
		return closest;
	}

	// Map each target percentile to the closest lower or exact match.
	for (const target of VCTargets) {
		const closestPercentile = findClosestLowerOrExact(parseInt(target, 10));
		result[target] = timestampPercent[closestPercentile.toString()];
	}

	return result;
}

export function sameDimensions(a: HeatmapEntryData | null, b: HeatmapEntryData | null): boolean {
	if (!a?.rect || !b?.rect) {
		return false;
	}

	return (
		a.rect.left === b.rect.left &&
		a.rect.right === b.rect.right &&
		a.rect.top === b.rect.top &&
		a.rect.bottom === b.rect.bottom
	);
}

export function sameElementName(a: HeatmapEntryData | null, b: HeatmapEntryData | null): boolean {
	if (!a?.rect || !b?.rect) {
		return false;
	}

	return a.elementName === b.elementName;
}

export function calculateNodeReplacements(
	head: HeatmapEntryData,
	previousEntries: HeatmapEntryData[],
): number {
	const lastEntry = previousEntries[previousEntries.length - 1];
	if (
		head.source === 'mutation' &&
		lastEntry.source === 'mutation' &&
		sameElementName(head, lastEntry) &&
		sameDimensions(head, lastEntry)
	) {
		return Math.round(lastEntry.time);
	}

	return head.time;
}

export function getLastValidEntry(
	head: HeatmapEntryData,
	previousEntries: HeatmapEntryData[],
	options: VCPercentFromHeatmapOptions,
): HeatmapEntryData | null {
	if (!isLayoutShift(head) && !isNodeReplacement(head) && !isElementMoved(head)) {
		return head;
	}

	if (
		(isLayoutShift(head) && !options.ignoreLayoutShifts) ||
		(isNodeReplacement(head) && !options.ignoreNodeReplacements) ||
		(isElementMoved(head) && !options.ignoreElementMoved)
	) {
		return head;
	}

	const entries = previousEntries.reduce((acc, e) => {
		if (isNodeReplacement(e) && options.ignoreNodeReplacements) {
			return acc;
		}

		if (isLayoutShift(e) && options.ignoreLayoutShifts) {
			return acc;
		}

		if (isElementMoved(e) && options.ignoreElementMoved) {
			return acc;
		}

		acc.push(e);

		return acc;
	}, [] as HeatmapEntryData[]);

	return entries[entries.length - 1];
}

type VCPercentFromHeatmapOptions = Partial<{
	ignoreNodeReplacements: boolean;
	ignoreLayoutShifts: boolean;
	ignoreElementMoved: boolean;
}>;
export function getVCPercentFromHeatmap(
	heatmap: Heatmap,
	options: VCPercentFromHeatmapOptions,
): Record<string, number> {
	const flatHeapmap = heatmap.map.flat().map((entry, index) => {
		const { head, previousEntries } = entry;
		if (!head) {
			return 0;
		}

		const validEntry = getLastValidEntry(head, previousEntries, options);
		return Math.round(validEntry?.time || 0);
	});

	if (flatHeapmap.length === 0) {
		return {
			'100': 0,
		};
	}
	const timestampAmount = flatHeapmap.reduce(
		(acc, value) => {
			const timestampTrunc = Math.trunc(value);

			const curr = acc[timestampTrunc] || 0;

			acc[timestampTrunc] = curr + 1;

			return acc;
		},
		{} as Record<string, number>,
	);

	let accAmount = 0;
	const VCPercent: Record<string, number> = Object.entries(timestampAmount)
		.sort((a, b) => {
			return parseInt(a[0], 10) - parseInt(b[0], 10);
		})
		.reduce(
			(acc, [timestamp, amount]) => {
				const percent = Math.trunc(((amount + accAmount) / flatHeapmap.length) * 100);
				acc[percent] = parseInt(timestamp, 10);

				accAmount = accAmount + amount;

				return acc;
			},
			{} as Record<string, number>,
		);

	return VCPercent;
}

export type EventPercentileTargets = {
	p50: number;
	p85: number;
	p90: number;
	p95: number;
	p99: number;
};

export function calculatePercentile(sortedArr: number[], percentile: number): number {
	const index = (percentile / 100) * (sortedArr.length - 1);
	const lower = Math.floor(index);
	const upper = lower + 1;
	const weight = index % 1;
	if (upper >= sortedArr.length) {
		return sortedArr[lower];
	}

	const interpolatedValue = sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;

	return Math.round(interpolatedValue * 100) / 100;
}

export function getLatencyPercentiles(events: Array<UserEvent>): EventPercentileTargets | null {
	if (events.length === 0) {
		return null;
	}

	const durations = events.map(({ data }) => data.duration).sort((a, b) => a - b);

	const result: EventPercentileTargets = {
		p50: calculatePercentile(durations, 50),
		p85: calculatePercentile(durations, 85),
		p90: calculatePercentile(durations, 90),
		p95: calculatePercentile(durations, 95),
		p99: calculatePercentile(durations, 99),
	};

	return result;
}
