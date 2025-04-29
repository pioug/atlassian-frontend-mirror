import { getActiveInteraction } from '../interaction-metrics';

let performanceEventObserver: PerformanceObserver | undefined;

export const getPerformanceObserver = (): PerformanceObserver => {
	performanceEventObserver =
		performanceEventObserver ||
		new PerformanceObserver((entries: PerformanceObserverEntryList) => {
			const list = entries.getEntries();
			for (let entry of list) {
				if (entry.name === 'click') {
					setInteractionPerformanceEvent(entry as PerformanceEventTiming);
				}
			}
		});
	return performanceEventObserver;
};

export const setInteractionPerformanceEvent = (entry: PerformanceEventTiming) => {
	const interaction = getActiveInteraction();
	if (interaction?.type === 'press') {
		// if happens there is another event interaction that has started after
		// the initial one, we don't want to replace the values if they have already been set up
		interaction.responsiveness = {
			...interaction.responsiveness,
			experimentalInputToNextPaint:
				interaction.responsiveness?.experimentalInputToNextPaint || entry.duration,
			inputDelay: interaction.responsiveness?.inputDelay || entry.processingStart - entry.startTime,
		};
		// if the entry start time is lower than the one in the interaction
		// it means the interaction start time is not accurate, we assign
		// this value which will match the timestamp in the event
		interaction.start = Math.min(interaction.start, entry.startTime);
	}
};
