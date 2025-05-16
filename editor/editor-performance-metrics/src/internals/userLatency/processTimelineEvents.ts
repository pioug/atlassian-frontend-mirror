import type {
	PerformanceLongAnimationFrameEvent,
	TimelineEvent,
	UserEvent,
} from '../timelineTypes';

// TODO: PGXT-7952 - develop user latency event interface more and consider moving this defintion https://product-fabric.atlassian.net/browse/PGXT-7952
interface UserLatencyEvent {
	name: string;
	category: string;
	attribution: {
		selector: string;
	};
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

// Tries matching each input event with the correlated LoAF event.
export const processTimelineEvents = (events: Readonly<TimelineEvent[]>): UserLatencyEvent[] => {
	const userLatencyEvents: UserLatencyEvent[] = [];
	const matchedEvents = new Map<PerformanceLongAnimationFrameEvent, UserEvent>();

	const { inputEvents, performanceLongAnimationFrameEvents } = organizeTimelineEvents(events);

	/* For each user event, try to find a matching performance event
	 *
	 * TODO PGXT-8038 - `Pointer` and potentially `Keyboard` events, already calculate the correct duration because of Webvitals.
	 * As result, this process adds the LoAF duration a 2nd time so the overall duration is incorrect.
	 * Figure out if Webvitals is something that can be and will be "turned off" or will we need to exclude these events matching.
	 *  https://product-fabric.atlassian.net/browse/PGXT-8038
	 */
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
						if (script.invokerType !== 'event-listener') {
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

		// We can have multiple input events within frame of a loaf event. This can lead to multiple matches for the same loaf event.
		// This is not ideal because only the first input event within frame is the actual trigger for the loaf event. We do this by comparing
		// `processingStartTimes` and only accept the first earliest starting input event within frame as a the match for the loaf event.
		if (matchingLongAnimationFrameEvent) {
			const previousMatchingInputEventStartTime = matchedEvents.get(matchingLongAnimationFrameEvent)
				?.data?.entry?.processingStart;
			const currentMatchingInputEventStartTime = inputEvent.data?.entry?.processingStart;

			if (
				previousMatchingInputEventStartTime &&
				currentMatchingInputEventStartTime &&
				currentMatchingInputEventStartTime > previousMatchingInputEventStartTime
			) {
				return;
			}

			matchedEvents.set(matchingLongAnimationFrameEvent, inputEvent);
			userLatencyEvents.push({
				name: inputEvent.data.eventName,
				category: inputEvent.data.category,
				attribution: {
					selector: inputEvent.data.elementName,
				},
				firstInteraction: {
					duration: inputEvent.data.duration + matchingLongAnimationFrameEvent.data.entry.duration,
				},
			});
		}
	});

	return userLatencyEvents;
};
