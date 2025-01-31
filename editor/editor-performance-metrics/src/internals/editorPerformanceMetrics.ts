import { backgroundTask, isTaskAborted } from './backgroundTasks';
import { getViewportDimensions } from './dom';
import {
	createHeatmapFromEvents,
	createHeatmapFromTimeline,
	createHeatmapWithAspectRatio,
	type Heatmap,
} from './heatmap';
import {
	getLatencyPercentiles,
	getVCPercentFromHeatmap,
	getVCPercentileTargets,
	type VCTargetsTuple,
} from './measurements';
import type { Timeline } from './timelineInterfaces';
import type { TimelineEventNames, UserEvent } from './timelineTypes';
import type { UserEventCategory, ViewportDimension } from './types';

export type CalculateVCOptions = {
	ignoreNodeReplacements: boolean;
	ignoreLayoutShifts: boolean;
	ignoreElementMoved: boolean;
	heatmapSize: number;
	rangeEventsFilter?: RangeEventsFilter | null;
};

const latencyCategories: UserEventCategory[] = [
	'mouse-movement',
	'mouse-action',
	'keyboard',
	'form',
	'clipboard',
	'drag-and-drop',
	'page-resize',
	'scroll',
	'touch',
	'other',
];

export type Percentiles = {
	p50: number;
	p85: number;
	p90: number;
	p95: number;
	p99: number;
};
export type LatencyPercentileTargets = Record<UserEventCategory, Percentiles>;

export type TTVCTargets = Record<VCTargetsTuple[number], number>;
export type TTVCTargetsPromise = Promise<TTVCTargets | null>;
export type RangeEventsFilter = {
	from: DOMHighResTimeStamp | TimelineEventNames;
	to: DOMHighResTimeStamp | TimelineEventNames;
};

export class EditorPerformanceMetrics {
	private viewport: Readonly<ViewportDimension> | null;
	private timeline: Timeline;

	constructor(timeline: Timeline, viewport: ViewportDimension = getViewportDimensions()) {
		this.timeline = timeline;
		this.viewport = viewport;
	}

	async calculateLatencyPercents(): Promise<LatencyPercentileTargets | null> {
		const promises = latencyCategories.map((category) => {
			const events = this.timeline.getEventsPerType(
				`user-event:${category}`,
			) as unknown as UserEvent[];

			const task = backgroundTask(async (taskYield) => {
				await taskYield();

				const percentiles = getLatencyPercentiles(events);
				if (!percentiles) {
					return null;
				}

				return { [category]: percentiles } as Partial<LatencyPercentileTargets>;
			});

			return task.result;
		});

		const allPercentilesProcessed = await Promise.all(promises);

		let isEmpty = true;
		let result: LatencyPercentileTargets = {} as LatencyPercentileTargets;
		for (const maybePercentils of allPercentilesProcessed) {
			if (isTaskAborted(maybePercentils) || !maybePercentils) {
				continue;
			}

			result = Object.assign(result, maybePercentils);
			isEmpty = false;
		}

		if (isEmpty) {
			return null;
		}

		return result;
	}

	async calculateLastHeatmap(
		heatmapSize: number,
		rangeEventsFilter?: RangeEventsFilter | null,
	): Promise<Heatmap | null> {
		if (!this.viewport) {
			return null;
		}

		const baseheatmap: Heatmap = createHeatmapWithAspectRatio({
			viewport: this.viewport,
			heatmapSize,
		});

		if (!rangeEventsFilter) {
			return createHeatmapFromTimeline(this.timeline, baseheatmap);
		}

		const timelineEvents = this.timeline.getEvents();

		const startIndex = timelineEvents.findIndex((event) => {
			if (typeof rangeEventsFilter.from === 'number') {
				return event.startTime >= rangeEventsFilter.from;
			}

			return event.type === rangeEventsFilter.from;
		});
		if (startIndex < 0) {
			return null;
		}

		const endIndex = timelineEvents.slice(startIndex).findIndex((event) => {
			if (typeof rangeEventsFilter.to === 'number') {
				return event.startTime <= rangeEventsFilter.to;
			}

			return event.type === rangeEventsFilter.to;
		});

		const filteredEventsShallowCopy =
			endIndex < 0
				? timelineEvents.slice(startIndex)
				: timelineEvents.slice(startIndex, startIndex + endIndex + 1);
		const filteredEvents = Array.from(filteredEventsShallowCopy);
		const heatmap = await createHeatmapFromEvents(filteredEvents, baseheatmap);

		return heatmap;
	}

	async calculateVCPercents(options: CalculateVCOptions): Promise<Record<string, number> | null> {
		const heatmap = await this.calculateLastHeatmap(options.heatmapSize, options.rangeEventsFilter);

		if (!heatmap) {
			return null;
		}

		const VCPercents = getVCPercentFromHeatmap(heatmap, options);
		return VCPercents;
	}

	async calculateVCTargets(options?: Partial<CalculateVCOptions>): Promise<TTVCTargets | null> {
		const defaultOptions = {
			ignoreNodeReplacements: false,
			ignoreLayoutShifts: false,
			ignoreElementMoved: false,
			heatmapSize: 200,
			rangeEventsFilter: null,
		};
		const mergedOptions = Object.assign(defaultOptions, options || {});

		const VCPercents = await this.calculateVCPercents(mergedOptions);
		if (!VCPercents) {
			return null;
		}

		const VCTargets = getVCPercentileTargets(VCPercents);

		return VCTargets;
	}
}

export function createCalculator(timeline: Timeline, viewport?: ViewportDimension) {
	return new EditorPerformanceMetrics(timeline, viewport);
}
