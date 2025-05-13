import type {
	PerformanceLongAnimationFrameEvent,
	TimelineEvent,
	UserEvent,
} from '../timelineTypes';

// TODO: PGXT-7952 - develop user latency event interface more and consider moving this defintion https://product-fabric.atlassian.net/browse/PGXT-7952
interface UserLatencyEvent {
	name: string;
	category: string;
	firstInteraction: {
		duration: number;
	};
}

type TimelineEventsMap = {
	inputEvents: UserEvent[];
	performanceLongAnimationFrameEvents: PerformanceLongAnimationFrameEvent[];
};
const organizeTimelineEvents = (events: Readonly<TimelineEvent[]>): TimelineEventsMap =>
	events.reduce(
		(acc: TimelineEventsMap, event: TimelineEvent) => {
			// TODO: PGXT-7915 - think about a better condition to organize events
			if (event.type.startsWith('user-event:')) {
				acc.inputEvents.push(event as UserEvent);
			} else if (event.type === 'performance:long-animation-frame') {
				acc.performanceLongAnimationFrameEvents.push(event as PerformanceLongAnimationFrameEvent);
			}
			return acc;
		},
		{
			inputEvents: [],
			performanceLongAnimationFrameEvents: [],
		},
	) as TimelineEventsMap;

// Tries matching each input event with the loaf event with a script whose `startTime` matches the input event's processingStart time
export const processTimelineEvents = (events: Readonly<TimelineEvent[]>): UserLatencyEvent[] => {
	const matches: UserLatencyEvent[] = [];

	const { inputEvents, performanceLongAnimationFrameEvents } = organizeTimelineEvents(events);

	// For each user event, try to find a matching performance event
	inputEvents.forEach((inputEvent: UserEvent) => {
		const inputEventEntry = inputEvent.data.entry;

		if (!inputEventEntry?.processingStart) {
			return;
		}

		/**
		 * With this current implementation, we can have multiple input events matched to the same loaf event. This is not correct because
		 * only the first input event within frameis the actual trigger for the loaf event.
		 *
		 * TODO: PGXT-8016 - fix this issue
		 * https://product-fabric.atlassian.net/browse/PGXT-8016
		 */
		// Find a performance event where any script's start time matches the user event's processing start
		const matchingLongAnimationFrameEvent: PerformanceLongAnimationFrameEvent | null =
			performanceLongAnimationFrameEvents.find((frameEvent: PerformanceLongAnimationFrameEvent) => {
				const frameEntry = frameEvent.data.entry;
				const frameEndTime = frameEntry.startTime + frameEntry.duration;
				/*
				 * TODO: PGXT-7953 - use type `PerformanceLongAnimationFrameTiming` https://product-fabric.atlassian.net/browse/PGXT-7953
				 *
				 * Currently using generic type `PerformanceEntry` to avoid type errors with using `entry.scripts` (not recongized).
				 * As a result of not being recognized, `entry.scripts` is causing an error since only `PerformanceLongAnimationFrameTiming` has `scripts` property.
				 *
				 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongAnimationFrameTiming
				 */
				// @ts-expect-error
				return frameEvent.data.entry.scripts.some(
					(script: { startTime: number; invokerType: string }) => {
						if (!(script.invokerType === 'event-listener')) {
							return false;
						}

						if (inputEventEntry.processingStart === script.startTime) {
							return true;
						}

						const isInputEventWithinFrame =
							inputEventEntry.processingStart > frameEntry.startTime &&
							inputEventEntry.processingEnd < frameEndTime;

						return isInputEventWithinFrame;
					},
				);
			}) || null;

		if (matchingLongAnimationFrameEvent) {
			matches.push({
				name: inputEvent.data.eventName,
				category: inputEvent.data.category,
				firstInteraction: {
					duration: inputEvent.data.duration + matchingLongAnimationFrameEvent.data.entry.duration,
				},
			});
		}
	});

	return matches;
};
