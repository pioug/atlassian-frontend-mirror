import type { RevisionPayloadVCDetails } from '../../../../../common/vc/types';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function calculatePercentiles(
	timePixelCounts: Map<DOMHighResTimeStamp, number>,
	elementMap: ReadonlyMap<DOMHighResTimeStamp, Set<string>>,
	unorderedPercentiles: number[],
	totalPixels: number,
	startTime: DOMHighResTimeStamp,
): RevisionPayloadVCDetails {
	const results: RevisionPayloadVCDetails = {};

	let cumulativePixels = 0;
	const percentiles = unorderedPercentiles.sort((a, b) => a - b);

	// Sort entries by timestamp for consistent processing
	const sortedEntries = Array.from(timePixelCounts.entries()).sort(
		([timeA], [timeB]) => Number(timeA) - Number(timeB),
	);

	let percentileIndex = 0;
	let domElementsBuffer = new Set<string>();

	for (const [time, pixelCount] of sortedEntries) {
		cumulativePixels += pixelCount;
		const percentCovered = (cumulativePixels / totalPixels) * 100;
		const elementNames = elementMap.get(time) || new Set();
		elementNames.forEach((elName) => domElementsBuffer.add(elName));

		let matchesAnyCheckpoints = false;
		while (percentileIndex < percentiles.length && percentCovered >= percentiles[percentileIndex]) {
			results[`${percentiles[percentileIndex]}`] = {
				t: Math.round(Number(time - startTime)),
				e: Array.from(domElementsBuffer),
			};
			percentileIndex++;

			matchesAnyCheckpoints = true;
		}

		if (matchesAnyCheckpoints) {
			domElementsBuffer.clear();
		}

		if (percentileIndex >= percentiles.length) {
			break;
		}
	}

	let previousResult: { t: number; e: string[] } = { t: 0, e: [] };
	for (let i = 0; i < percentiles.length; i++) {
		const percentile = percentiles[i];

		if (!(percentile in results)) {
			results[`${percentile}`] = previousResult;
		}

		previousResult = results[`${percentile}`];
	}

	return results;
}
