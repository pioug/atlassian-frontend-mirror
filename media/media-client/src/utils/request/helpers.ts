import { type Auth, isClientBasedAuth } from '@atlaskit/media-core';
import { type MediaTraceContext } from '@atlaskit/media-common';
import { mapAuthToQueryParameters } from '../../models/auth-query-parameters';
import { RequestError, isRequestError } from './errors';

import {
	type CreateUrlOptions,
	type RequestErrorReason,
	type RequestErrorMetadata,
	type RequestHeaders,
	type RequestMetadata,
	type RetryOptions,
} from './types';

export function waitPromise(timeout: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, timeout));
}

export function isAbortedRequestError(err: any): boolean {
	return (
		(err instanceof Error && err.message === 'request_cancelled') ||
		(!!err && err.name === 'AbortError')
	);
}

// fetch throws TypeError for network errors
export function isFetchNetworkError(err: any): err is TypeError {
	return err instanceof TypeError;
}

export function isRateLimitedError(error: Error | undefined) {
	return (
		(!!error && isRequestError(error) && error.attributes.statusCode === 429) ||
		(!!error && !!error.message && error.message.includes('429'))
	);
}

export const ZipkinHeaderKeys = {
	traceId: 'x-b3-traceid',
	spanId: 'x-b3-spanid',
	parentSpanId: 'x-b3-parentspanid',
	sampled: 'x-b3-sampled',
	flags: 'x-b3-flags',
};

const mapTraceIdToRequestHeaders = (traceContext?: Required<MediaTraceContext>) => {
	return traceContext
		? {
				[ZipkinHeaderKeys.traceId]: traceContext.traceId,
				[ZipkinHeaderKeys.spanId]: traceContext.spanId,
			}
		: {};
};

export function mapAuthToRequestHeaders(auth?: Auth): RequestHeaders {
	if (!auth) {
		return {};
	}
	if (isClientBasedAuth(auth)) {
		return {
			'X-Client-Id': auth.clientId,
			Authorization: `Bearer ${auth.token}`,
		};
	}

	return {
		'X-Issuer': auth.asapIssuer,
		Authorization: `Bearer ${auth.token}`,
	};
}

export function createUrl(url: string, { params, auth }: CreateUrlOptions): string {
	const parsedUrl = new URL(url, auth?.baseUrl);
	const authParams = (auth && mapAuthToQueryParameters(auth)) || {};
	const paramsToAppend: { [key: string]: any } = {
		...params,
		...authParams,
	};
	Object.entries(paramsToAppend)
		.filter(([_, value]) => value != null)
		.forEach((pair) => {
			parsedUrl.searchParams.append(...pair);
		});
	parsedUrl.searchParams.sort();
	return parsedUrl.toString();
}

export function extendHeaders(
	headers?: RequestHeaders,
	auth?: Auth,
	traceContext?: Required<MediaTraceContext>,
): RequestHeaders | undefined {
	if (!auth && !traceContext && !headers) {
		return undefined;
	}

	return {
		...(headers ?? {}),
		...mapAuthToRequestHeaders(auth),
		...mapTraceIdToRequestHeaders(traceContext),
	};
}

export function createMapResponseToJson(
	metadata: RequestMetadata,
): (response: Response) => Promise<any> {
	return async (response: Response) => {
		try {
			return await response.json();
		} catch (err) {
			throw new RequestError(
				'serverInvalidBody',
				{
					...metadata,
					...extractMediaHeaders(response),
					statusCode: response.status,
				},
				err instanceof Error ? err : undefined,
			);
		}
	};
}

export function createMapResponseToBlob(
	metadata: RequestMetadata,
): (response: Response) => Promise<Blob> {
	return async (response: Response) => {
		try {
			return await response.blob();
		} catch (err) {
			throw new RequestError(
				'serverInvalidBody',
				{
					...metadata,
					...extractMediaHeaders(response),
					statusCode: response.status,
				},
				err instanceof Error ? err : undefined,
			);
		}
	};
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
	startTimeoutInMs: 1000, // 1 second is generally a good timeout to start
	maxAttempts: 5, // Current test delay is 60s, so retries should finish before if a promise takes < 1s
	factor: 2, // Good for polling, which is out main use case
};

export function cloneRequestError(
	error: RequestError,
	extraMetadata: Partial<RequestErrorMetadata>,
): RequestError {
	const { reason, metadata, innerError } = error;

	return new RequestError(
		reason,
		{
			...metadata,
			...extraMetadata,
		},
		innerError,
	);
}

export async function fetchRetry(
	functionToRetry: () => Promise<Response>,
	metadata: RequestMetadata,
	overwriteOptions: Partial<RetryOptions> = {},
): Promise<Response> {
	const options = {
		...DEFAULT_RETRY_OPTIONS,
		...overwriteOptions,
	};
	const { startTimeoutInMs, maxAttempts, factor } = options;

	let attempts = 0;
	let timeoutInMs = startTimeoutInMs;
	let lastError: any;

	const waitAndBumpTimeout = async () => {
		await waitPromise(timeoutInMs);
		timeoutInMs *= factor;
		attempts += 1;
	};

	while (attempts < maxAttempts) {
		try {
			return await functionToRetry();
		} catch (err: any) {
			lastError = err;

			// don't retry if request was aborted by user
			if (isAbortedRequestError(err)) {
				throw new RequestError('clientAbortedRequest', metadata, err);
			}

			if (
				(!isFetchNetworkError(err) && !isRequestError(err)) ||
				(isRequestError(err) &&
					(!err.metadata || !err.metadata.statusCode || err.metadata.statusCode < 500))
			) {
				throw err;
			}

			await waitAndBumpTimeout();
		}
	}

	if (isRequestError(lastError)) {
		throw cloneRequestError(lastError, {
			attempts,
			clientExhaustedRetries: true,
		});
	}

	throw new RequestError(
		'serverUnexpectedError',
		{
			...metadata,
			attempts,
			clientExhaustedRetries: true,
		},
		lastError,
	);
}

export function createRequestErrorReason(statusCode: number): RequestErrorReason {
	switch (statusCode) {
		case 400:
			return 'serverBadRequest';
		case 401:
			return 'serverUnauthorized';
		case 403:
			return 'serverForbidden';
		case 404:
			return 'serverNotFound';
		case 429:
			return 'serverRateLimited';
		case 500:
			return 'serverInternalError';
		case 502:
			return 'serverBadGateway';
		default:
			return 'serverUnexpectedError';
	}
}

export function createRequestErrorFromResponse(
	metadata: RequestErrorMetadata,
	response: Response,
): RequestError {
	const { status: statusCode } = response;
	const reason = createRequestErrorReason(statusCode);
	return new RequestError(reason, {
		...metadata,
		...extractMediaHeaders(response),
		statusCode,
	});
}

export function createProcessFetchResponse(
	metadata: RequestMetadata,
): (response: Response) => Response {
	return (response: Response) => {
		if (response.ok || response.status < 400) {
			return response;
		}

		const requestError = createRequestErrorFromResponse(metadata, response);
		throw requestError;
	};
}

export function extractMediaHeaders(response: Response) {
	const { headers } = response;
	const mediaRegion = headers.get('x-media-region') || 'unknown';
	const mediaEnv = headers.get('x-media-env') || 'unknown';

	return { mediaRegion, mediaEnv };
}
