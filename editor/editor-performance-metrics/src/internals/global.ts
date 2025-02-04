import {
	EditorPerformanceObserver,
	type EditorPerformanceObserverOptions,
} from './editorPerformanceObserver';
import { TimelineController } from './timeline';
import type { Timeline } from './timelineInterfaces';

interface WindowWithEditorPerformance extends Window {
	__editor_performance_metrics_observer?: EditorPerformanceObserver;
	__editor_performance_metrics_timeline?: Timeline;
}

export const getGlobalEditorMetricsObserver = (
	options?: Partial<EditorPerformanceObserverOptions>,
) => {
	let observer = (globalThis as unknown as WindowWithEditorPerformance)
		.__editor_performance_metrics_observer;

	if (observer) {
		return observer;
	}

	const timeline = new TimelineController();

	observer = new EditorPerformanceObserver(timeline, options);

	(globalThis as unknown as WindowWithEditorPerformance).__editor_performance_metrics_timeline =
		timeline;

	(globalThis as unknown as WindowWithEditorPerformance).__editor_performance_metrics_observer =
		observer;

	return observer;
};
