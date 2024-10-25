export const makeTraceHttpRequestHeaders = (traceId: string, spanId: string) => ({
	'X-B3-TraceId': traceId,
	'X-B3-SpanId': spanId,
});
