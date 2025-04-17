// Adapted from https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/onINP.ts

import { bindReporter } from './bindReporter';
import { InteractionManager } from './interactions';
import { onHidden } from './onHidden';
import { whenIdle } from './whenIdle';

export type Metric = { value: number; delta: number; entries: PerformanceEntry[] };
export type CleanupOnINP = () => void;
type OnINP = (result: Metric) => void;

export const onINP = (callback: OnINP): CleanupOnINP => {
	const metric: Metric = { value: 0, delta: 0, entries: [] };
	const reporter = bindReporter(callback);
	const interactionManager = new InteractionManager();
	const handleEntries = (entries: PerformanceEventTiming[]) => {
		whenIdle(() => {
			entries.forEach((entry) => interactionManager.processInteractionEntry(entry));

			const inp = interactionManager.estimateP98LongestInteraction();
			if (inp && inp.latency !== metric.value) {
				metric.value = inp.latency;
				metric.entries = entries;
				reporter(metric);
			}
		});
	};

	const po = observeInteractionEvent(handleEntries);
	const onHiddenCleanup = onHidden(() => {
		handleEntries(po.takeRecords() as PerformanceEventTiming[]);
		reporter(metric);
	});
	return () => {
		po.disconnect();
		interactionManager.cleanup();
		onHiddenCleanup();
	};
};

const observeInteractionEvent = (
	callback: (entries: PerformanceEventTiming[]) => void,
): PerformanceObserver => {
	const po = new PerformanceObserver((list) => {
		// Delay by a microtask to workaround a bug in Safari where the
		// callback is invoked immediately, rather than in a separate task.
		// See: https://github.com/GoogleChrome/web-vitals/issues/277
		Promise.resolve().then(() => {
			callback(list.getEntries() as PerformanceEventTiming[]);
		});
	});

	// Event Timing entries have their durations rounded to the nearest 8ms,
	// so a duration of 40ms would be any event that spans 2.5 or more frames
	// at 60Hz. This threshold is chosen to strike a balance between usefulness
	// and performance. Running this callback for any interaction that spans
	// just one or two frames is likely not worth the insight that could be
	// gained.
	if (PerformanceObserver.supportedEntryTypes.includes('event')) {
		po.observe({ type: 'event', buffered: true, durationThreshold: 40 } as PerformanceObserverInit);
	}
	if (PerformanceObserver.supportedEntryTypes.includes('first-input')) {
		po.observe({ type: 'first-input', buffered: true } as PerformanceObserverInit);
	}

	return po;
};
