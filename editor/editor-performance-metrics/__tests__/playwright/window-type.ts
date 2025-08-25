import type { EditorPerformanceObserver } from '@atlaskit/editor-performance-metrics';
import type { TTVCTargets } from '@atlaskit/editor-performance-metrics/react';
import type {
	Timeline,
	TimelineClock,
	TimelineSerializable,
} from '@atlaskit/editor-performance-metrics/src/internals/timelineInterfaces';

export type WindowWithEditorPerformanceGlobals = Window &
	typeof globalThis & {
		// Some tests are importing the ReactAPI and setting the calculated TTVC
		// Based on the API return
		__editor_metrics_tests__calculated_ttvc?: TTVCTargets;
		__editor_metrics_tests_tick?: (direct?: boolean) => void;
		__editor_metrics_tests_ticks?: Array<DOMHighResTimeStamp>;
		__editor_performance_metrics_observer?: EditorPerformanceObserver;
		__editor_performance_metrics_timeline?: Timeline & TimelineClock & TimelineSerializable;
		// Best way to found out when a DOM was "rendered"
		// We are adding a Mutation Observer inside the `./fixtures.ts`
		// using the `page.addInitScript`.
		// The observer is grouping the nodes based on the `data-testid` only
		__sectionAddedAt: Map<string, DOMHighResTimeStamp>;
	};
