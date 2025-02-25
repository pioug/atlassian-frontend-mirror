import { type AbortableTask, backgroundTask } from './backgroundTasks';
import type {
	Cleanable,
	Timeline,
	TimelineClock,
	TimelineHoldable,
	TimelineIdleUnsubcribe,
	TimelineSerializable,
	UnHoldFunction,
	OnIdleBufferFlushCallback,
} from './timelineInterfaces';
import type {
	BasicEventTimestamp,
	EventsGroupedSerialized,
	ExtractEventTypes,
	HoldIdleEventSources,
	IdleTimeEvent,
	TimelineEvent,
	TimelineEventNames,
	TimelineEventsGrouped,
	TimelineOptions,
} from './timelineTypes';

const defaultOptions: TimelineOptions = {
	cleanup: {
		eventsThreshold: 3000,
	},
	buffer: {
		eventsThreshold: 200,
		cyclesThreshold: 5,
	},
	maxHoldDuration: 5000, // five seconds
};

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

function getRandomId(): string {
	if (!globalThis.crypto || typeof globalThis.crypto.randomUUID !== 'function') {
		// Not the best fallback, but the crypto.randomUUID is widely available
		return (Math.random() + 1).toString(36).substring(20);
	}

	return globalThis.crypto.randomUUID();
}

/**
 * 🧱 Internal Type: Editor FE Platform
 *
 * TimelineController
 *
 * The TimelineController class is a comprehensive system designed to track and
 * manage a series of events over time. It facilitates the recording, retrieval,
 * and cleanup of timeline events, and provides an interface for triggering
 * callbacks when idle buffer conditions are met.
 *
 * Key Functionalities:
 * - Event Management: Allows adding events, sorting them by timestamp, and retrieving them by type.
 * - Idle Detection: Automatically detects idle periods and triggers registered callbacks when conditions are met.
 * - Buffer Management: Maintains an internal buffer of events, with configurable thresholds to trigger callbacks
 *   based on buffer size or idle cycles.
 * - Serialization: Provides functionality to serialize the timeline state into a structured JSON format.
 * - Hold Mechanism: Allows pausing the idle detection for specific operations like setTimeout or fetch.
 *
 * @param {Partial<TimelineOptions>} [givenOptions] - An optional configuration object that allows customization of the timeline's behavior.
 *
 * @example
 * const timeline = new TimelineController({
 *   buffer: { eventsThreshold: 200, cyclesThreshold: 10 },
 *   maxHoldDuration: 5000
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
 * // Using the hold mechanism
 * const unhold = timeline.hold({ source: 'setTimeout' });
 * // ... perform some operation ...
 * unhold();
 *
 * // Serializing the timeline
 * const serializedTimeline = timeline.serialise();
 * console.log(serializedTimeline);
 */
