import { getActiveTraceHttpRequestHeaders } from './get-active-trace-http-request-headers';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getActiveTraceAsQueryParams(_url?: string): string | null {
	const traceHeaders = getActiveTraceHttpRequestHeaders();
	return traceHeaders ? new URLSearchParams(traceHeaders).toString().toLowerCase() : null;
}
