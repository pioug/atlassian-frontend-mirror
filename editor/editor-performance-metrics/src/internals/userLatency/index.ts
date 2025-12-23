import { TimelineController } from '../timeline';

import { processTimelineEvents } from './processTimelineEvents';
import type { UserLatencyEvent } from './processTimelineEvents';
import { UserLatencyObservers } from './UserLatencyOberservers';

interface WindowWithEditorPerformance extends Window {
	__editor_performance_user_latency_timeline?: TimelineController;
}

const getGlobalUserLatencyTimeline = (): TimelineController => {
	let timeline = (globalThis as unknown as WindowWithEditorPerformance)
		.__editor_performance_user_latency_timeline;

	if (timeline) {
		return timeline;
	}

	timeline = new TimelineController({
		shouldIdleOnPageVisibilityChange: true,
	});

	(
		globalThis as unknown as WindowWithEditorPerformance
	).__editor_performance_user_latency_timeline = timeline;

	return timeline;
};

/* TODO: PGXT-7952 - develop user latency event interface and update callback accordingly
   https://product-fabric.atlassian.net/browse/PGXT-7952 */
export const onUserLatency = (
	handleUserLatencyEvents: (userLatencyEvents: UserLatencyEvent[]) => void,
): void => {
	const timeline = getGlobalUserLatencyTimeline();
	const observers = new UserLatencyObservers(timeline);

	observers.observe();

	timeline.onIdleBufferFlush(() => {
		handleUserLatencyEvents(processTimelineEvents(timeline.getEvents()));
	});
};
