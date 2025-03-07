import { fg } from '@atlaskit/platform-feature-flags';

import type { ViewportEntryData } from '../../../types';
import type { RevisionPayloadVCDetails } from '../../types';
import type { CalcTTVCPercentilesArg } from '../types';

import { ViewportCanvas } from './canvas-pixel';

export default async function calculateTTVCPercentiles({
	viewport,
	orderedEntries,
	percentiles,
	startTime,
}: CalcTTVCPercentilesArg): Promise<RevisionPayloadVCDetails> {
	const canvas = new ViewportCanvas(
		viewport,
		fg('platform_ufo_canvas_heatmap_full_precision') ? 1 : 0.25,
	);
	const elementMap: Map<DOMHighResTimeStamp, Set<string>> = new Map();

	for (const entry of orderedEntries) {
		if (!('rect' in entry.data)) {
			continue;
		}

		const rect = (entry.data as ViewportEntryData).rect;
		const elementName = (entry.data as ViewportEntryData).elementName;

		canvas.drawRect(rect, entry.time);

		if (!elementMap.has(entry.time)) {
			elementMap.set(entry.time, new Set());
		}

		elementMap.get(entry.time)!.add(elementName);
	}

	// Get pixel counts
	const timePixelCounts = await canvas.getPixelCounts();
	const canvasDimenstions = canvas.getScaledDimensions();
	const totalPixels = canvasDimenstions.width * canvasDimenstions.height;

	return calculatePercentiles(timePixelCounts, elementMap, percentiles, totalPixels, startTime);
}

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
