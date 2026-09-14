import type { InteractionMetrics } from '../common';

export function getTracingContextData(interaction: InteractionMetrics): any {
	const { trace, start } = interaction;
	let tracingContextData = {};

	if (trace) {
		tracingContextData = {
			'ufo:tracingContext': {
				'X-B3-TraceId': trace.traceId,
				'X-B3-SpanId': trace.spanId,
				// eslint-disable-next-line compat/compat
				browserTimeOrigin: +(performance.timeOrigin + start).toFixed(2),
			},
		};
	}

	return tracingContextData;
}
