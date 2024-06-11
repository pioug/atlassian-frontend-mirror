// import setimmediate to temporary fix dataloader 2.0.0 bug
// @see https://github.com/graphql/dataloader/issues/249
import 'setimmediate';
import DataLoader from 'dataloader';
import { type JsonLd } from 'json-ld-types';
import retry, { type Options } from 'async-retry';
import pThrottle from 'p-throttle';
import {
	type InvokePayload,
	APIError,
	type InvocationSearchPayload,
	type EnvironmentsKeys,
	getResolverUrl,
	request,
	NetworkError,
	getStatus,
	type ProductType,
} from '@atlaskit/linking-common';
import { type CardClient as CardClientInterface } from './types';
import {
	type BatchResponse,
	type SuccessResponse,
	type ErrorResponse,
	isSuccessfulResponse,
	isErrorResponse,
	type SearchProviderInfoResponse,
} from './types/responses';
import { type InvokeRequest } from './types/requests';
import { LRUMap } from 'lru_map';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

const MAX_BATCH_SIZE = 50;
const MIN_TIME_BETWEEN_BATCHES = 250;
const URL_RESPONSE_CACHE_SIZE = 100;

// Contains cached mapping between url and a promise of a response.
// Note that promise can be either unsettled/ongoing OR successfully resolved (not an error or non-resolved)
export const urlResponsePromiseCache = new LRUMap<string, Promise<SuccessResponse | ErrorResponse>>(
	URL_RESPONSE_CACHE_SIZE,
);

export default class CardClient implements CardClientInterface {
	private resolverUrl: string;
	readonly envKey?: string;
	readonly baseUrlOverride?: string;
	private loadersByDomain: Record<string, DataLoader<string, SuccessResponse | ErrorResponse>>;
	private retryConfig: Options;
	private resolvedCache: Record<string, boolean>;
	private product?: ProductType;

	constructor(envKey?: EnvironmentsKeys, baseUrlOverride?: string) {
		this.resolverUrl = getResolverUrl(envKey, baseUrlOverride);
		this.loadersByDomain = {};
		this.retryConfig = {
			retries: 2,
		};
		this.resolvedCache = {};
		this.envKey = envKey;
		this.baseUrlOverride = baseUrlOverride;
	}

	public setProduct(product: ProductType) {
		this.product = product;
	}

	private batchResolve = async (urls: ReadonlyArray<string>): Promise<BatchResponse> => {
		// De-duplicate requested URLs (see `this.createLoader` for more detail).
		const deDuplicatedUrls = [...new Set(urls)];
		let resolvedUrls: BatchResponse = [];

		const headers = {
			/**
			 * This header exist to enable the backend to process relative time, eg: "today", with respect to the user timezone.
			 * eg: used in "confluence-object-provider" to resolve confluence SLLV links that may involve relative time calculation.
			 */
			...(getBooleanFF('platform.linking-platform.datasource.add-timezone-header')
				? { 'origin-timezone': Intl?.DateTimeFormat().resolvedOptions().timeZone }
				: {}),

			// send product source as header X-Product if defined
			...(this.product ? { 'X-Product': this.product } : {}),
		};

		try {
			// Ask the backend to resolve the URLs for us.
			resolvedUrls = await request<BatchResponse>(
				'post',
				`${this.resolverUrl}/resolve/batch`,
				deDuplicatedUrls.map((resourceUrl) => ({ resourceUrl })),
				headers,
			);
		} catch (error) {
			// we make sure we return a valid dataloader response by creating an error
			// response for each url
			resolvedUrls = urls.map(() => {
				// @ts-ignore
				const status = isErrorResponse(error) ? error.status : 500;
				const errorResponse: ErrorResponse = {
					status,
					// @ts-ignore
					error,
				};
				return errorResponse;
			});
		}

		// Reduce into a map to make accessing faster and easier.
		const map: Record<string, SuccessResponse | ErrorResponse> = {};
		// NOTE: the batch endpoint returns the URLs in the same order they were given.
		for (let i = 0; i < deDuplicatedUrls.length; ++i) {
			const url = deDuplicatedUrls[i];
			const data = resolvedUrls[i];
			map[url] = data;
		}

		// Reconvert list back into the original order in which it was given to us.
		return urls.map((originalUrl) => map[originalUrl]);
	};

