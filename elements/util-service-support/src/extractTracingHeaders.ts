const TRACING_RESPONSE_HEADERS = ['x-trace-id', 'atl-request-id'];

/**
 * Extracts tracing headers (x-trace-id, atl-request-id) from a Response object.
 * Returns only headers that are present in the response.
 */
export const extractTracingHeaders = (response: Response): Record<string, string> => {
	const headers: Record<string, string> = {};
	for (const name of TRACING_RESPONSE_HEADERS) {
		const value = response.headers.get(name);
		if (value) {
			headers[name] = value;
		}
	}
	return headers;
};
