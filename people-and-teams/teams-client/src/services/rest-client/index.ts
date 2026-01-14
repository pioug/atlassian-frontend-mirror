import once from 'lodash/once';

import { HttpError, SLOIgnoreError } from '../../common/utils/error';
import { fetchWithExponentialBackoff } from '../../common/utils/http';
import { handleResponse } from '../../common/utils/status-code-handlers-provider';
import { BaseClient, type ClientConfig } from '../base-client';

import { clearCookie, getCookieAsInteger, REDIRECT_COUNT, setCookie } from './utils/cookie';
import { parseErrorMessage } from './utils/parse-error-message';
import { parseResponse } from './utils/parse-response';
import { stripUUIDFromPath } from './utils/strip-uuid';

interface FetchOptions {
	headers?: {
		[key: string]: string;
	};
	ignoreResponse?: boolean;
	body?: any; // tslint:disable-line no-any
	method?: string;
	shouldLogError?: (e: HttpError) => boolean;
}

const defaultFetchOptions: RequestInit = {
	credentials: 'include',
	headers: {
		Accept: 'application/json',
	},
	mode: 'cors',
};

let incrementRedirectCount: () => void;
let clearRedirectCount: () => void;
resetRedirectCountOnceFlag();

// Used by test to reset the once-ness of the functions above
export function resetRedirectCountOnceFlag(): void {
	incrementRedirectCount = once(() =>
		setCookie(REDIRECT_COUNT, getCookieAsInteger(REDIRECT_COUNT) + 1),
	);

	clearRedirectCount = once(() => clearCookie(REDIRECT_COUNT));
}

export class RestClient extends BaseClient {
	constructor({
		serviceUrl = '',
		config = { logException: () => {} },
	}: {
		serviceUrl: string;
		config?: ClientConfig;
	}) {
		super(config);
		this.serviceUrl = serviceUrl;
	}

	serviceUrl: string;

	setServiceUrl(serviceUrl: string): void {
		this.serviceUrl = serviceUrl;
	}

	async getResource<T>(
		path: string,
		fetchOptions: Omit<FetchOptions, 'method' | 'body'> = {},
	): Promise<T> {
		return this.makeRequest(path, fetchOptions);
	}

	async getResourceCached<T>(
		path: string,
		fetchOptions: Omit<FetchOptions, 'method' | 'body'> = {},
		cacheOptions?: { expiration: number },
	): Promise<T> {
		const cacheKey = path;
		const cacheRecord = this.getCachedValue<T>(cacheKey);
		if (cacheRecord) {
			return cacheRecord;
		}

		const response = await this.getResource<T>(path, fetchOptions);
		this.cacheValue(cacheKey, response, cacheOptions?.expiration);
		return response;
	}

	async postResource<T>(
		path: string,
		data?: Record<string, unknown>,
		fetchOptions: FetchOptions = {},
	): Promise<T> {
		return this.postResourceRaw(path, JSON.stringify(data), fetchOptions);
	}

	async postResourceRaw<T>(
		path: string,
		data?: string,
		fetchOptions: FetchOptions = {},
	): Promise<T> {
		fetchOptions = {
			method: 'post',
			headers: {},
			...fetchOptions,
		};

		if (data) {
			fetchOptions = {
				body: data,
				...fetchOptions,
				headers: {
					'Content-Type': 'application/json',
					...fetchOptions.headers,
				},
			};
		}

		return this.makeRequest(path, fetchOptions);
	}

	async patchResource<T>(path: string, data?: Record<string, unknown>): Promise<T> {
		let fetchOptions: FetchOptions = {
			/**
			 * PATCH must be uppercase as per fetch spec only
			 * DELETE, GET, HEAD, OPTIONS, POST, and PUT methods
			 * are normalised to uppercase.
			 *
			 * https://github.com/github/fetch/issues/37
			 * https://fetch.spec.whatwg.org/#methods
			 */
			method: 'PATCH',
		};

		if (data) {
			fetchOptions = {
				...fetchOptions,
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
				},
			};
		}

		return this.makeRequest(path, fetchOptions);
	}

	async putResource<T>(
		path: string,
		data?: Record<string, unknown>,
		additionalFetchOptions: FetchOptions = {},
	): Promise<T> {
		const fetchOptions = {
			method: 'put',
		};

		if (data) {
			Object.assign(fetchOptions, {
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
				},
			});
		}

		return this.makeRequest(path, {
			...fetchOptions,
			...additionalFetchOptions,
		});
	}

	async deleteResource<T>(path: string, options: FetchOptions = {}): Promise<T> {
		const fetchOptions = {
			...options,
			method: 'delete',
		};

		return this.makeRequest(path, fetchOptions);
	}

	/**
	 * This function is necessary for if `statusCodeHandler` prescribes a login
	 * redirect upon a 401 response.
	 * While the default redirect behaviour may be overriden, this function has
	 * been kept separate to ensure it cannot be overriden, lest a host
	 * application supply embeddable-directory with a custom handler that suffers
	 * the infinite redirect bug.
	 */
	preventInfiniteRedirectLoop = (response: Response): void => {
		if (!response.ok) {
			const responseStatusCode = response.status;
			if (responseStatusCode === 401) {
				incrementRedirectCount();
			}
		} else {
			clearRedirectCount();
		}
	};

	async makeRequest<T>(
		path: string,
		additionalFetchOptions: FetchOptions = {
			shouldLogError: (e: HttpError) => e.status !== 429,
		},
	): Promise<T> {
		const url = this.serviceUrl + path;
		const options = { ...defaultFetchOptions, ...additionalFetchOptions };

		const response = await fetchWithExponentialBackoff(url, options);

		this.preventInfiniteRedirectLoop(response);

		handleResponse(response);

		const responseStatusCode = response.status;
		const traceId = response.headers.get('atl-traceid');
		if (!response.ok) {
			if (responseStatusCode === 401) {
				throw new SLOIgnoreError({
					message: 'Unauthorized Request - incrementing redirect count',
				});
			} else {
				const message = await parseErrorMessage(response);
				const httpError = new HttpError({
					message,
					status: responseStatusCode,
					traceId: traceId ?? undefined,
					path,
				});
				if (options.shouldLogError && options.shouldLogError(httpError)) {
					this.logException(httpError, stripUUIDFromPath(path), {
						method: options.method || 'GET',
						url,
						status: responseStatusCode,
					});
				}
				throw httpError;
			}
		}

		// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
		return additionalFetchOptions.ignoreResponse ? null : parseResponse(response);
	}
}
