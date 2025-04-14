import {
	markProfilingEnd,
	markProfilingStart,
	withProfiling,
} from '../../../../../self-measurements';
import type { VCObserverEntry } from '../../../types';
import type { RevisionPayloadVCDetails } from '../../types';
import isViewportEntryData from '../../utils/is-viewport-entry-data';
import taskYield from '../../utils/task-yield';

import type {
	DOMSelector,
	HeatmapCheckpointMetrics,
	HeatmapEntry,
	HeatmapEntryData,
	HeatmapOptions,
	HeatmapRect,
	Viewport,
} from './types';

const MAX_HEATMAP_SIZE = 1000;

const createEmptyHeatmapEntry = withProfiling(
	function createEmptyHeatmapEntry(): HeatmapEntry {
		return {
			head: null,
			previousEntries: [],
		};
	},
	['vc'],
);

const createEmptyMap = withProfiling(
	function createEmptyMap(heatmapWidth: number, heatmapHeight: number) {
		return Array.from({ length: heatmapHeight }).map(() =>
			Array.from({ length: heatmapWidth }).map(createEmptyHeatmapEntry),
		);
	},
	['vc'],
);

const isRectInside = withProfiling(
	function isRectInside(
		a: HeatmapRect | null | undefined,
		b: HeatmapRect | null | undefined,
	): boolean {
		if (!a || !b) {
			return false;
		}

		// Check if all corners of rectangle a are within the bounds of rectangle b
		return a.left >= b.left && a.right <= b.right && a.top >= b.top && a.bottom <= b.bottom;
	},
	['vc'],
);

class Heatmap {
	private viewport: Viewport;

	/**
	 * Heatmap Width
	 */
	private width: number;

	/**
	 * Heatmap Height
	 */
	private height: number;

	/**
	 * Heatmap Area (width * height)
	 */
	private heatmapAreaSize: number;

	private scaleX: number;
	private scaleY: number;
	private map: Array<Array<HeatmapEntry>>;

	constructor({ viewport, heatmapSize }: HeatmapOptions) {
		const operationTimer = markProfilingStart('Heatmap constructor');

		// TODO timeOrigin? do we need? for SSR??
		this.viewport = viewport;

		const safeSize = Math.min(heatmapSize, MAX_HEATMAP_SIZE);

		if (viewport.width === 0 || viewport.height === 0) {
			this.width = safeSize;
			this.height = safeSize;
			this.scaleX = 1;
			this.scaleY = 1;
			this.heatmapAreaSize = 0;
			this.map = createEmptyMap(safeSize, safeSize);
			return;
		}

		const aspectRatio = viewport.width / viewport.height;

		if (aspectRatio > 1) {
			// Landscape orientation
			this.width = safeSize;
			this.height = Math.round(safeSize / aspectRatio);
		} else {
			// Portrait orientation
			this.width = safeSize;
			this.height = Math.round(safeSize * aspectRatio);
		}
		this.scaleX = this.width / viewport.width;
		this.scaleY = this.height / viewport.height;

		this.heatmapAreaSize = this.width * this.height;

		this.map = createEmptyMap(this.width, this.height);

		this.getHeatmap = withProfiling(this.getHeatmap.bind(this), ['vc']);
		this.getCell = withProfiling(this.getCell.bind(this), ['vc']);
		this.mapDOMRectToHeatmap = withProfiling(this.mapDOMRectToHeatmap.bind(this), ['vc']);
		this.getRatio = withProfiling(this.getRatio.bind(this), ['vc']);
		this.applyEntriesToHeatmap = withProfiling(this.applyEntriesToHeatmap.bind(this), ['vc']);
		this.getVCPercentMetrics = withProfiling(this.getVCPercentMetrics.bind(this), ['vc']);

		markProfilingEnd(operationTimer, { tags: ['vc'] });
	}

	getHeatmap() {
		return this.map;
	}

	private getCell(row: number, col: number) {
		return this.map[row]?.[col];
	}

	/**
	 * Map Dom Rect to Heatmap Rect, rounded up to occupy full cell.
	 * @param rect DOM Rect
	 * @returns
	 */
	private mapDOMRectToHeatmap(rect: DOMRect): HeatmapRect {
		const scaledX = rect.x * this.scaleX;
		const scaledY = rect.y * this.scaleY;
		const scaledWidth = rect.width * this.scaleX;
		const scaledHeight = rect.height * this.scaleY;

		return {
			left: Math.floor(scaledX),
			right: Math.ceil(scaledX + scaledWidth),
			top: Math.floor(scaledY),
			bottom: Math.ceil(scaledY + scaledHeight),
		};
	}

	/**
	 * Calculate the ratio of a HeatmapRect compared to the full heatmap
	 *
	 * This function determines what fraction of the heatmap is covered by the given heatmap rectangle.
	 *
	 * @param rect
	 */
	private getRatio(rect: HeatmapRect) {
		if (this.viewport.width === 0 || this.viewport.height === 0) {
			return 0;
		}

		const { right, left, bottom, top } = rect;
		const rectWidth = right - left;
		const rectHeight = bottom - top;
		const rectArea = rectWidth * rectHeight;

		const ratio = rectArea / this.heatmapAreaSize;

		if (ratio > 1) {
			return 1;
		}
		return ratio;
	}

