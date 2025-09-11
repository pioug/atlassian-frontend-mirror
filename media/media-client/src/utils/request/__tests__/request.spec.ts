import { nextTick } from '@atlaskit/media-common/test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { request } from '..';
import { isRequestError, RequestError } from '../errors';
import { fetchRetry } from '../helpers';
import { type RequestMetadata } from '../types';

// Mock dependencies for Edge retry functionality
jest.mock('../../pathBasedUrl');
jest.mock('../../getNavigator');
jest.mock('../helpers', () => ({
	...jest.requireActual('../helpers'),
	isFetchNetworkError: jest.fn(),
	defaultShouldRetryError: jest.fn(),
}));

import { mapRetryUrlToPathBasedUrl } from '../../pathBasedUrl';
import getNavigator from '../../getNavigator';
import { isFetchNetworkError, defaultShouldRetryError } from '../helpers';

// Type the mocked functions
const mockMapRetryUrlToPathBasedUrl = mapRetryUrlToPathBasedUrl as jest.MockedFunction<
	typeof mapRetryUrlToPathBasedUrl
>;
const mockGetNavigator = getNavigator as jest.MockedFunction<typeof getNavigator>;
const mockIsFetchNetworkError = isFetchNetworkError as jest.MockedFunction<
	typeof isFetchNetworkError
>;
const mockDefaultShouldRetryError = defaultShouldRetryError as jest.MockedFunction<
	typeof defaultShouldRetryError
>;

