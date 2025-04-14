import { withProfiling } from '../../../self-measurements';

export const makeTraceHttpRequestHeaders = withProfiling(function makeTraceHttpRequestHeaders(
	traceId: string,
	spanId: string,
) {
	return {
		'X-B3-TraceId': traceId,
		'X-B3-SpanId': spanId,
	};
});
