import { meros } from 'meros/browser';
import { buildCredentials, type RequestServiceOptions, type ServiceConfig } from './types';
import { buildHeaders, buildUrl, defaultRequestServiceOptions } from './shared';
import { fg } from '@atlaskit/platform-feature-flags';
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';
import { getActiveTraceHttpRequestHeaders } from '@atlaskit/react-ufo/experience-trace-id-context';

export type PartsGenerator<PartsType> = AsyncGenerator<Part<PartsType, unknown>>;
export type MultiPartFetchResult<PartsType> = {
	isMultipart: true;
	parts: PartsGenerator<PartsType>;
};
export type BodyResult<T> = {
	body: T;
	isMultipart: false;
};
export type RequestServiceResult<PartsType, BodyType> =
	| MultiPartFetchResult<PartsType>
	| BodyResult<BodyType>;
/** Copied from meros types, as there are difficulties with resolving the type in CI */
export type Part<Body, Fallback> =
	| { body: Fallback; headers: Record<string, string>; json: false }
	| { body: Body; headers: Record<string, string>; json: true };
type Options = Omit<RequestServiceOptions, 'ignoreResponsePayload'>;

/**
 * Make a request that **may** result in an HTTP multipart response from the server.
 * @returns an object with a parsed JSON body OR an object with the parts from
 * the HTTP multipart response.
 *
 * PartsType type parameter specifies the type of the response when the server response
 * is multipart.
 *
 * BodyType specifies the type of the response when the server response is not multipart
 */
export const requestServiceMultipart = async <PartsType, BodyType>(
	serviceConfig: ServiceConfig,
	options: Options = defaultRequestServiceOptions,
): Promise<RequestServiceResult<PartsType, BodyType>> => {
	const { url, securityProvider, refreshedSecurityProvider } = serviceConfig;
	const { path, queryParams, requestInit } = options;
	const secOptions = securityProvider && securityProvider();
	const requestUrl = buildUrl(url, path, queryParams, secOptions);
	const headers = buildHeaders(secOptions, requestInit && requestInit.headers);
	const credentials = buildCredentials(secOptions);

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

	const fetchResponse = await fetch(requestUrl, requestOptions);
	const parts = await meros(fetchResponse);

	if (fetchResponse.ok && fetchResponse.status !== 204) {
		if (((parts as PartsGenerator<PartsType>)[Symbol.asyncIterator] as any) < 'u') {
			// this lets us know that the response is multipart
			//
			// 	((parts as PartsGenerator)[Symbol.asyncIterator] as any) < 'u' came from the `meros` docs:
			//	https://github.com/maraisr/meros/blob/dec4feaa24090b94e8ac42fab1aff38a1e521680/readme.md
			// 	Look for expand section `If the content-type is NOT a multipart, then meros will resolve with the response argument.`
			return {
				isMultipart: true,
				parts: parts as PartsGenerator<PartsType>,
			} satisfies MultiPartFetchResult<PartsType>;
		}
		return { isMultipart: false, body: (await (parts as Response).json()) as BodyType };
	} else if (fetchResponse.status === 401 && refreshedSecurityProvider) {
		// auth issue - try once
		return refreshedSecurityProvider().then((newSecOptions) => {
			const retryServiceConfig = {
				url,
				securityProvider: () => newSecOptions,
			};
			return requestServiceMultipart(retryServiceConfig, options);
		});
	}
	return Promise.reject({
		code: fetchResponse.status,
		reason: fetchResponse.statusText,
	});
};
