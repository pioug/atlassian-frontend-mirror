import { taskYield } from './backgroundTasks';
import type { Timeline, TimelineEvent } from './timeline';
import type { HeatmapEntrySource } from './types';

export type HeatmapEntryData = {
	time: DOMHighResTimeStamp;
	elementName: string | null;
	wrapperSectionName: string | null;
	rect: HeatmapRect | null;
	source: HeatmapEntrySource | null;
	ratio: number | null;
};
export type HeatmapEntry = {
	head: HeatmapEntryData | null;
	previousEntries: Array<HeatmapEntryData>;
};

export function createEmptyHeatmapEntry(): HeatmapEntry {
	return {
		head: null,
		previousEntries: [],
	};
}

export type Heatmap = {
	map: Array<Array<HeatmapEntry>>;
	height: number;
	width: number;
	scaleX: number;
	scaleY: number;
};

/**
 * Represents a rectangular area in the heatmap.
 */
export type HeatmapRect = {
	left: number;
	top: number;
	right: number;
	bottom: number;
};

export function cloneEntry(entry: HeatmapEntry): HeatmapEntry {
	if (!entry.head) {
		return {
			head: null,
			previousEntries: [...entry.previousEntries],
		};
	}

	return {
		head: {
			time: entry.head.time,
			elementName: entry.head.elementName,
			wrapperSectionName: entry.head.wrapperSectionName,
			rect: entry.head.rect,
			source: entry.head.source,
			ratio: entry.head.ratio,
		},
		previousEntries: [...entry.previousEntries],
	};
}

/**
 * Clones a 2D array of numbers.
 *
 * This function creates a deep copy of the provided 2D array, which is faster than using `structuredClone`.
 *
 * @param {ReadonlyArray<ReadonlyArray<HeatmapEntry>>} arr - The 2D array to clone.
 * @returns {Array<Array<number>>} A deep copy of the original 2D array.
 */
export function cloneArray(
	arr: ReadonlyArray<ReadonlyArray<HeatmapEntry>>,
): Array<Array<HeatmapEntry>> {
	// This is much faster than `structuredClone(arr)`
	return arr.map((a) => {
		return a.map(cloneEntry);
	});
}

export function isRectInside(
	a: HeatmapRect | null | undefined,
	b: HeatmapRect | null | undefined,
): boolean {
	if (!a || !b) {
		return false;
	}

	// Check if all corners of rectangle a are within the bounds of rectangle b
	return a.left >= b.left && a.right <= b.right && a.top >= b.top && a.bottom <= b.bottom;
}

/**
 * Parameters required for transforming a heatmap.
 */
type TransformHeatmapProps = {
	rect: HeatmapRect;
	entry: Omit<HeatmapEntryData, 'source'>;
	transformSource: HeatmapEntrySource | null;
	heatmap: Heatmap;
	onEmptyRow: (props: { entry: Omit<HeatmapEntryData, 'source'>; row: number }) => void;
};

/**
 * Transforms the heatmap by updating the rectangles with the current start time.
 *
 * Iterates over the specified rectangle area within the heatmap and updates each cell with the provided start time.
 * If a row is undefined, the provided callback is invoked.
 *
 * Attention! This function does mutate the heatmap
 *
 * @param {TransformHeatmapProps} props - The properties for transforming the heatmap.
 * @returns {Heatmap | undefined} The updated heatmap or undefined if a row is not found.
 */
