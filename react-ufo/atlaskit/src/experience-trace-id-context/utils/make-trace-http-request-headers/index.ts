export function makeTraceHttpRequestHeaders(
	traceId: string,
	spanId: string,
): {
	'X-B3-TraceId': string;
	'X-B3-SpanId': string;
} {
	return {
		'X-B3-TraceId': traceId,
		'X-B3-SpanId': spanId,
	};
}
