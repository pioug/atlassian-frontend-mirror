import { getActiveTraceHttpRequestHeaders } from '@atlaskit/react-ufo/experience-trace-id-context';
import { fg } from '@atlaskit/platform-feature-flags';
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';
import {
	buildCredentials,
	type KeyValues,
	type RequestServiceOptions,
	type SecurityOptions,
	type ServiceConfig,
} from './types';

const defaultRequestServiceOptions: RequestServiceOptions = {};

const buildUrl = (
	baseUrl: string,
	path: string = '',
	queryParams?: KeyValues,
	secOptions?: SecurityOptions,
): string => {
	const searchParam = new URLSearchParams(
		// For relative urls, the URL class requires base to be set. It's ignored if a url is not relative.
		// Since we only care about search params it is fine to have any base url here.
		new URL(baseUrl, 'https://BASE_FALLBACK').search || undefined,
	);
	baseUrl = baseUrl.split('?')[0];
	if (queryParams) {
		for (const key in queryParams) {
			if ({}.hasOwnProperty.call(queryParams, key)) {
				searchParam.append(key, queryParams[key]);
			}
		}
	}
	if (secOptions && secOptions.params) {
		for (const key in secOptions.params) {
			if ({}.hasOwnProperty.call(secOptions.params, key)) {
				const values = secOptions.params[key];
				if (Array.isArray(values)) {
					for (let i = 0; i < values.length; i++) {
						searchParam.append(key, values[i]);
					}
				} else {
					searchParam.append(key, values);
				}
			}
		}
	}
	let separator = '';
	if (path && baseUrl.substr(-1) !== '/' && !path.startsWith('/')) {
		separator = '/';
	}
	let params = searchParam.toString();
	if (params) {
		params = '?' + params;
	}

	return `${baseUrl}${separator}${path}${params}`;
};

const addToHeaders = (headers: KeyValues, keyValues?: KeyValues) => {
	if (keyValues) {
		for (const key in keyValues) {
			if ({}.hasOwnProperty.call(keyValues, key)) {
				const values = keyValues[key];
				if (Array.isArray(values)) {
					for (let i = 0; i < values.length; i++) {
						headers[key] = values[i];
					}
				} else {
					headers[key] = values;
				}
			}
		}
	}
};

const buildHeaders = (secOptions?: SecurityOptions, extraHeaders?: KeyValues): KeyValues => {
	const headers = {};
	addToHeaders(headers, extraHeaders);
	if (secOptions) {
		addToHeaders(headers, secOptions.headers);
	}
	return headers;
};

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

	//Get tracing headers from UFO
	const TRACING_HEADER_FOR_SERVICE_UTIL = 'platform_collab_provider_tracingheaders';
	const tracingHeaderEnabled = fg('platform_collab_provider_tracingheaders');
	addFeatureFlagAccessed(TRACING_HEADER_FOR_SERVICE_UTIL, tracingHeaderEnabled);
	let tracingHeaders: {
		'X-B3-TraceId'?: string;
		'X-B3-SpanId'?: string;
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
