import type { VCObserverEntry, ViewportEntryData } from '../../../types';
import isViewportEntryData from '../../utils/is-viewport-entry-data';
import taskYield from '../../utils/task-yield';

import calculateUnionArea from './calc-union-area';

export type DOMSelector = string;

export type Viewport = {
	width: number;
	height: number;
};

export type CheckpointMetrics = {
	[checkpoint: string]: {
		/**
		 * Time when this checkpoint reached
		 */
		t: DOMHighResTimeStamp;
		/**
		 * A collection of DOM Selector that are part of the checkpoint
		 */
		e: DOMSelector[];
	};
};

export default async function calculateTTVCPercentiles({
	orderedEntries,
	viewport,
	percentiles,
	startTime,
}: {
	orderedEntries: ReadonlyArray<VCObserverEntry>;
	viewport: Viewport;
	percentiles: number[];
	startTime: DOMHighResTimeStamp;
}): Promise<CheckpointMetrics> {
	const sortedPercentiles = [...percentiles].sort((a, b) => a - b);

	const viewportArea = viewport.width * viewport.height;

	const checkpoints: CheckpointMetrics = {};

	let activeRects: DOMRect[] = orderedEntries
		.filter((e) => isViewportEntryData(e.data))
		.map((e) => (e.data as ViewportEntryData).rect);

	const removeActiveRect = (rectToRemove: DOMRect) => {
		const index = activeRects.indexOf(rectToRemove);
		// Check if the element exists in the array
		if (index !== -1) {
			// Remove the element at the found index
			activeRects.splice(index, 1);
		}
	};

	let domElementsBuffer = new Set<DOMSelector>();
	for (let i = 0; i < orderedEntries.length; i++) {
		const iEntry = orderedEntries[i];
		const iEntryData = iEntry.data;

		if (!isViewportEntryData(iEntryData)) {
			continue;
		}
		const { rect, elementName } = iEntryData;

		domElementsBuffer.add(elementName);
		removeActiveRect(rect);

		const exclusionArea = calculateUnionArea(activeRects);
		const currentArea = viewportArea - exclusionArea;

		const currVCPercent = Math.round((currentArea / viewportArea) * 100);

		let matchesAnyCheckpoints = false;
		while (sortedPercentiles.length > 0 && currVCPercent >= sortedPercentiles[0]) {
			const checkpoint = sortedPercentiles.shift();
			const domElements = [...domElementsBuffer];
			if (!checkpoint) {
				break;
			}
			matchesAnyCheckpoints = true;
			checkpoints[checkpoint.toString()] = {
				t: Math.round(iEntry.time - startTime),
				e: domElements,
			};
		}
		if (matchesAnyCheckpoints) {
			domElementsBuffer.clear();
		}

		if (i % 500 === 0) {
			await taskYield();
		}
	}

	return checkpoints;
}
