import { type AbortableTask, backgroundTask } from './backgroundTasks';
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
	| UserEvent;

export type ExtractEventNames<T> = T extends { type: infer U } ? U : never;

export type TimelineEventNames = ExtractEventNames<TimelineEvent>;

export type TimelineEventsGrouped = {
	[K in TimelineEventNames]: Array<ExtractEventTypes<TimelineEvent, K>>;
};

export type OnIdleBufferFlushCallback = (props: {
	idleAt: DOMHighResTimeStamp;
	timelineBuffer: Readonly<Timeline>;
}) => void;

/**
 * Cleanable
 *
 * The Cleanable interface defines a method for cleaning up resources or resetting state
 * within the implementing class. This is particularly useful for managing memory and
 * performance in systems that accumulate data over time.
 *
 * Key Method:
 * - `attemptCleanup()`: This method is used to reset the timeline
 *   when certain conditions are met, such as exceeding an event threshold.
 */
export interface Cleanable {
	attemptCleanup: (source: 'interval-check' | 'manual') => void;
}

export type TimelineOptions = {
	cleanup: {
		eventsThreshold: 100 | 1000 | 10000;
	};
	buffer: {
		eventsThreshold: 1 | 200;
		cyclesThreshold: 1 | 10 | 100;
	} | null;
};

