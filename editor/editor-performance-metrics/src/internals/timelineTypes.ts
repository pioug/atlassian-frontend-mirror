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
	type: name;
	startTime: DOMHighResTimeStamp;
	data: data;
};

export type ElementChangedEvent = BasicEventTimestamp<
	'element:changed',
	{
		wrapperSectionName: string;
		elementName: string;
		rect: DOMRectReadOnly;
		previousRect: DOMRectReadOnly | undefined;
		source: HeatmapEntrySource;
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
export type UserEvent = BasicEventTimestamp<
	`user-event:${UserEventCategory}`,
	{
		category: UserEventCategory;
		elementName: string;
		eventName: string;
		duration: number;
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
		source: HoldIdleEventSources;
		duration: number;
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
	cleanup: {
		eventsThreshold: 100 | 1000 | 3000 | 10000;
	};
	/*
	 * Control how often the Idle Buffer is flushed to the subscribers.
	 *
	 * When one of the thresholds is hit then the buffer is flushed.
	 */
	buffer: {
		/**
		 * Based in the amount of events added on Timeline
		 */
		eventsThreshold: 1 | 200;
		/**
		 * Based in the amount of idle cycles
		 */
		cyclesThreshold: 1 | 5 | 10 | 100;
	} | null;

	/**
	 * The maximum duration (in milliseconds) to hold an idle event before timing out.
	 */
	maxHoldDuration: number;
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