	async applyEntriesToHeatmap(entries: ReadonlyArray<VCObserverEntry>) {
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			const { time, type, data } = entry;

			if (isViewportEntryData(data)) {
				const rect = this.mapDOMRectToHeatmap(data.rect);
				const ratio = this.getRatio(rect);

				const heatmapEntryData: HeatmapEntryData = {
					time,
					elementName: data.elementName,
					ratio: ratio ?? null,
					rect,
					source: type,
				};

				const roundedTop = Math.floor(rect.top);
				const roundedBottom = Math.min(rect.bottom, this.height);

				const roundedLeft = Math.floor(rect.left);
				const roundedRight = Math.min(rect.right, this.width);

				for (let row = roundedTop; row < roundedBottom; row++) {
					for (let col = roundedLeft; col < roundedRight; col++) {
						const cell = this.getCell(row, col);
						if (!cell) {
							continue;
						}

						const previousEntry = cell.head;

						// When elements are added at the same time
						// we try to keep the inner element changes as the head
						if (
							previousEntry?.time === entry.time &&
							isRectInside(previousEntry.rect, heatmapEntryData.rect)
						) {
							cell.previousEntries.push({
								...heatmapEntryData,
								source: 'mutation:parent-mounted',
							});
							continue;
						}

						cell.head = {
							...heatmapEntryData,
							source: heatmapEntryData.source || null,
						};

						if (previousEntry !== null) {
							cell.previousEntries.push(previousEntry);
						}
					}
				}
			}
			// Every 100 events processed
			// we give the browser the power
			// to process any other high priority task
			if (i % 100 === 0) {
				await taskYield();
			}
		}
	}

	async getVCPercentMetrics(
		vcPercentCheckpoint: number[],
		startTime: DOMHighResTimeStamp,
	): Promise<HeatmapCheckpointMetrics> {
		const sortedCheckpoints = [...vcPercentCheckpoint].sort((a, b) => a - b);
		const flattenHeatmap = this.map.flat();

		const totalCells = flattenHeatmap.length;

		const timestampMap = new Map<number, { cellCount: number; domElements: Set<string> }>();

		for (let i = 0; i < flattenHeatmap.length; i++) {
			const cell = flattenHeatmap[i];
			const cellHead = cell.head;
			const timestamp = Math.trunc(cellHead?.time ?? 0);
			const elementName = cellHead?.elementName;

			const curr = timestampMap.get(timestamp) ?? { cellCount: 0, domElements: new Set() };
			curr.cellCount += 1;
			if (elementName) {
				curr.domElements.add(elementName);
			}

			timestampMap.set(timestamp, curr);

			// Every 10000 heatmap entries processed
			// we give the browser the power
			// to process any other high priority task
			if (i > 10000 && i % 10000 === 0) {
				await taskYield();
			}
		}

		const sortedTimings = [...timestampMap.keys()].sort((a, b) => a - b);

		let totalCellPainted = 0;

		const result: HeatmapCheckpointMetrics = {};

		let domElementsBuffer = new Set<DOMSelector>();
		for (let i = 0; i < sortedTimings.length; i++) {
			const timestamp = sortedTimings[i];
			const timestampInfo = timestampMap.get(timestamp);
			if (!timestampInfo) {
				throw new Error('unexpected timestampInfo not found');
			}
			const { cellCount, domElements } = timestampInfo;
			totalCellPainted += cellCount;

			const currVCRatio = totalCellPainted / totalCells;
			const currVCPercent = Math.round(currVCRatio * 100);

			domElements.forEach((domElement) => {
				domElementsBuffer.add(domElement);
			});

			let matchesAnyCheckpoints = false;
			while (sortedCheckpoints.length > 0 && currVCPercent >= sortedCheckpoints[0]) {
				const checkpoint = sortedCheckpoints.shift();
				const domElements = [...domElementsBuffer];
				if (!checkpoint) {
					break;
				}
				matchesAnyCheckpoints = true;
				result[checkpoint.toString()] = {
					t: Math.round(timestamp - startTime),
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

		return result;
	}
}

const calculateTTVCPercentiles = withProfiling(
	async function calculateTTVCPercentiles({
		orderedEntries,
		viewport,
		percentiles,
		startTime,
	}: {
		orderedEntries: ReadonlyArray<VCObserverEntry>;
		viewport: Viewport;
		percentiles: number[];
		startTime: DOMHighResTimeStamp;
	}): Promise<RevisionPayloadVCDetails> {
		const heatmap = new Heatmap({
			viewport,
			heatmapSize: 200,
		});

		await heatmap.applyEntriesToHeatmap(orderedEntries);

		const vcDetails = await heatmap.getVCPercentMetrics(percentiles, startTime);
		return vcDetails;
	},
	['vc'],
);

export default calculateTTVCPercentiles;
