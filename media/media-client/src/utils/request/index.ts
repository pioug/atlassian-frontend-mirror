import { type RequestMetadata, type RequestOptions } from './types';

export type { RequestErrorReason, RequestErrorMetadata, RequestErrorAttributes } from './types';

export { RequestError, isRequestError } from './errors';
export { isRateLimitedError, createRequestErrorReason } from './helpers';

import {
	createUrl,
	fetchRetry,
	createProcessFetchResponse,
	extendHeaders,
	isFetchNetworkError,
	defaultShouldRetryError,
} from './helpers';
import { fg } from '@atlaskit/platform-feature-flags';

import { mapRetryUrlToPathBasedUrl } from '../pathBasedUrl';
import getNavigator from '../getNavigator';

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

	if (fg('platform_media_retry_edge_error')) {
		const shouldRetryError = (err: any) => {
			if (isFetchNetworkError(err) && getNavigator()?.userAgent.includes('Edg/')) {
				return false;
			}
			return defaultShouldRetryError(err);
		};
		try {
			return await fetchRetry(doFetch, metadata, { ...retryOptions, shouldRetryError });
		} catch (error) {
			if (isFetchNetworkError(error) && getNavigator()?.userAgent.includes('Edg/')) {
				const doFetchWithPathBasedUrl = (): Promise<Response> =>
					fetch(createUrl(mapRetryUrlToPathBasedUrl(url).toString(), { params }), {
						method,
						body,
						headers: extendHeaders(headers, auth, traceContext),
						signal: controller && controller.signal,
					}).then(createProcessFetchResponse(metadata));
				return fetchRetry(doFetchWithPathBasedUrl, metadata, retryOptions);
			}
			throw error;
		}
	}
	return fetchRetry(doFetch, metadata, retryOptions);
}
