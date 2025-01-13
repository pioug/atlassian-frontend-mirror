import type { EditorPerformanceObserver } from '@atlaskit/editor-performance-metrics';
import type {
	Timeline,
	TimelineClock,
	TimelineSerializable,
} from '@atlaskit/editor-performance-metrics/src/internals/timeline';

export interface WindowWithEditorPerformanceGlobals extends Window {
	__editor_performance_metrics_observer?: EditorPerformanceObserver;
	__editor_performance_metrics_timeline?: Timeline & TimelineClock & TimelineSerializable;
	__editor_metrics_tests_ticks?: Array<DOMHighResTimeStamp>;
	__editor_metrics_tests_tick?: (direct?: boolean) => void;
}