	private createLoader() {
		const batchResolveThrottler = pThrottle({
			limit: 1,
			interval: MIN_TIME_BETWEEN_BATCHES,
		});
		const throttledBatchResolve = batchResolveThrottler(this.batchResolve);

		return new DataLoader(
			// We place all calls to `batchResolve` in a limiter so we don't send off several simultaneous batch requests.
			// This is for two reasons:
			//  1: we want to avoid getting rate limited upstream (eg: forge and other APIs)
			//  2: we want to avoid sending out heaps of requests from the client at once
			(urls: ReadonlyArray<string>) => throttledBatchResolve(urls),
			{
				maxBatchSize: MAX_BATCH_SIZE,
				// NOTE: we turn off DataLoader's cache because it doesn't work for our use-case. Consider the following:
				// - a smartlink to a restricted item is resolved to "forbidden" with a "request access button"
				// - the user clicks "request access", and then following the auth prompts and gets access
				// - the frontend now re-renders the smartlink, but due to DataLoader's caching, the previous "forbidden" state is
				//   because the smartlink's URL (which is the cache key) is exactly the same
				//
				// For this reason, we disable DataLoader's cache.
				// This means that URLs will not be de-duplicated by DataLoader, so we perform the de-duplication logic
				// ourselves in `this.batchResolve`.
				cache: false,
			},
		);
	}

	private getLoader(hostname: string) {
		if (!this.loadersByDomain[hostname]) {
			this.loadersByDomain[hostname] = this.createLoader();
		}

		return this.loadersByDomain[hostname];
	}

	private async resolveUrl(url: string, force: boolean = false) {
		const hostname = new URL(url).hostname;
		const loader = this.getLoader(hostname);
		let responsePromise: Promise<SuccessResponse | ErrorResponse> | undefined;

		responsePromise = urlResponsePromiseCache.get(url);
		if (!responsePromise || force) {
			responsePromise = loader.load(url);
			urlResponsePromiseCache.set(url, responsePromise);
		}

		let response: SuccessResponse | ErrorResponse;
		try {
			response = await responsePromise;
		} catch (e) {
			// Technically this never happens, since batchResolve handles errors and doesn't throw,
			// But just in case.
			urlResponsePromiseCache.delete(url);
			throw e;
		}

		const isUnresolvedLink =
			!isSuccessfulResponse(response) || getStatus(response.body) !== 'resolved';
		if (isUnresolvedLink) {
			// We want consequent calls for fetchData() to cause actual http call
			urlResponsePromiseCache.delete(url);
		}

		return response;
	}

	public async prefetchData(url: string): Promise<JsonLd.Response | undefined> {
		// 1. Queue the URL as part of a dataloader batch.
		const response = await this.resolveUrl(url, false);

		if (isSuccessfulResponse(response)) {
			// 2. If the URL resolves, send it back.
			return response.body;
		} else {
			try {
				// 3. If the URL does not resolve, retry it with exponential backoff.
				// This is done so that we avoid the scenario where users are unable to
				// see a resolved Smart Link, when their expectation is to be able to.
				const retriedResponse = await retry(async () => {
					// We check if the link has resolved in the cache and stop trying if so.
					// We do this by triggering an error that the link has already been resolved.
					// This cascades <retryCount> times after which it is handled like a normal
					// 'error', returning `undefined`.
					if (!this.resolvedCache[url]) {
						const response = await this.resolveUrl(url, false);
						if (isSuccessfulResponse(response)) {
							return response;
						} else {
							throw new Error('Retry for URL failed');
						}
					} else {
						// Short-circuit each of the retries, as described above.
						throw new Error('Retry unneeded - link has been resolved.');
					}
				}, this.retryConfig);

				// Trigger callback after successful backoff.
				return retriedResponse.body;
			} catch (err) {
				// Do nothing in the case of an error - prefetching
				// failures should be silent. Once a link is visible,
				// it will be re-fetched anyhow, in which case a
				// user-facing error is required.
				return undefined;
			}
		}
	}

	private isRateLimitError(response: ErrorResponse | SuccessResponse): response is ErrorResponse {
		return isErrorResponse(response) && response.error.status === 429;
	}

	public async fetchData(url: string, force?: boolean): Promise<JsonLd.Response> {
		let response = await this.resolveUrl(url, force);

		if (this.isRateLimitError(response)) {
			response = await retry(async () => {
				const retryResponse = await this.resolveUrl(url, false);
				if (this.isRateLimitError(retryResponse)) {
					throw this.mapErrorResponse(retryResponse, new URL(url).hostname);
				}
				return retryResponse;
			}, this.retryConfig);
		}

		if (!isSuccessfulResponse(response)) {
			throw this.mapErrorResponse(response, new URL(url).hostname);
		}
		// Set a flag in the `resolvedCache` for this URL. The intent of this is
		// to ensure that the exponential backoff method in `prefetchData` does
		// not continue to retry fetching for this URL, especially if it was previously
		// in a failed state. Note: this scenario only occurs on initial page load, if the
		// user scrolls through the page very fast. Once the URL is visible, prefetching
		// no longer takes place.
		this.resolvedCache[url] = true;
		// Return the JSON-LD response back up!
		return response.body;
	}