export class TimelineController
	implements Timeline, TimelineSerializable, TimelineClock, Cleanable, TimelineHoldable
{
	unorderedEvents: UnorderedEvents;
	eventsPerType: EventsPerTypeMap;
	onIdleBufferFlushCallbacks: Set<OnIdleBufferFlushCallback>;
	onNextIdleCallbacks: Set<OnIdleBufferFlushCallback>;
	idleCycleCount: number = 0;
	lastIdleTime: IdleTimeEvent | null = null;
	lastIdleTask: AbortableTask<void> | null = null;
	options: TimelineOptions;
	idleBuffer: TimelineIdleBuffer;
	private allSubscribersCleanedCallback: (() => void) | null = null;
	private holdStartTimes: Map<string, DOMHighResTimeStamp>;

	constructor(givenOptions?: Partial<TimelineOptions>) {
		this.holdStartTimes = new Map();
		this.options = Object.assign(defaultOptions, givenOptions || {});

		this.unorderedEvents = [];
		this.idleCycleCount = 0;
		this.onIdleBufferFlushCallbacks = new Set();
		this.onNextIdleCallbacks = new Set();
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

	hold({ source }: { source: HoldIdleEventSources }): UnHoldFunction {
		const startTime = performance.now();
		const holdId = getRandomId();
		this.holdStartTimes.set(holdId, startTime);

		this.markEvent({
			startTime,
			type: 'hold-idle:start',
			data: {
				source,
				uuid: holdId,
			},
		});

		return () => {
			this.holdStartTimes.delete(holdId);
			const holdEndTime = performance.now();

			this.markEvent({
				startTime: holdEndTime,
				type: 'hold-idle:end',
				data: {
					source,
					duration: holdEndTime - startTime,
					uuid: holdId,
				},
			});

			if (this.holdStartTimes.size === 0) {
				this.scheduleNextIdle();
			}
		};
	}

	public cleanupSubscribers() {
		this.flushIdleBuffer(this.idleBuffer);

		this.onIdleBufferFlushCallbacks.clear();
		this.onNextIdleCallbacks.clear();

		this.checkAllSubscribersCleared();
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
			this.checkAllSubscribersCleared();
		};
	}

	public onNextIdle(cb: OnIdleBufferFlushCallback): TimelineIdleUnsubcribe {
		this.onNextIdleCallbacks.add(cb);

		return () => {
			this.onNextIdleCallbacks.delete(cb);
			this.checkAllSubscribersCleared();
		};
	}

	public onceAllSubscribersCleaned(callback: () => void): void {
		this.allSubscribersCleanedCallback = callback;
	}

	private checkAllSubscribersCleared(): void {
		if (
			this.onIdleBufferFlushCallbacks.size === 0 &&
			this.onNextIdleCallbacks.size === 0 &&
			this.allSubscribersCleanedCallback
		) {
			this.allSubscribersCleanedCallback();
		}
	}

	private checkHoldTimeout() {
		if (this.holdStartTimes.size === 0) {
			return;
		}

		const currentTime = performance.now();
		const iterator = this.holdStartTimes.entries();

		let [holdId, holdStartTime] = iterator.next().value;
		while (typeof holdStartTime === 'number') {
			const lastHoldDelta = currentTime - holdStartTime;

			if (lastHoldDelta < this.options.maxHoldDuration) {
				return;
			}

			this.addEventInternal({
				type: 'hold-idle:timeout',
				startTime: currentTime,
				data: {
					holdedAt: holdStartTime,
					uuid: holdId,
				},
			});

			this.holdStartTimes.delete(holdId);
			[holdId, holdStartTime] = iterator.next().value || [];
		}
	}

	private scheduleNextIdle() {
		this.checkHoldTimeout();

		if (this.holdStartTimes.size > 0) {
			return;
		}

		if (this.lastIdleTask) {
			this.lastIdleTask.abort();
		}

		const startAt = performance.now();
		const handleIdleBinded = this.handleIdle.bind(this, startAt);

		this.lastIdleTask = backgroundTask(handleIdleBinded, {
			// For Timeline idles, we required at least 200ms of non-busy thread
			delay: 200,
		});
	}

	private handleIdle(startAt: DOMHighResTimeStamp) {
		if (this.holdStartTimes.size > 0) {
			return;
		}
		const idleTimeEvent: IdleTimeEvent = {
			type: 'idle-time',
			startTime: performance.now(),
			data: {
				duration: performance.now() - startAt,
			},
		};

		this.addEventInternal(idleTimeEvent);
		this.idleCycleCount++;
		this.lastIdleTime = idleTimeEvent;

		const buffer = this.idleBuffer;
		this.attemptFlushIdleBuffer(buffer);
		this.callOnNextIdleCallbacks(buffer);
	}

	private callOnNextIdleCallbacks(buffer: TimelineIdleBuffer) {
		const idleAt = performance.now();
		const timelineBuffer = createTimelineFromIdleBuffer(buffer);

		for (const cb of this.onNextIdleCallbacks) {
			backgroundTask(() =>
				cb({
					idleAt,
					timelineBuffer,
				}),
			);
		}

		this.onNextIdleCallbacks.clear();
	}

	private attemptFlushIdleBuffer(buffer: TimelineIdleBuffer) {
		if (!this.options.buffer) {
			this.flushIdleBuffer(buffer);
			return;
		}

		const { eventsThreshold, cyclesThreshold } = this.options.buffer;

		const hasCrossedEventBufferThreshold = this.idleBuffer.unorderedEvents.length > eventsThreshold;
		const hasCrossedCycleCountThreshold = this.idleCycleCount > cyclesThreshold;

		if (hasCrossedEventBufferThreshold || hasCrossedCycleCountThreshold) {
			this.flushIdleBuffer(buffer);
		}
	}

	private flushIdleBuffer(buffer: TimelineIdleBuffer) {
		this.clearIdleBuffer();

		const idleAt = performance.now();
		this.idleCycleCount = 0; // Reset cycle count

		const timelineBuffer = createTimelineFromIdleBuffer(buffer);

		for (const cb of this.onIdleBufferFlushCallbacks) {
			backgroundTask(() =>
				cb({
					idleAt,
					timelineBuffer,
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
	const shallowUnorderedEventsCopy = [...unorderedEvents];
	const copyEventsPerType = new Map(eventsPerType);

	return {
		getEvents(): ReadonlyArray<TimelineEvent> {
			return shallowUnorderedEventsCopy.sort((a, b) => {
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
			const r = copyEventsPerType.get(type) || [];

			return r as TimelineEventsGrouped[T];
		},
	};
}
