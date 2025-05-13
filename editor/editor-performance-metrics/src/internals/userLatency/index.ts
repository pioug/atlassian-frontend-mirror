import { TimelineController } from '../timeline';

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
		cleanup: {
			// TODO: PGXT-7918 - Remove threshold. Set threshold to 10 events for debugging purposes
			// https://product-fabric.atlassian.net/browse/PGXT-7918
			eventsThreshold: 10,
		},
	});

	(
		globalThis as unknown as WindowWithEditorPerformance
	).__editor_performance_user_latency_timeline = timeline;

	return timeline;
};

/* TODO: PGXT-7952 - develop user latency event interface and update callback accordingly
   https://product-fabric.atlassian.net/browse/PGXT-7952 */
export const onUserLatency = (_callback: () => void) => {
	const timeline = getGlobalUserLatencyTimeline();
	const observers = new UserLatencyObservers(timeline);

	observers.observe();

	// TODO: PGXT-7918 - https://product-fabric.atlassian.net/browse/PGXT-7918
	timeline.onNextIdle(({}) => {});
};
