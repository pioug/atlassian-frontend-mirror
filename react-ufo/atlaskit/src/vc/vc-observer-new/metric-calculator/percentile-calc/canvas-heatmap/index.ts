import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { RevisionPayloadVCDetails } from '../../../../../common/vc/types';
import type { ViewportEntryData } from '../../../types';
import type {
	CalcTTVCPercentilesArg,
	CalcTTVCPercentilesArgWithDebugInfo,
	PercentileCalcResultWithSpeedIndex,
} from '../types';

import { calculatePercentiles } from './calculate-percentiles';
import { calculatePercentilesWithDebugInfo } from './calculate-percentiles-with-debug-info';
import { ViewportCanvas } from './viewport-canvas';

async function calculateTTVCPercentiles({
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

async function calculateTTVCPercentilesWithDebugInfo({
	viewport,
	orderedEntries,
	startTime,
}: CalcTTVCPercentilesArgWithDebugInfo): Promise<PercentileCalcResultWithSpeedIndex> {
	const canvas = new ViewportCanvas(
		viewport,
		fg('platform_ufo_canvas_heatmap_full_precision') ? 1 : 0.25,
	);
	const elementMap: Map<DOMHighResTimeStamp, ViewportEntryData[]> = new Map();

	for (const entry of orderedEntries) {
		if (!('rect' in entry.data)) {
			continue;
		}

		const rect = (entry.data as ViewportEntryData).rect;

		canvas.drawRect(rect, entry.time);

		if (!elementMap.has(entry.time)) {
			elementMap.set(entry.time, []);
		}

		elementMap.get(entry.time)!.push(entry.data);
	}

	// Get pixel counts
	const timePixelCounts = await canvas.getPixelCounts();
	const canvasDimensions = canvas.getScaledDimensions();
	const totalPixels = canvasDimensions.width * canvasDimensions.height;

	return calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, totalPixels, startTime);
}

export { calculateTTVCPercentilesWithDebugInfo };

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default calculateTTVCPercentiles;