const defaultOptions: TimelineOptions = {
	cleanup: {
		eventsThreshold: 10000,
	},
	buffer: {
		eventsThreshold: 200,
		cyclesThreshold: 10,
	},
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

/**
 * TimelineSerializable
 *
 * The TimelineSerializable interface provides a method for converting the timeline's
 * internal state into a JSON format. This is useful for data persistence, debugging,
 * or transmitting timeline data.
 *
 * Key Method:
 * - `serialise()`: Serializes the timeline events into an array of tuples, each containing
 *   an event type and an array of events of that type.
 */

export interface TimelineSerializable {
	serialise(): EventsGroupedSerialized;
}

/**
 * Timeline
 *
 * The Timeline interface defines the basic structure for accessing a collection
 * of timeline events. It allows retrieval of all events or events filtered by their type.
 *
 * Key Methods:
 * - `getEvents()`: Returns a sorted array of all timeline events.
 * - `getEventsPerType(type)`: Retrieves events of a specific type, allowing for type-safe access to events.
 */
export interface Timeline {
	getEvents(): ReadonlyArray<TimelineEvent>;
	getEventsPerType<T extends TimelineEventNames>(type: T): TimelineEventsGrouped[T];
}

/**
 * TimelineClock
 *
 * The TimelineClock interface extends the Timeline interface, adding methods for
 * marking new events and managing idle-period callbacks.
 *
 * Key Methods:
 * - `markEvent(event)`: Adds a new event to the timeline and manages the idle detection logic.
 * - `onIdleBufferFlush(cb)`: Registers a callback to be triggered when the idle buffer is flushed.
 *   Returns a function to unsubscribe the callback.
 */
export interface TimelineClock extends Timeline {
	markEvent(event: TimelineEvent): void;
	onIdleBufferFlush(cb: OnIdleBufferFlushCallback): TimelineIdleUnsubcribe;
}

export type EventsPerTypeMap = Map<
	TimelineEventNames,
	{
		[K in TimelineEventNames]: Array<ExtractEventTypes<TimelineEvent, K>>;
	}[TimelineEventNames]
>;
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnorderedEvents = Array<Readonly<BasicEventTimestamp<any, any>>>;

export type TimelineIdleBuffer = {
	eventsPerType: EventsPerTypeMap;
	unorderedEvents: UnorderedEvents;
};
export type TimelineIdleUnsubcribe = () => void;

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * TimelineController
 *
 * The TimelineController class is a comprehensive system designed to track and
 * manage a series of events over time. It facilitates the recording, retrieval,
 * and attemptCleanup of timeline events, and provides an interface for triggering
 * callbacks when idle buffer conditions are met.
 *
 * Key Functionalities:
 * - Event Management: Allows adding events, sorting them by timestamp, and retrieving them by type.
 * - Idle Detection: Automatically detects idle periods and triggers registered callbacks when conditions are met.
 * - Buffer Management: Maintains an internal buffer of events, with configurable thresholds to trigger callbacks
 *   based on buffer size or idle cycles.
 * - Serialization: Provides functionality to serialize the timeline state into a structured JSON format.
 *
 * Parameters:
 * - `givenOptions`: An optional configuration object that allows customization of the timeline's behavior.
 *
 *   `TimelineOptions` includes:
 *   - `cleanup`: An object specifying cleanup behavior.
 *     - `eventsThreshold`: A number (100, 1000, or 10000) indicating the maximum number of events allowed before
 *       automatic cleanup is triggered. This helps manage memory usage by clearing old events.
 *   - `buffer`: An object specifying when callbacks should be triggered during idle periods.
 *     - `eventsThreshold`: A number (1 or 200) specifying how many events can accumulate in the buffer
 *       before triggering a callback. This threshold ensures the system responds promptly when a certain
 *       volume of activity has occurred.
 *     - `cyclesThreshold`: A number (1, 10, or 100) indicating how many idle cycles can occur before a callback
 *       is triggered. This ensures that callbacks are executed periodically even if the buffer size condition
 *       is not met.
 *
 *
 * Example Usage:
 * ```typescript
 * const timeline = new TimelineController({
 *   buffer: { eventsThreshold: 200, cyclesThreshold: 10 },
 * });
 *
 * // Adding an event
 * timeline.markEvent({
 *   type: 'element:changed',
 *   startTime: performance.now(),
 *   data: { wrapperSectionName: 'section', elementName: 'button', rect: new DOMRect(), source: 'mutation' },
 * });
 *
 * // Registering a buffer flush callback
 * timeline.onIdleBufferFlush(({ idleAt, timelineBuffer }) => {
 *   console.log(`Idle at: ${idleAt}`);
 *   console.log('Events since last idle:', timelineBuffer.getEvents());
 * });
 *
 * // Serializing the timeline
 * const serializedTimeline = timeline.serialise();
 * console.log(serializedTimeline);
 * ```
 */

export class TimelineController
	implements Timeline, TimelineSerializable, TimelineClock, Cleanable
{
	unorderedEvents: UnorderedEvents;
	eventsPerType: EventsPerTypeMap;
	onIdleBufferFlushCallbacks: Set<OnIdleBufferFlushCallback>;
	idleCycleCount: number = 0;
	lastIdleTime: IdleTimeEvent | null = null;
	lastIdleTask: AbortableTask<void> | null = null;
	options: TimelineOptions;
	idleBuffer: TimelineIdleBuffer;

	constructor(givenOptions?: Partial<TimelineOptions>) {
		this.options = Object.assign(defaultOptions, givenOptions || {});

		this.unorderedEvents = [];
		this.idleCycleCount = 0;
		this.onIdleBufferFlushCallbacks = new Set();
		this.eventsPerType = new Map();
		this.idleBuffer = {
			unorderedEvents: [],
			eventsPerType: new Map(),
		};
	}

	attemptCleanup() {
		if (this.unorderedEvents.length <= this.options.cleanup.eventsThreshold) {
			return;
		}

		this.lastIdleTime = null;
		if (this.lastIdleTask) {
			this.lastIdleTask.abort();
		}
		this.lastIdleTask = null;
		const lastSize = this.unorderedEvents.length;
		this.eventsPerType.clear();

		this.unorderedEvents = [
			{
				type: 'timeline:clean-up',
				startTime: performance.now(),
				data: {
					previousAmountOfEvents: lastSize,
					source: 'manual',
				},
			},
		];
	}

	private addEventInternal(event: TimelineEvent) {
		this.unorderedEvents.push(event);
		this.updateEventsPerType(event);
		this.addToIdleBuffer(event);
	}

	private updateEventsPerType(event: TimelineEvent) {
		const events = this.eventsPerType.get(event.type) || [];
		// @ts-expect-error
		events.push(event);
		this.eventsPerType.set(event.type, events);
	}

	private addToIdleBuffer(event: TimelineEvent) {
		this.idleBuffer.unorderedEvents.push(event);

		const events = this.idleBuffer.eventsPerType.get(event.type) || [];
		// @ts-expect-error
		events.push(event);

		this.idleBuffer.eventsPerType.set(event.type, events);
	}

	public markEvent(event: TimelineEvent) {
		this.attemptCleanup();

		this.addEventInternal(event);

		this.scheduleNextIdle();
	}

	public getEvents(): ReadonlyArray<TimelineEvent> {
		return this.unorderedEvents.sort((a, b) => {
			if (a.startTime < b.startTime) {
				return -1;
			}

			if (a.startTime > b.startTime) {
				return 1;
			}

			return 0;
		});
	}

	public getEventsPerType<T extends TimelineEventNames>(type: T): TimelineEventsGrouped[T] {
		const r = this.eventsPerType.get(type) || [];

		return r as TimelineEventsGrouped[T];
	}

	public onIdleBufferFlush(cb: OnIdleBufferFlushCallback): TimelineIdleUnsubcribe {
		this.onIdleBufferFlushCallbacks.add(cb);

		return () => {
			this.onIdleBufferFlushCallbacks.delete(cb);
		};
	}

	private scheduleNextIdle() {
		if (this.lastIdleTask) {
			this.lastIdleTask.abort();
		}

		const startAt = performance.now();
		this.lastIdleTask = backgroundTask(() => {
			this.handleIdle(startAt);
		});
	}

	private handleIdle(startAt: DOMHighResTimeStamp) {
		const idleTimeEvent: IdleTimeEvent = {
			type: 'idle-time',
			startTime: performance.now(),
			data: {
				duration: performance.now() - startAt,
			},
		};

		this.addEventInternal(idleTimeEvent);

		if (!this.options.buffer) {
			this.doIdle(idleTimeEvent);
			return;
		}
		this.idleCycleCount++;

		const { eventsThreshold, cyclesThreshold } = this.options.buffer;

		const hasCrossedEventBufferThreshold = this.idleBuffer.unorderedEvents.length > eventsThreshold;
		const hasCrossedCycleCountThreshold = this.idleCycleCount > cyclesThreshold;

		if (hasCrossedEventBufferThreshold || hasCrossedCycleCountThreshold) {
			this.doIdle(idleTimeEvent);
		}
	}

	// Ignored via go/ees005
	// eslint-disable-next-line require-await
	private async doIdle(idleTimeEvent: IdleTimeEvent) {
		const buffer = this.idleBuffer;
		this.clearIdleBuffer();

		const idleAt = performance.now();
		this.lastIdleTime = idleTimeEvent;
		this.idleCycleCount = 0; // Reset cycle count

		for (const cb of this.onIdleBufferFlushCallbacks) {
			backgroundTask(() =>
				cb({
					idleAt,
					timelineBuffer: createTimelineFromIdleBuffer(buffer),
				}),
			);
		}
	}

	private clearIdleBuffer() {
		this.idleBuffer = {
			unorderedEvents: [],
			eventsPerType: new Map(),
		};
	}

	serialise() {
		const result: EventsGroupedSerialized = [];
		for (const [key, value] of this.eventsPerType.entries()) {
			// TODO: maybe implement a proper clone?
			const entry = [key, [...value]];

			// @ts-ignore
			result.push(entry);
		}

		return result;
	}
}

export function createTimelineFromEvents(obj: EventsGroupedSerialized): Timeline {
	const eventsPerType = new Map(obj);
	const allEvents = Array.from(eventsPerType.values()).flat();

	return {
		getEvents(): ReadonlyArray<TimelineEvent> {
			return allEvents.sort((a, b) => {
				if (a.startTime < b.startTime) {
					return -1;
				}

				if (a.startTime > b.startTime) {
					return 1;
				}

				return 0;
			});
		},
		getEventsPerType<T extends TimelineEventNames>(type: T): TimelineEventsGrouped[T] {
			const r = eventsPerType.get(type) || [];

			return r as TimelineEventsGrouped[T];
		},
	};
}

export function createTimelineFromIdleBuffer({
	unorderedEvents,
	eventsPerType,
}: TimelineIdleBuffer): Timeline {
	return {
		getEvents(): ReadonlyArray<TimelineEvent> {
			return unorderedEvents.sort((a, b) => {
				if (a.startTime < b.startTime) {
					return -1;
				}

				if (a.startTime > b.startTime) {
					return 1;
				}

				return 0;
			});
		},
		getEventsPerType<T extends TimelineEventNames>(type: T): TimelineEventsGrouped[T] {
			const r = eventsPerType.get(type) || [];

			return r as TimelineEventsGrouped[T];
		},
	};
}