describe('request', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();

		// Default mock implementations
		mockGetNavigator.mockReturnValue({
			userAgent:
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
		} as Navigator);
		mockMapRetryUrlToPathBasedUrl.mockImplementation((url) => new URL(url));
		mockIsFetchNetworkError.mockReturnValue(false);
		mockDefaultShouldRetryError.mockReturnValue(true);
	});

	describe('fetchRetry', () => {
		const emptyMetadata: RequestMetadata = {};

		it('should run functionToRetry at least once', async () => {
			const functionToRetry = jest.fn();
			await fetchRetry(functionToRetry, emptyMetadata, { maxAttempts: 1 });
			expect(functionToRetry).toHaveBeenCalledTimes(1);
		});

		it('should exhaust functionToRetry if fetch error using startTimeoutInMs * factor as delay', async () => {
			jest.useFakeTimers();

			const fetchError = new TypeError('failed to fetch');
			const functionToRetry = jest.fn().mockImplementation(() => {
				throw fetchError;
			});

			const requestMetadata: RequestMetadata = {
				method: 'GET',
				endpoint: '/uri',
			};

			try {
				const p = fetchRetry(functionToRetry, requestMetadata, {
					startTimeoutInMs: 1,
					maxAttempts: 3,
					factor: 2,
				});

				jest.advanceTimersByTime(1);
				await nextTick();
				await nextTick();
				jest.advanceTimersByTime(2);
				await nextTick();
				await nextTick();
				jest.advanceTimersByTime(4);
				await nextTick();
				await nextTick();

				await p;
			} catch (err: any) {
				if (!isRequestError(err)) {
					return expect(isRequestError(err)).toBeTruthy();
				}
				expect(functionToRetry).toHaveBeenCalledTimes(3);
				expect(err.attributes).toMatchObject({
					reason: 'serverUnexpectedError',
					attempts: 3,
					clientExhaustedRetries: true,
					method: 'GET',
					endpoint: '/uri',
					innerError: fetchError,
				});
				expect(err.reason).toBe('serverUnexpectedError');
				expect(err.metadata).toMatchObject({
					attempts: 3,
					clientExhaustedRetries: true,
					method: 'GET',
					endpoint: '/uri',
				});
				expect(err.innerError).toMatchObject(expect.any(Error));
			}

			expect.assertions(5);

			jest.useRealTimers();
		});

		it('should exhaust functionToRetry if request error using startTimeoutInMs * factor as delay', async () => {
			jest.useFakeTimers();

			const requestMetadata: RequestMetadata = {
				method: 'GET',
				endpoint: '/uri',
			};

			const fetchError = new TypeError('failed to fetch');
			const requestError = new RequestError(
				'serverBadGateway',
				{
					...requestMetadata,
					statusCode: 502,
				},
				fetchError,
			);
			const functionToRetry = jest.fn().mockImplementation(() => {
				throw requestError;
			});

			try {
				const p = fetchRetry(functionToRetry, requestMetadata, {
					startTimeoutInMs: 1,
					maxAttempts: 3,
					factor: 2,
				});

				jest.advanceTimersByTime(1);
				await nextTick();
				await nextTick();
				jest.advanceTimersByTime(2);
				await nextTick();
				await nextTick();
				jest.advanceTimersByTime(4);
				await nextTick();
				await nextTick();

				await p;
			} catch (err: any) {
				if (!isRequestError(err)) {
					return expect(isRequestError(err)).toBeTruthy();
				}
				expect(functionToRetry).toHaveBeenCalledTimes(3);
				expect(err.attributes).toMatchObject({
					reason: 'serverBadGateway',
					attempts: 3,
					clientExhaustedRetries: true,
					method: 'GET',
					endpoint: '/uri',
					statusCode: 502,
					innerError: fetchError,
				});
				expect(err.reason).toBe('serverBadGateway');
				expect(err.metadata).toMatchObject({
					attempts: 3,
					clientExhaustedRetries: true,
					method: 'GET',
					endpoint: '/uri',
					statusCode: 502,
				});
				expect(err.innerError).toMatchObject(expect.any(Error));
			}

			expect.assertions(5);

			jest.useRealTimers();
		});

		it('should not retry functionToRetry if fetch aborted', async () => {
			const functionToRetry = jest.fn().mockImplementation(() => {
				const abortError1 = new Error('request_cancelled');
				throw abortError1;
			});

			try {
				await fetchRetry(functionToRetry, emptyMetadata, { maxAttempts: 3 });
			} catch (err: any) {
				if (!isRequestError(err)) {
					return expect(isRequestError(err)).toBeTruthy();
				}
				expect(functionToRetry).toHaveBeenCalledTimes(1);
				expect(err.attributes).toMatchObject({
					reason: 'clientAbortedRequest',
				});
				expect(err.reason).toBe('clientAbortedRequest');
			}

			expect.assertions(3);

			functionToRetry.mockImplementation(() => {
				const abortError2 = new Error('');
				abortError2.name = 'AbortError';
				throw abortError2;
			});

			try {
				await fetchRetry(functionToRetry, emptyMetadata, { maxAttempts: 3 });
			} catch (err: any) {
				if (!isRequestError(err)) {
					return expect(isRequestError(err)).toBeTruthy();
				}
				expect(functionToRetry).toHaveBeenCalledTimes(2);
				expect(err.attributes).toMatchObject({
					reason: 'clientAbortedRequest',
				});
				expect(err.reason).toBe('clientAbortedRequest');
			}

			expect.assertions(6);
		});

		it('should not retry functionToRetry if client-side error', async () => {
			const functionToRetry = jest.fn().mockImplementation(() => {
				const clientSideError = new RequestError('clientTimeoutRequest');
				throw clientSideError;
			});

			try {
				await fetchRetry(functionToRetry, emptyMetadata, { maxAttempts: 3 });
			} catch (err: any) {
				if (!isRequestError(err)) {
					return expect(isRequestError(err)).toBeTruthy();
				}
				expect(functionToRetry).toHaveBeenCalledTimes(1);
				expect(err.attributes).toMatchObject({
					reason: 'clientTimeoutRequest',
				});
				expect(err.reason).toBe('clientTimeoutRequest');
			}

			expect.assertions(3);
		});

		it('should not retry functionToRetry if backend error < 500', async () => {
			const requestMetadata: RequestMetadata = {
				method: 'GET',
				endpoint: '/uri',
			};

			const functionToRetry = jest.fn().mockImplementation(() => {
				const serverError = new RequestError('serverRateLimited', {
					...requestMetadata,
					statusCode: 429,
				});
				throw serverError;
			});

			try {
				await fetchRetry(functionToRetry, requestMetadata, { maxAttempts: 3 });
			} catch (err: any) {
				if (!isRequestError(err)) {
					return expect(isRequestError(err)).toBeTruthy();
				}
				expect(functionToRetry).toHaveBeenCalledTimes(1);
				expect(err.attributes).toMatchObject({
					reason: 'serverRateLimited',
					method: 'GET',
					endpoint: '/uri',
					statusCode: 429,
				});
				expect(err.reason).toBe('serverRateLimited');
				expect(err.metadata).toMatchObject({
					method: 'GET',
					endpoint: '/uri',
					statusCode: 429,
				});
			}

			expect.assertions(4);
		});

		it('should retry functionToRetry if condition meets custom shouldRetryError', async () => {
			const requestMetadata: RequestMetadata = {
				method: 'GET',
				endpoint: '/uri',
			};

			const functionToRetry = jest.fn().mockImplementation(() => {
				const serverError = new RequestError('serverUnauthorized', {
					...requestMetadata,
					statusCode: 401,
				});
				throw serverError;
			});

			try {
				await fetchRetry(functionToRetry, requestMetadata, {
					maxAttempts: 3,
					shouldRetryError: (err) => isRequestError(err) && err.metadata?.statusCode === 401,
				});
			} catch (err: any) {
				if (!isRequestError(err)) {
					return expect(isRequestError(err)).toBeTruthy();
				}
				expect(functionToRetry).toHaveBeenCalledTimes(3);
				expect(err.attributes).toMatchObject({
					reason: 'serverUnauthorized',
					method: 'GET',
					endpoint: '/uri',
					statusCode: 401,
				});
				expect(err.reason).toBe('serverUnauthorized');
				expect(err.metadata).toMatchObject({
					method: 'GET',
					endpoint: '/uri',
					statusCode: 401,
				});
			}

			expect.assertions(4);
		});
	});

	const url = 'http://some-url/';
	const clientId = 'some-client-id';
	const asapIssuer = 'some-asap-issuer';
	const token = 'some-token';
	const baseUrl = 'some-base-url';

	describe('2xx codes handling', () => {
		afterEach(() => {
			fetchMock.resetMocks();
		});

		it('should call fetch with GET method given url only', async () => {
			await request(url);

			expect(fetchMock).toHaveBeenCalledWith(url, { method: 'GET' });
		});

		it('should call fetch with trace context given trace context passed ', async () => {
			await request(url, {
				traceContext: {
					traceId: 'some-trace-id',
					spanId: 'some-span-id',
				},
			});

			expect(fetchMock).toHaveBeenCalledWith(url, {
				method: 'GET',
				headers: {
					'x-b3-spanid': 'some-span-id',
					'x-b3-traceid': 'some-trace-id',
				},
			});
		});

		it('should call fetch with auth header given GET request and client based auth', async () => {
			await request(url, {
				method: 'GET',
				auth: { clientId, token, baseUrl },
			});

			expect(fetchMock).toHaveBeenCalledWith(url, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer some-token',
					'X-Client-Id': 'some-client-id',
				},
			});
		});

		it('should call fetch with auth header given GET request and asap based auth', async () => {
			await request(url, {
				method: 'GET',
				auth: { asapIssuer, token, baseUrl },
			});

			expect(fetchMock).toHaveBeenCalledWith(url, {
				method: 'GET',
				headers: {
					'X-Issuer': asapIssuer,
					Authorization: `Bearer ${token}`,
				},
			});
		});

		it('should call fetch with auth headers given POST request and client based auth', async () => {
			await request(url, {
				method: 'POST',
				auth: { clientId, token, baseUrl },
			});

			expect(fetchMock).toHaveBeenCalledWith(url, {
				method: 'POST',
				headers: {
					'X-Client-Id': clientId,
					Authorization: `Bearer ${token}`,
				},
			});
		});

		it('should call fetch with auth headers given GET request and asap based auth', async () => {
			await request(url, {
				method: 'POST',
				auth: { asapIssuer, token, baseUrl },
			});

			expect(fetchMock).toHaveBeenCalledWith(url, {
				method: 'POST',
				headers: {
					'X-Issuer': asapIssuer,
					Authorization: `Bearer ${token}`,
				},
			});
		});
	});

	describe('errors and retries handling', () => {
		afterEach(() => {
			fetchMock.resetMocks();
		});

		it('should not fail or retry if response is 3XX', async () => {
			fetchMock.mockResponses(
				[
					'Found',
					{
						status: 302,
						statusText: 'Found',
						headers: { Location: 'http://other-url' },
					},
				],
				'Ok',
			);

			const response = await request(url);

			expect(response.status).toBe(302);
			expect(await response.text()).toEqual('Found');
			expect(response.headers.get('Location')).toEqual('http://other-url');
			expect(fetchMock.mock.calls.length).toEqual(1); // meaning it didn't retry because it shouldn't retry on 3xx
		});

		it('should fail but not retry if response is 4XX', async () => {
			fetchMock.once('Access forbidden', {
				status: 403,
				statusText: 'Forbidden',
			});

			let error;
			try {
				await request(url, {
					method: 'GET',
					endpoint: '/uri',
				});
			} catch (e) {
				error = e;
			}

			// @ts-expect-error
			if (!isRequestError(error)) {
				// @ts-expect-error
				return expect(isRequestError(error)).toBeTruthy();
			}

			expect(error.attributes).toMatchObject({
				reason: 'serverForbidden',
				method: 'GET',
				endpoint: '/uri',
				statusCode: 403,
			});
			expect(error.reason).toBe('serverForbidden');
			expect(error.metadata).toMatchObject({
				method: 'GET',
				endpoint: '/uri',
				statusCode: 403,
			});

			expect(fetchMock.mock.calls.length).toEqual(1); // meaning it didn't retry because it shouldn't retry on 4xx
		});

		it('should retry on >= http 500', async () => {
			fetchMock.mockResponses(
				[
					'Internal Server Error',
					{
						status: 500,
						statusText: 'Internal Server Error',
					},
				],
				[
					'Internal Server Error',
					{
						status: 500,
						statusText: 'Internal Server Error',
					},
				],
				'Ok',
			);

			const response = await request(url, {
				clientOptions: {
					retryOptions: { startTimeoutInMs: 1, factor: 1 },
				},
			});

			expect(response.status).toEqual(200);
			expect(fetchMock.mock.calls.length).toEqual(3); // should have retried twice and succeeded
		});

		it('should retry on >= http 500 and fail on 400', async () => {
			fetchMock.mockResponses(
				[
					'Internal Server Error',
					{
						status: 500,
						statusText: 'Internal Server Error',
					},
				],
				[
					'Internal Server Error',
					{
						status: 500,
						statusText: 'Internal Server Error',
					},
				],
				[
					'Bad Request',
					{
						status: 400,
						statusText: 'Bad Request',
					},
				],
			);

			let error;
			try {
				await request(url, {
					method: 'GET',
					endpoint: '/uri',
					clientOptions: {
						retryOptions: { startTimeoutInMs: 1, factor: 1 },
					},
				});
			} catch (e) {
				error = e;
			}

			// @ts-expect-error
			if (!isRequestError(error)) {
				// @ts-expect-error
				return expect(isRequestError(error)).toBeTruthy();
			}

			expect(error.attributes).toMatchObject({
				reason: 'serverBadRequest',
				method: 'GET',
				endpoint: '/uri',
				statusCode: 400,
			});
			expect(error.reason).toBe('serverBadRequest');
			expect(error.metadata).toMatchObject({
				method: 'GET',
				endpoint: '/uri',
				statusCode: 400,
			});

			expect(fetchMock.mock.calls.length).toEqual(3); // should have retried twice and hit non-retryable error
		});

		it('should retry on >= http 500 and fail after a number of attempts if unsuccessful', async () => {
			fetchMock.mockResponse('Internal Server Error', {
				status: 500,
				statusText: 'Internal Server Error',
			});

			let error;
			try {
				await request(url, {
					method: 'GET',
					endpoint: '/uri',
					clientOptions: {
						retryOptions: { startTimeoutInMs: 1, maxAttempts: 3, factor: 1 },
					},
				});
			} catch (e) {
				error = e;
			}

			// @ts-expect-error
			if (!isRequestError(error)) {
				// @ts-expect-error
				return expect(isRequestError(error)).toBeTruthy();
			}

			expect(error.attributes).toMatchObject({
				reason: 'serverInternalError',
				attempts: 3,
				clientExhaustedRetries: true,
				method: 'GET',
				endpoint: '/uri',
				statusCode: 500,
			});
			expect(error.reason).toBe('serverInternalError');
			expect(error.metadata).toMatchObject({
				attempts: 3,
				clientExhaustedRetries: true,
				method: 'GET',
				endpoint: '/uri',
				statusCode: 500,
			});

			expect(fetchMock.mock.calls.length).toEqual(3); // shoud have exhausted retries and failed
		});

		it('should not retry if request is aborted (using DOMException)', async () => {
			fetchMock.mockRejectOnce(new DOMException('The user aborted a request.', 'AbortError'));

			let error;
			try {
				await request(url, {
					clientOptions: {
						retryOptions: { startTimeoutInMs: 1, factor: 1 },
					},
				});
			} catch (e) {
				error = e;
			}

			// @ts-expect-error
			if (!isRequestError(error)) {
				// @ts-expect-error
				return expect(isRequestError(error)).toBeTruthy();
			}

			expect(error.attributes.reason).toEqual('clientAbortedRequest');
			expect(error.reason).toEqual('clientAbortedRequest');
			expect(fetchMock.mock.calls.length).toEqual(1); // should not have retried on aborted requests
		});

		it('should not retry if request is aborted (using Error)', async () => {
			fetchMock.mockRejectOnce(new Error('request_cancelled'));

			let error;
			try {
				await request(url, {
					clientOptions: {
						retryOptions: { startTimeoutInMs: 1, factor: 1 },
					},
				});
			} catch (e) {
				error = e;
			}

			// @ts-expect-error
			if (!isRequestError(error)) {
				// @ts-expect-error
				return expect(isRequestError(error)).toBeTruthy();
			}

			expect(error.attributes.reason).toEqual('clientAbortedRequest');
			expect(error.reason).toEqual('clientAbortedRequest');
			expect(fetchMock.mock.calls.length).toEqual(1); // should not have retried on aborted requests
		});

		it('should have media region and environment in error metadata returned from response header', async () => {
			fetchMock.mockResponses([
				'ServerBadRequest',
				{
					status: 400,
					statusText: 'ServerBadRequest',
					headers: {
						'x-media-region': 'ap-southeast-2',
						'x-media-env': 'adev',
					},
				},
			]);

			let error;
			try {
				await request(url, {
					method: 'GET',
					endpoint: '/uri',
				});
			} catch (e) {
				error = e;
			}

			// @ts-expect-error
			if (!isRequestError(error)) {
				// @ts-expect-error
				return expect(isRequestError(error)).toBeTruthy();
			}

			expect(error.attributes).toMatchObject({
				reason: 'serverBadRequest',
				method: 'GET',
				endpoint: '/uri',
				mediaRegion: 'ap-southeast-2',
				mediaEnv: 'adev',
				statusCode: 400,
			});
			expect(error.reason).toBe('serverBadRequest');
			expect(error.metadata).toMatchObject({
				method: 'GET',
				endpoint: '/uri',
				mediaRegion: 'ap-southeast-2',
				mediaEnv: 'adev',
				statusCode: 400,
			});
		});

		it('should have unknown media region and environment in error metadata if response header returns nothing', async () => {
			fetchMock.mockResponses([
				'ServerBadRequest',
				{
					status: 400,
					statusText: 'ServerBadRequest',
					headers: {},
				},
			]);

			let error;
			try {
				await request(url, {
					method: 'GET',
					endpoint: '/uri',
				});
			} catch (e) {
				error = e;
			}

			// @ts-expect-error
			if (!isRequestError(error)) {
				// @ts-expect-error
				return expect(isRequestError(error)).toBeTruthy();
			}

			expect(error.attributes).toMatchObject({
				reason: 'serverBadRequest',
				method: 'GET',
				endpoint: '/uri',
				mediaRegion: 'unknown',
				mediaEnv: 'unknown',
				statusCode: 400,
			});
			expect(error.reason).toBe('serverBadRequest');
			expect(error.metadata).toMatchObject({
				method: 'GET',
				endpoint: '/uri',
				mediaRegion: 'unknown',
				mediaEnv: 'unknown',
				statusCode: 400,
			});
		});
	});

	describe('Edge browser retry functionality', () => {
		const url = 'http://api.media.atlassian.com/test';
		const requestOptions = {
			method: 'GET' as const,
			endpoint: '/test',
			clientOptions: {
				retryOptions: { startTimeoutInMs: 1, maxAttempts: 3, factor: 1 },
			},
		};

		beforeAll(() => {
			// Note: Using beforeAll instead of beforeEach means mocks are only reset once
			// before all tests run, not between individual tests. This could potentially
			// cause test interference if tests modify mock behavior.
			fetchMock.resetMocks();
			jest.clearAllMocks();
		});

		describe('when platform_media_retry_edge_error is enabled', () => {
			ffTest.on('platform_media_retry_edge_error', 'when feature flag is on', () => {
				it('should not retry original URL but fallback to path-based URL on Edge browser with fetch network errors', async () => {
					mockGetNavigator.mockReturnValue({
						userAgent:
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91',
					} as Navigator);

					// Mock that the error is a fetch network error
					mockIsFetchNetworkError.mockReturnValue(true);
					mockDefaultShouldRetryError.mockReturnValue(true); // would normally retry

					const pathBasedUrl = 'https://current.atlassian.net/test';
					mockMapRetryUrlToPathBasedUrl.mockReturnValue(new URL(pathBasedUrl));

					const fetchError = new TypeError('failed to fetch');
					// Mock enough failures for both original URL and path-based URL retries
					fetchMock.mockReject(fetchError);

					let error1: any;
					try {
						await request(url, requestOptions);
					} catch (e) {
						error1 = e;
					}

					expect(error1).toBeDefined();
					// The path-based URL retry will also eventually fail and throw a RequestError
					expect(isRequestError(error1)).toBeTruthy();
					if (isRequestError(error1)) {
						expect(error1.reason).toBe('serverUnexpectedError');
						expect(error1.attributes?.clientExhaustedRetries).toBe(true);
					}
					// Should have 1 call with original URL + 3 calls with path-based URL (maxAttempts)
					expect(fetchMock).toHaveBeenCalledTimes(4);
					expect(fetchMock).toHaveBeenNthCalledWith(1, url, expect.any(Object));
					expect(fetchMock).toHaveBeenNthCalledWith(2, pathBasedUrl, expect.any(Object));
					expect(fetchMock).toHaveBeenNthCalledWith(3, pathBasedUrl, expect.any(Object));
					expect(fetchMock).toHaveBeenNthCalledWith(4, pathBasedUrl, expect.any(Object));
					expect(mockIsFetchNetworkError).toHaveBeenCalled();
					expect(mockGetNavigator).toHaveBeenCalled();
					expect(mockMapRetryUrlToPathBasedUrl).toHaveBeenCalledWith(url);
				});

				it('should retry with path-based URL on Edge browser when fetch network error occurs', async () => {
					mockGetNavigator.mockReturnValue({
						userAgent:
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91',
					} as Navigator);

					// Mock that the error is a fetch network error
					mockIsFetchNetworkError.mockReturnValue(true);
					mockDefaultShouldRetryError.mockReturnValue(true);

					const pathBasedUrl = 'https://current.atlassian.net/test';
					mockMapRetryUrlToPathBasedUrl.mockReturnValue(new URL(pathBasedUrl));

					// First attempt with original URL fails (shouldRetryError returns false for Edge+fetch network error)
					// Then path-based URL succeeds on first try
					fetchMock
						.mockRejectOnce(new TypeError('failed to fetch'))
						.mockResponseOnce('Ok', { status: 200 });

					const response = await request(url, requestOptions);

					expect(response.status).toBe(200);
					expect(mockGetNavigator).toHaveBeenCalled();
					expect(mockMapRetryUrlToPathBasedUrl).toHaveBeenCalledWith(url);

					// Should have 1 call with original URL (fails due to custom shouldRetryError), then 1 call with path-based URL (succeeds)
					expect(fetchMock).toHaveBeenCalledTimes(2);
					expect(fetchMock).toHaveBeenNthCalledWith(1, url, expect.any(Object));
					expect(fetchMock).toHaveBeenNthCalledWith(2, pathBasedUrl, expect.any(Object));
				});

				it('should retry path-based URL multiple times on Edge browser when needed', async () => {
					mockGetNavigator.mockReturnValue({
						userAgent:
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91',
					} as Navigator);

					// Mock that the error is a fetch network error
					mockIsFetchNetworkError.mockReturnValue(true);
					mockDefaultShouldRetryError.mockReturnValue(true);

					const pathBasedUrl = 'https://current.atlassian.net/test';
					mockMapRetryUrlToPathBasedUrl.mockReturnValue(new URL(pathBasedUrl));

					// First attempt with original URL fails, then path-based URL retries multiple times
					fetchMock
						.mockRejectOnce(new TypeError('failed to fetch'))
						.mockResponseOnce('Internal Server Error', { status: 500 })
						.mockResponseOnce('Internal Server Error', { status: 500 })
						.mockResponseOnce('Ok', { status: 200 });

					const response = await request(url, requestOptions);

					expect(response.status).toBe(200);
					expect(mockGetNavigator).toHaveBeenCalled();
					expect(mockMapRetryUrlToPathBasedUrl).toHaveBeenCalledWith(url);

					// Should have 1 call with original URL, then 3 calls with path-based URL (2 retries + success)
					expect(fetchMock).toHaveBeenCalledTimes(4);
					expect(fetchMock).toHaveBeenNthCalledWith(1, url, expect.any(Object));
					expect(fetchMock).toHaveBeenNthCalledWith(2, pathBasedUrl, expect.any(Object));
					expect(fetchMock).toHaveBeenNthCalledWith(3, pathBasedUrl, expect.any(Object));
					expect(fetchMock).toHaveBeenNthCalledWith(4, pathBasedUrl, expect.any(Object));
				});

				it('should retry normally on non-Edge browsers even with fetch network errors', async () => {
					// Chrome user agent (non-Edge)
					mockGetNavigator.mockReturnValue({
						userAgent:
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
					} as Navigator);

					// Mock that the error is a fetch network error
					mockIsFetchNetworkError.mockReturnValue(true);
					mockDefaultShouldRetryError.mockReturnValue(true);

					fetchMock.mockReject(new TypeError('failed to fetch'));

					let error3: any;
					try {
						await request(url, requestOptions);
					} catch (e) {
						error3 = e;
					}

					expect(isRequestError(error3)).toBeTruthy();
					if (isRequestError(error3)) {
						expect(error3.reason).toBe('serverUnexpectedError');
					}
					// Should be called maxAttempts times (retries normally because not Edge)
					expect(fetchMock).toHaveBeenCalledTimes(3);
					expect(mockGetNavigator).toHaveBeenCalled();
					expect(mockMapRetryUrlToPathBasedUrl).not.toHaveBeenCalled();
				});

				it('should not retry with path-based URL for non-fetch network errors', async () => {
					mockGetNavigator.mockReturnValue({
						userAgent:
							'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91',
					} as Navigator);

					// Reset to default behavior for this test
					mockIsFetchNetworkError.mockReturnValue(false);
					mockDefaultShouldRetryError.mockReturnValue(false); // 400 errors shouldn't retry

					// Return a 400 error instead of fetch error
					fetchMock.mockResponse('Bad Request', { status: 400 });

					let error2: any;
					try {
						await request(url, requestOptions);
					} catch (e) {
						error2 = e;
					}

					expect(isRequestError(error2)).toBeTruthy();
					if (isRequestError(error2)) {
						expect(error2.reason).toBe('serverBadRequest');
					}
					// Should only be called once since 400 errors don't retry
					expect(fetchMock).toHaveBeenCalledTimes(1);
					// Navigator should not be checked for non-fetch network errors during retry phase
					expect(mockMapRetryUrlToPathBasedUrl).not.toHaveBeenCalled();
				});
			});
		});

		describe('when platform_media_retry_edge_error is disabled', () => {
			ffTest.off('platform_media_retry_edge_error', 'when feature flag is off', () => {
				it('should use normal fetchRetry without Edge-specific retry logic', async () => {
					// Reset mocks to defaults
					mockIsFetchNetworkError.mockReturnValue(false);
					mockDefaultShouldRetryError.mockReturnValue(true);

					fetchMock.mockResponse('Ok', { status: 200 });

					const response = await request(url, requestOptions);

					expect(response.status).toBe(200);
					// Should not call any of the Edge-specific functions when feature flag is off
					expect(mockGetNavigator).not.toHaveBeenCalled();
					expect(mockMapRetryUrlToPathBasedUrl).not.toHaveBeenCalled();
					expect(mockIsFetchNetworkError).not.toHaveBeenCalled();
				});
			});
		});
	});
});
