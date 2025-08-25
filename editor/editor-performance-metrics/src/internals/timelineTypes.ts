/**
 * Timeline Types
 *
 * This file contains type definitions for the Timeline system. It's separated from the main
 * implementation to improve modularity, readability, and maintainability of the codebase.
 *
 * The types defined here form the foundation of the Timeline system, describing the structure
 * of events, configuration options, and other key concepts used throughout the implementation.
 */
import type { HeatmapEntrySource, UserEventCategory } from './types';

export type BasicEventTimestamp<
	name extends string,
	data = Record<string, string | number | undefined | null>,
> = {
	data: data;
	startTime: DOMHighResTimeStamp;
	type: name;
};

export type ElementChangedEvent = BasicEventTimestamp<
	'element:changed',
	{
		elementName: string;
		previousRect: DOMRectReadOnly | undefined;
		rect: DOMRectReadOnly;
		source: HeatmapEntrySource;
		wrapperSectionName: string;
	}
>;
export type AbortUserInteractionEvent = BasicEventTimestamp<
	'abort:user-interaction',
	{ source: string }
>;
export type DOMMutationFinishedEvent = BasicEventTimestamp<'DOMMutation:finished'>;
export type PerformanceLongTaskEvent = BasicEventTimestamp<'performance:long-task'>;
export type IntersectionObserverVisibleNodesEvent =
	BasicEventTimestamp<'IntersectionObserver:VisibleNodes'>;
export type PerformanceFirstPaintEvent = BasicEventTimestamp<'performance:first-paint'>;
export type PerformanceFirstContentfulPaintEvent =
	BasicEventTimestamp<'performance:first-contentful-paint'>;
export type PerformanceLayoutShiftEvent = BasicEventTimestamp<'performance:layout-shift'>;
export type PerformanceLongAnimationFrameEvent = BasicEventTimestamp<
	'performance:long-animation-frame',
	{
		// TODO: PGXT-7953 - use type `PerformanceLongAnimationFrameTiming` https://product-fabric.atlassian.net/browse/PGXT-7953
		entry: PerformanceEntry;
	}
>;
export type UserEvent = BasicEventTimestamp<
	`user-event:${UserEventCategory}`,
	{
		category: UserEventCategory;
		duration: number;
		elementName: string;
		// Made optional for now because unsure if this affects production logic or not
		entry?: PerformanceEventTiming;
		eventName: string;
	}
>;
export type IdleTimeEvent = BasicEventTimestamp<
	'idle-time',
	{
		duration: number;
	}
>;

export type HoldIdleTimeoutEvent = BasicEventTimestamp<
	'hold-idle:timeout',
	{
		holdedAt: DOMHighResTimeStamp;
		uuid: string;
	}
>;

export type HoldIdleEventSources = 'setTimeout' | 'Promise' | 'fetch';
export type HoldIdleStartEvent = BasicEventTimestamp<
	'hold-idle:start',
	{
		source: HoldIdleEventSources;
		uuid: string;
	}
>;
export type HoldIdleEndEvent = BasicEventTimestamp<
	'hold-idle:end',
	{
		duration: number;
		source: HoldIdleEventSources;
		uuid: string;
	}
>;

export type TimelineEvent =
	| ElementChangedEvent
	| AbortUserInteractionEvent
	| DOMMutationFinishedEvent
	| PerformanceLongTaskEvent
	| IntersectionObserverVisibleNodesEvent
	| PerformanceFirstPaintEvent
	| PerformanceFirstContentfulPaintEvent
	| PerformanceLayoutShiftEvent
	| PerformanceLongAnimationFrameEvent
	| IdleTimeEvent
	| UserEvent
	| HoldIdleTimeoutEvent
	| HoldIdleStartEvent
	| HoldIdleEndEvent;

export type ExtractEventNames<T> = T extends { type: infer U } ? U : never;

export type TimelineEventNames = ExtractEventNames<TimelineEvent>;

export type TimelineEventsGrouped = {
	[K in TimelineEventNames]: Array<ExtractEventTypes<TimelineEvent, K>>;
};

export type TimelineOptions = {
	/*
	 * Control how often the Idle Buffer is flushed to the subscribers.
	 *
	 * When one of the thresholds is hit then the buffer is flushed.
	 */
	buffer: {
		/**
		 * Based in the amount of idle cycles
		 */
		cyclesThreshold: 1 | 5 | 10 | 100;
		/**
		 * Based in the amount of events added on Timeline
		 */
		eventsThreshold: 1 | 200;
	} | null;
	cleanup: {
		// TODO: PGXT-7918 - Remove threshold. Set threshold option for 10 events for debugging purposes
		// https://product-fabric.atlassian.net/browse/PGXT-7918
		eventsThreshold: 10 | 100 | 1000 | 3000 | 10000;
	};

	/**
	 * The maximum duration (in milliseconds) to hold an idle event before timing out.
	 */
	maxHoldDuration: number;
	shouldIdleOnPageVisibilityChange?: boolean;
};

export type ExtractEventTypes<T, N extends string> = T extends { type: N } ? T : never;
export type TimelineEvents = {
	[K in TimelineEventNames]: Array<ExtractEventTypes<TimelineEvent, K>>;
};
export type EventsGroupedSerialized = Array<
	[
		TimelineEventNames,
		{
			[K in TimelineEventNames]: Array<ExtractEventTypes<TimelineEvent, K>>;
		}[TimelineEventNames],
	]
>;