	public async postData(data: InvokePayload<InvokeRequest>): Promise<JsonLd.Response> {
		const requestData = {
			key: data.key,
			action: data.action,
			context: data.context,
		};
		return await request('post', `${this.resolverUrl}/invoke`, requestData);
	}

	/**
	 * Make request to the Search endpoint See `InvocationRequest` in ORS openapi.yaml for backend
	 * spec.
	 * @param data Payload including the search provider key and query. An empty search query string
	 * results in recent results being returned (pre-query).
	 * @returns JsonLd collection of search results.
	 */
	public async search(data: InvokePayload<InvocationSearchPayload>): Promise<JsonLd.Collection> {
		const { key, action } = data;
		// Note: context in action is different to context in data, see types.
		const { query, context } = action;
		const requestData = {
			key,
			search: {
				query,
				context,
			},
		};
		const response = await request<ErrorResponse | JsonLd.Collection>(
			'post',
			`${this.resolverUrl}/invoke/search`,
			requestData,
		);
		if (isErrorResponse(response)) {
			// There is no hostname/it is not known. Hostname is not logged anyway as it's considered PII.
			throw this.mapErrorResponse(response);
		}
		return response;
	}

	public async fetchAvailableSearchProviders() {
		const response = await request<SearchProviderInfoResponse>(
			'post',
			`${this.resolverUrl}/providers`,
			{ type: 'search' },
		);

		return response.providers;
	}

	private mapErrorResponse(response: ErrorResponse, hostname: string = '') {
		// Catch non-200 server responses to fallback or return useful information.
		if (response?.error) {
			const errorType = response.error.type;
			const errorMessage = response.error.message;
			const extensionKey = response.error.extensionKey;
			// this means there was a network error and we fallback to blue link
			// without impacting SLO's
			if (response.error instanceof NetworkError) {
				return new APIError('fallback', hostname, errorMessage, errorType);
			}

			switch (errorType) {
				// BadRequestError - indicative of an API error, render
				// a blue link to mitigate customer impact.
				case 'ResolveBadRequestError':
				case 'SearchBadRequestError':
					return new APIError('fallback', hostname, errorMessage, errorType, extensionKey);
				// AuthError - if the user logs in, we may be able
				// to recover. Render an unauthorized card.
				case 'ResolveAuthError':
				case 'SearchAuthError':
					return new APIError('auth', hostname, errorMessage, errorType, extensionKey);
				// UnsupportedError - we do not know how to render this URL.
				// Bail out and ask the Editor to render as a blue link.
				case 'ResolveUnsupportedError': // URL isn't supported
				case 'SearchUnsupportedError': // Search isn't supported
					return new APIError('fatal', hostname, errorMessage, errorType, extensionKey);
				case 'ResolveFailedError': // Failed
				case 'SearchFailedError':
				case 'ResolveTimeoutError': // Timeouts
				case 'SearchTimeoutError':
				case 'SearchRateLimitError': //Rate Limit Error
				case 'ResolveRateLimitError':
				case 'InternalServerError': // ORS failures
					return new APIError('error', hostname, errorMessage, errorType, extensionKey);
			}
		}
		// Catch all: we don't know this error, bail out.
		const { error, ...rest } = response || {};
		return new APIError(
			'fatal',
			hostname,
			// reason we stringify the error differently is because
			// JSON.stringify will return "{}" if it is an instance of Error
			// e.g. JSON.stringify(new Error('something went wrong')) will return '{}'
			// reason is JSON.stringify method only serializes enumerable properties but properties like "message" and "stack" are non enumerable
			// e.g. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message
			// more info here https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
			// we assume 'rest'  to "serializable" meaning all its properties are enumerable
			response ? `${this.stringifyError(error)} ${JSON.stringify(rest)}` : 'Response undefined',
			'UnexpectedError',
		);
	}

	/**
	 * This method will strigify both enumerable and  non enumerable properties of an object
	 * @param err
	 * @returns object serialized to JSON with both enumerable and non enumerable objects
	 */
	private stringifyError(err: object) {
		/**
		 * By default JSON.stringify only serializes enumerable properties of an object. In order for us to
		 * serialize non enumerable properties out of an error we need to expclitily provide the non enumerable property names.
		 * the second parameter to JSON.stringify gets the properties that will be serialized from the object passed in the first argument
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
		 */
		return JSON.stringify(
			err,
			//In ES5, if the argument to getOwnPropertyNames method is not an object (a primitive), then it will cause a TypeError
			typeof err === 'object' ? Object.getOwnPropertyNames(err) : undefined,
		);
	}
}
