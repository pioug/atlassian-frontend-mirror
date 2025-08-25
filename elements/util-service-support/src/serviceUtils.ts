import { getActiveTraceHttpRequestHeaders } from '@atlaskit/react-ufo/experience-trace-id-context';
import { fg } from '@atlaskit/platform-feature-flags';
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';

import { buildCredentials, type RequestServiceOptions, type ServiceConfig } from './types';
import { defaultRequestServiceOptions, buildUrl, buildHeaders } from './shared';

/**
 * @returns Promise containing the json response
 */
export const requestService = <T>(
	serviceConfig: ServiceConfig,
	options?: RequestServiceOptions,
): Promise<T> => {
	const { url, securityProvider, refreshedSecurityProvider } = serviceConfig;
	const { path, queryParams, requestInit } = options || defaultRequestServiceOptions;
	const secOptions = securityProvider && securityProvider();
	const requestUrl = buildUrl(url, path, queryParams, secOptions);
	const headers = buildHeaders(secOptions, requestInit && requestInit.headers);
	const credentials = buildCredentials(secOptions);
	const ignoreResponsePayload = options?.ignoreResponsePayload || false;

	// Get tracing headers from UFO
	const TRACING_HEADER_FOR_SERVICE_UTIL = 'platform_collab_provider_tracingheaders';
	const tracingHeaderEnabled = fg('platform_collab_provider_tracingheaders');
	addFeatureFlagAccessed(TRACING_HEADER_FOR_SERVICE_UTIL, tracingHeaderEnabled);
	let tracingHeaders: {
		'X-B3-SpanId'?: string;
		'X-B3-TraceId'?: string;
	} | null = {};
	if (tracingHeaderEnabled) {
		tracingHeaders = getActiveTraceHttpRequestHeaders(url);
	}

	const requestOptions: RequestInit = {
		...requestInit,
		// populate headers mainly for the collab provider however
		// other components which uses this util can get the header as well.
		// Those tracing headers shall not incur any issues as long as backends handle them properly
		headers: { ...headers, ...tracingHeaders },
		credentials,
	};

	return fetch(requestUrl, requestOptions).then((response: Response) => {
		if (response.status === 204) {
			return Promise.resolve();
		} else if (response.ok) {
			return ignoreResponsePayload ? Promise.resolve() : response.json();
		} else if (response.status === 401 && refreshedSecurityProvider) {
			// auth issue - try once
			return refreshedSecurityProvider().then((newSecOptions) => {
				const retryServiceConfig = {
					url,
					securityProvider: () => newSecOptions,
				};
				return requestService(retryServiceConfig, options);
			});
		}
		return Promise.reject({
			code: response.status,
			reason: response.statusText,
		});
	});
};
