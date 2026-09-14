import type { ViewportEntryData } from '../../../types';
import type { PercentileCalcResult, PercentileCalcResultWithSpeedIndex } from '../types';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function calculatePercentilesWithDebugInfo(
	timePixelCounts: Map<DOMHighResTimeStamp, number>,
	elementMap: ReadonlyMap<DOMHighResTimeStamp, ViewportEntryData[]>,
	totalPixels: number,
	startTime: DOMHighResTimeStamp,
): PercentileCalcResultWithSpeedIndex {
	const entries: PercentileCalcResult = new Array(elementMap.size);

	let cumulativePixels = 0;
	let speedIndex = 0;
	let previousPercentCovered = 0;

	const sortedEntries = Array.from(timePixelCounts.entries()).sort(
		([timeA], [timeB]) => Number(timeA) - Number(timeB),
	);

	for (let i = 0; i < sortedEntries.length; i++) {
		const [time, pixelCount] = sortedEntries[i];
		cumulativePixels += pixelCount;
		const percentCovered = (cumulativePixels / totalPixels) * 100;

		const entryDatas = elementMap.get(time) || [];

		const relativeTime = Math.round(Number(time - startTime));
		entries[i] = {
			time: relativeTime,
			viewportPercentage: percentCovered,
			entries: Array.from(entryDatas),
		};

		// Speed index calculation: sum of (time × incremental viewport percentage)
		const ratioDelta = (percentCovered - previousPercentCovered) / 100;
		speedIndex += relativeTime * ratioDelta;
		previousPercentCovered = percentCovered;
	}

	return {
		entries,
		speedIndex: Math.round(speedIndex),
	};
}
