import state from './state';

// For profiler spans in SSR, we 'end' any with their latest end times set, we need to do this at UFO-interaction-end since until then the component could rerender/remount again and spans fundamentally don't use the last 'end' but the first
export const flushSsrRenderProfilerTraces = (): void => {
	state.spanStates.forEach((spanState) => {
		if (spanState.latestEndTime != null) {
			spanState.span.end(spanState.latestEndTime);
		}
	});
	state.spanStates.clear();
};
