import { type RequestMetadata, type RequestOptions } from './types';

export type { RequestErrorReason, RequestErrorMetadata, RequestErrorAttributes } from './types';

export { RequestError, isRequestError } from './errors';
export { isRateLimitedError, createRequestErrorReason } from './helpers';

import { createUrl, fetchRetry, createProcessFetchResponse, extendHeaders } from './helpers';

export async function request(
	url: string,
	options: RequestOptions = {},
	controller?: AbortController,
): Promise<Response> {
	const {
		method = 'GET',
		endpoint,
		auth,
		params,
		headers,
		body,
		clientOptions = {},
		traceContext,
	} = options;
	const { retryOptions } = clientOptions;
	const metadata: RequestMetadata = { method, endpoint, traceContext };

	// TODO BMPT-918: add client timeout feature behing a FF (using clientOptions.clientTimeout + Promise.race)
	const doFetch = (): Promise<Response> =>
		fetch(createUrl(url, { params }), {
			method,
			body,
			headers: extendHeaders(headers, auth, traceContext),
			signal: controller && controller.signal,
		}).then(createProcessFetchResponse(metadata));

	return fetchRetry(doFetch, metadata, retryOptions);
}
