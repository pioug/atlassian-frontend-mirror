import { getActiveTrace } from './get-active-trace';
import type { TraceIdContext } from './types';
import { makeTraceHttpRequestHeaders } from './utils/make-trace-http-request-headers';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getActiveTraceHttpRequestHeaders(_url?: string): {
	'X-B3-TraceId': string;
	'X-B3-SpanId': string;
} | null {
	if (getActiveTrace() === undefined) {
		return null;
	}

	const { traceId, spanId } = getActiveTrace() as TraceIdContext;
	return makeTraceHttpRequestHeaders(traceId, spanId);
}
