import { withProfiling } from '../../../../../self-measurements';

interface SweepLineEvent {
	x: number;
	type: 'start' | 'end';
	top: number;
	bottom: number;
}

/**
 * Calculate the union areas of all rectangles using Sweep Line Algorithm
 *
 * Reference:
 * 	https://en.wikipedia.org/wiki/Sweep_line_algorithm
 *  https://www.hackerearth.com/practice/math/geometry/line-sweep-technique/tutorial/#:~:text=A%20sweep%20line%20is%20an,order%20to%20discretize%20the%20sweep.
 *
 * @param rectangles
 * @returns
 */
const calculateUnionArea = withProfiling(
	function calculateUnionArea(rectangles: DOMRect[]): number {
		// Step 1: Create sweep line events
		const events = createSweepLineEvents(rectangles);

		// Step 2: Process events to calculate total area
		const activeIntervals = new Map<string, number>();
		let totalArea = 0;
		let previousX = 0;
		for (const event of events) {
			// Calculate height at current x-position
			const currentHeight = calculateActiveHeight(activeIntervals);
			// Add area since last x-position
			totalArea += currentHeight * (event.x - previousX);
			// Update x-position
			previousX = event.x;
			// Update active intervals
			updateActiveIntervals(activeIntervals, event);
		}
		return totalArea;
	},
	['vc'],
);

export default calculateUnionArea;

const createSweepLineEvents = withProfiling(
	function createSweepLineEvents(rectangles: DOMRect[]): SweepLineEvent[] {
		const events: SweepLineEvent[] = [];
		for (const rect of rectangles) {
			// Create start and end events for each rectangle
			events.push({
				x: rect.left,
				type: 'start',
				top: rect.top,
				bottom: rect.bottom,
			});
			events.push({
				x: rect.right,
				type: 'end',
				top: rect.top,
				bottom: rect.bottom,
			});
		}
		// Sort events by x-coordinate (and type as tiebreaker)
		return events.sort((a, b) => (a.x === b.x ? (a.type === 'end' ? 1 : -1) : a.x - b.x));
	},
	['vc'],
);

const calculateActiveHeight = withProfiling(
	function calculateActiveHeight(intervals: Map<string, number>): number {
		if (intervals.size === 0) {
			return 0;
		}
		// Get all unique y-coordinates
		const coordinates: number[] = [];
		for (const [key] of intervals) {
			const [start, end] = key.split(',').map(Number);
			coordinates.push(start, end);
		}
		// Sort coordinates
		const sortedCoords = [...new Set(coordinates)].sort((a, b) => a - b);
		let totalHeight = 0;
		// Check each segment between consecutive coordinates
		for (let i = 0; i < sortedCoords.length; i++) {
			const y1 = sortedCoords[i];
			const y2 = sortedCoords[i + 1];
			// Check if this segment is covered by any active interval
			let covered = false;
			for (const [key, count] of intervals) {
				if (count <= 0) {
					continue;
				}
				const [start, end] = key.split(',').map(Number);
				if (start <= y1 && end >= y2) {
					covered = true;
					break;
				}
			}
			if (covered) {
				totalHeight += y2 - y1;
			}
		}
		return totalHeight;
	},
	['vc'],
);

const updateActiveIntervals = withProfiling(
	function updateActiveIntervals(intervals: Map<string, number>, event: SweepLineEvent): void {
		const key = `${event.top},${event.bottom}`;
		if (event.type === 'start') {
			intervals.set(key, (intervals.get(key) || 0) + 1);
		} else {
			const count = intervals.get(key) || 0;
			if (count > 1) {
				intervals.set(key, count - 1);
			} else {
				intervals.delete(key);
			}
		}
	},
	['vc'],
);