export function transformHeatmap({
	rect,
	heatmap,
	transformSource,
	onEmptyRow,
	entry,
}: TransformHeatmapProps) {
	const { roundedBottom, roundedTop, roundedLeft, roundedRight } = {
		roundedBottom: Math.min(Math.trunc(rect.bottom), heatmap.height),
		roundedTop: Math.trunc(rect.top),
		roundedLeft: Math.trunc(rect.left),
		roundedRight: Math.min(Math.trunc(rect.right), heatmap.width),
	};
	const localHeatmap: Array<Array<HeatmapEntry>> = heatmap.map;

	for (let row = roundedTop; row < roundedBottom; row++) {
		for (let col = roundedLeft; col < roundedRight; col++) {
			if (localHeatmap[row] === undefined || localHeatmap[row][col] === undefined) {
				onEmptyRow({
					entry,
					row,
				});
			} else {
				const previousEntry = localHeatmap[row][col].head;

				// When elements are added at the same time
				// we try to keep the inner element changes as the head
				// This logic is really important to make sure placeholders are properly ignored
				if (previousEntry?.time === entry.time && isRectInside(previousEntry.rect, entry.rect)) {
					localHeatmap[row][col].previousEntries.push({
						...entry,
						source: 'mutation:parent-mounted',
					});
					continue;
				}

				// Check for the same dimensions and elementName
				const isSameDimensions =
					isRectInside(entry.rect, previousEntry?.rect) &&
					isRectInside(previousEntry?.rect, entry.rect);
				const isSameElementName = entry.elementName === previousEntry?.elementName;

				if (transformSource === 'mutation' && isSameDimensions && isSameElementName) {
					localHeatmap[row][col].head = {
						...entry,
						source: 'mutation:node-replacement',
					};
				} else {
					localHeatmap[row][col].head = {
						...entry,
						source: transformSource || null,
					};
				}

				if (previousEntry !== null) {
					localHeatmap[row][col].previousEntries.push(previousEntry);
				}
			}
		}
	}
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
function createDOMRect(x: number, y: number, width: number, height: number): DOMRectReadOnly {
	if (typeof DOMRect !== 'undefined') {
		// DOMRect well supported supported
		// eslint-disable-next-line compat/compat
		return new DOMRect(x, y, width, height);
	} else {
		// Fallback for environments without DOMRect
		return {
			x,
			y,
			width,
			height,
			get left() {
				return this.x;
			},
			get right() {
				return this.x + this.width;
			},
			get top() {
				return this.y;
			},
			get bottom() {
				return this.y + this.height;
			},
			toJSON() {},
		};
	}
}

/**
 * Maps a DOMRect to a heatmap's coordinate system.
 *
 * Converts the dimensions of a DOMRect to the heatmap's coordinate system using the heatmap's scaling factors.
 *
 * @param {object} props - The properties required for mapping.
 * @param {DOMRect} props.rect - The DOMRect to map.
 * @param {Heatmap} props.heatmap - The heatmap with scaling information.
 * @returns {HeatmapRect} The mapped heatmap rectangle.
 */
export function mapDOMRectToHeatmap(props: { rect: DOMRect; heatmap: Heatmap }): HeatmapRect {
	const {
		rect,
		heatmap: { scaleX, scaleY },
	} = props;

	const scaledX = rect.x * scaleX;
	const scaledY = rect.y * scaleY;
	const scaledWidth = rect.width * scaleX;
	const scaledHeight = rect.height * scaleY;

	const n = createDOMRect(scaledX, scaledY, scaledWidth, scaledHeight);

	return {
		left: n.left,
		right: n.right,
		top: n.top,
		bottom: n.bottom,
	};
}

/**
 * Calculates the ratio of a heatmap rectangle compared to the full heatmap.
 *
 * This function determines what fraction of the heatmap is covered by the given heatmap rectangle.
 *
 * @param {object} props - The properties required for ratio calculation.
 * @param {HeatmapRect} props.heatmapRect - The heatmap rectangle.
 * @param {Heatmap} props.heatmap - The full heatmap dimensions.
 * @returns {number} The ratio of the rectangle area to the heatmap area.
 */
export function getElementRatio(props: { rect: HeatmapRect; viewport: ViewportDimension }): number {
	const { right, left, bottom, top } = props.rect;

	if (props.viewport.w === 0 || props.viewport.h === 0) {
		return 0;
	}

	const ratio = ((right - left) * (bottom - top)) / (props.viewport.w * props.viewport.h);

	if (ratio > 1) {
		return 1;
	}

	return parseFloat(ratio.toFixed(5));
}

export type ViewportDimension = {
	w: number;
	h: number;
};

/**
 * Initializes a square heatmap with all values set to zero.
 *
 * Creates a 2D array with the specified size, where each value is initialized to zero.
 *
 * @param {number} heatmapSize - The size of the heatmap (both width and height).
 * @returns {HeatmapEntry[][]} A 2D array representing the heatmap, filled with empty HeatmapEntry.
 */
export function cleanSquareHeatmap(heatmapSize: number) {
	return Array.from({ length: heatmapSize }).map(() =>
		Array.from({ length: heatmapSize }).map(createEmptyHeatmapEntry),
	);
}
/**
 * Creates a new heatmap array based on the aspect ratio of the viewport.
 *
 * This function adjusts the heatmap dimensions to match the aspect ratio of the viewport,
 * ensuring that the heatmap scales proportionally to the viewport size. The maximum allowable
 * heatmap size is capped at 1000 to prevent excessive memory usage.
 *
 * @param {ViewportDimension} viewport - The dimensions of the viewport.
 * @param {number} heatmapSize - The base size of the heatmap, capped at a maximum of 1000.
 * @returns {Heatmap} A new heatmap object with calculated dimensions and scaling factors.
 */
export function createHeatmapWithAspectRatio({
	viewport,
	heatmapSize,
}: {
	viewport: ViewportDimension;
	heatmapSize: number;
}): Heatmap {
	const maxHeatmapSize = 1000;
	const safeSize = Math.min(heatmapSize, maxHeatmapSize);

	if (viewport.w === 0 || viewport.h === 0) {
		return {
			width: safeSize,
			height: safeSize,
			scaleX: 1,
			scaleY: 1,
			map: cleanSquareHeatmap(safeSize),
		};
	}

	const aspectRatio = viewport.w / viewport.h;

	// Calculate heatmap dimensions based on aspect ratio
	let heatmapWidth;
	let heatmapHeight;

	if (aspectRatio > 1) {
		// Landscape orientation
		heatmapWidth = safeSize;
		heatmapHeight = Math.round(safeSize / aspectRatio);
	} else {
		// Portrait orientation
		heatmapHeight = safeSize;
		heatmapWidth = Math.round(safeSize * aspectRatio);
	}

	// Initialize the heatmap with zeros
	const map = Array.from({ length: heatmapHeight }).map(() =>
		Array.from({ length: heatmapWidth }).map(createEmptyHeatmapEntry),
	);

	const scaleX = heatmapWidth / viewport.w;
	const scaleY = heatmapHeight / viewport.h;

	return {
		width: heatmapWidth,
		height: heatmapHeight,
		scaleX,
		scaleY,
		map,
	};
}

export async function createHeatmapFromEvents(
	events: ReadonlyArray<TimelineEvent>,
	initialHeatmap: Heatmap,
): Promise<Heatmap> {
	const nextHeatmap = {
		...initialHeatmap,
		map: cloneArray(initialHeatmap.map),
	};

	for (let i = 0; i < events.length; i++) {
		const { type, startTime, data } = events[i];

		if (type !== 'element:changed') {
			continue;
		}

		const { elementName, wrapperSectionName, source } = data;
		const heatmapRect = mapDOMRectToHeatmap({
			rect: data.rect,
			heatmap: nextHeatmap,
		});

		const ratio = getElementRatio({
			rect: heatmapRect,
			viewport: {
				w: nextHeatmap.width,
				h: nextHeatmap.height,
			},
		});

		const entry = {
			time: startTime,
			elementName,
			wrapperSectionName,
			ratio,
			rect: heatmapRect,
		};

		transformHeatmap({
			rect: heatmapRect,
			entry,
			heatmap: nextHeatmap,
			transformSource: source,
			onEmptyRow: ({ entry, row }) => {},
		});

		// Every 10 events processed
		// we give the browser the power
		// to process any other high priority task
		if (i % 10 === 0) {
			await taskYield();
		}
	}

	return nextHeatmap;
}

export function createHeatmapFromTimeline(timeline: Timeline, initialHeatmap: Heatmap) {
	const events = timeline.getEvents();

	return createHeatmapFromEvents(events, initialHeatmap);
}

export function isLayoutShift(entry: HeatmapEntryData | null | undefined): boolean {
	if (!entry || typeof entry.source !== 'string') {
		return false;
	}

	return entry.source === 'layout-shift';
}

export function isNodeReplacement(entry: HeatmapEntryData | null | undefined): boolean {
	if (!entry || typeof entry.source !== 'string') {
		return false;
	}

	return entry.source === 'mutation:node-replacement';
}

export function isElementMoved(entry: HeatmapEntryData | null | undefined): boolean {
	if (!entry || typeof entry.source !== 'string') {
		return false;
	}

	return entry.source === 'layout-shift:element-moved';
}
