// Compatibility entry point. Keep all legacy bindings identical to the direct modules.
/**
 * @deprecated Compatibility export. Internal tests should import from
 * './ssr-render-profiler/clear-state' instead.
 */
export { clearState } from './ssr-render-profiler/clear-state';
/**
 * @deprecated Import from '@atlaskit/react-ufo/flush-ssr-render-profiler-traces' instead.
 */
export { flushSsrRenderProfilerTraces } from './ssr-render-profiler/flush-traces';
/**
 * @deprecated Compatibility export. Internal consumers should import from
 * './ssr-render-profiler/ssr-render-profiler' instead.
 */
export { default } from './ssr-render-profiler/ssr-render-profiler';
/**
 * @deprecated Compatibility export. Internal consumers should import from
 * './ssr-render-profiler/ssr-render-profiler-inner' instead.
 */
export { SsrRenderProfilerInner } from './ssr-render-profiler/ssr-render-profiler-inner';
export type {
	GlobalThis,
	SnapVmInternals,
	Span,
	TesseractTelemetryAPI,
} from './ssr-render-profiler/types';
