let mockRequest = jest.fn();
jest.mock('@atlaskit/linking-common', () => ({
	...jest.requireActual<Object>('@atlaskit/linking-common'),
	request: (...args: any) => mockRequest(...args),
}));

import { mocks } from './__fixtures__/mocks';
import SmartCardClient, { urlResponsePromiseCache } from '..';
import {
	type ErrorResponseBody,
	isSuccessfulResponse,
	type SuccessResponse,
} from '../types/responses';
import { APIError, type ErrorType, NetworkError } from '@atlaskit/linking-common';
import { flushPromises } from '@atlaskit/media-test-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

// Mock response quick-references:
const errorResponse = {
	status: 500,
	error: {
		type: 'ResolveFailedError' as ErrorType,
		message: 'received failure error',
	},
};
const errorResponse429 = {
	status: 200,
	error: {
		type: 'ResolveRateLimitError' as ErrorType,
		message: 'rate limit error',
		status: 429,
	},
};
let successfulResponse: SuccessResponse;
let notFoundResponse: SuccessResponse;
let unauthorizedResponse: SuccessResponse;

const hostname = 'https://www.google.com';

// Map the URLs sent by DataLoader to their respective responses.
async function mockRequestFn(_method: string, _url: string, data?: any) {
	return data.map(({ resourceUrl }: any) => {
		const parts = resourceUrl.split(`/`);
		const key: keyof typeof mocks = parts[parts.length - 1];

		return new Promise((resolve) => {
			setTimeout(() => {
				if (['notSupported'].includes(key)) {
					resolve({
						status: (mocks[key] as ErrorResponseBody).status,
						error: mocks[key],
					});
				} else {
					resolve({ status: 200, body: mocks[key] });
				}
			}, 1);
		});
	});
}

const expectedDefaultResolveBatchUrl = '/gateway/api/object-resolver/resolve/batch';
const expectedDefaultResolveAriBatchUrl = '/gateway/api/object-resolver/resolve/ari/batch';

beforeEach(() => {
	mockRequest = jest.fn();

	successfulResponse = { status: 200, body: mocks.success };
	notFoundResponse = { status: 200, body: mocks.notFound };
	unauthorizedResponse = { status: 200, body: mocks.unauthorized };

	// Since we use module level caching,
	// we need to clear it up for clean test run
	urlResponsePromiseCache.clear();
});

afterEach(() => {
	jest.useRealTimers();
	jest.clearAllMocks();
});

describe('Smart Card: Client', () => {
	it('successfully sets up client with passed environment', async () => {
		mockRequest.mockImplementationOnce(async () => [successfulResponse]);
		const client = new SmartCardClient('stg');
		const resourceUrl = 'https://i.love.cheese';
		const response = await client.fetchData(resourceUrl);
		expect(mockRequest).toBeCalled();
		expect(mockRequest).toBeCalledWith(
			'post',
			expect.stringMatching(/.*?pug\.jira-dev.*?\/resolve\/batch/),
			[
				{
					resourceUrl,
				},
			],
			{},
		);
		expect(response).toBe(mocks.success);
	});

	it('successfully sets up client with passed baseUrlOverride', async () => {
		mockRequest.mockImplementationOnce(async () => [successfulResponse]);
		const client = new SmartCardClient('stg', 'https://trellis.coffee/gateway/api');
		const resourceUrl = 'https://i.love.cheese';
		const response = await client.fetchData(resourceUrl);
		expect(mockRequest).toBeCalled();
		expect(mockRequest).toBeCalledWith(
			'post',
			'https://trellis.coffee/gateway/api/object-resolver/resolve/batch',
			[
				{
					resourceUrl,
				},
			],
			{},
		);
		expect(response).toBe(mocks.success);
	});

	it('successfully sets client product value using setProduct', async () => {
		mockRequest.mockImplementationOnce(async () => [successfulResponse]);
		const client = new SmartCardClient('stg', 'https://trellis.coffee/gateway/api');
		client.setProduct('CONFLUENCE');
		const resourceUrl = 'https://i.love.cheese';
		const response = await client.fetchData(resourceUrl);
		expect(mockRequest).toBeCalled();
		expect(mockRequest).toBeCalledWith(
			'post',
			'https://trellis.coffee/gateway/api/object-resolver/resolve/batch',
			[
				{
					resourceUrl,
				},
			],
			{ 'X-Product': 'CONFLUENCE' },
		);
		expect(response).toBe(mocks.success);
	});

	it('should export baseUrlOverride and envKey for consumers to use to construct custom URLs', async () => {
		const baseUrlOverride = 'https://trellis.coffee/gateway/api';
		const envKey = 'stg';
		const client = new SmartCardClient(envKey, baseUrlOverride);
		expect(client.baseUrlOverride).toEqual(baseUrlOverride);
		expect(client.envKey).toEqual(envKey);
	});

	it('successfully deduplicates requests made in batches in same execution frame', async () => {
		mockRequest.mockImplementationOnce(mockRequestFn);
		const client = new SmartCardClient();
		const [responseFirst, responseSecond, responseThird] = await Promise.all([
			// NOTE: send in _two_ of the same URL
			client.fetchData(`${hostname}/success`),
			client.fetchData(`${hostname}/success`),
			client.fetchData(`${hostname}/notFound`),
		]);
		expect(mockRequest).toBeCalled();
		expect(mockRequest).toBeCalledWith(
			'post',
			expectedDefaultResolveBatchUrl,
			[
				// NOTE: we only expect _one_ of the duplicated URLs to actually be sent to the backend
				{
					resourceUrl: `${hostname}/success`,
				},
				{
					resourceUrl: `${hostname}/notFound`,
				},
			],
			{},
		);

		// NOTE: we still expect all three responses to be the same
		expect(responseFirst).toBe(mocks.success);
		expect(responseSecond).toBe(mocks.success);
		expect(responseThird).toBe(mocks.notFound);
	});

	it('successfully batches requests in same execution frame', async () => {
		mockRequest.mockImplementationOnce(async () => [
			successfulResponse,
			unauthorizedResponse,
			notFoundResponse,
		]);
		const client = new SmartCardClient();
		const [responseFirst, responseSecond, responseThird] = await Promise.all([
			client.fetchData(`${hostname}/1`),
			client.fetchData(`${hostname}/2`),
			client.fetchData(`${hostname}/3`),
		]);
		expect(mockRequest).toBeCalled();
		expect(mockRequest).toBeCalledWith(
			'post',
			expectedDefaultResolveBatchUrl,
			[
				{
					resourceUrl: `${hostname}/1`,
				},
				{
					resourceUrl: `${hostname}/2`,
				},
				{
					resourceUrl: `${hostname}/3`,
				},
			],
			{},
		);
		expect(responseFirst).toBe(mocks.success);
		expect(responseSecond).toBe(mocks.unauthorized);
		expect(responseThird).toBe(mocks.notFound);
	});

	it('should throttle batch requests', async () => {
		jest.useFakeTimers();
		mockRequest.mockResolvedValue([successfulResponse, successfulResponse, successfulResponse]);

		const client = new SmartCardClient();
		Promise.all([
			client.fetchData(`${hostname}/1`),
			client.fetchData(`${hostname}/2`),
			client.fetchData(`${hostname}/3`),
		]);

		await flushPromises();
		jest.runOnlyPendingTimers();

		Promise.all([
			client.fetchData(`${hostname}/4`),
			client.fetchData(`${hostname}/5`),
			client.fetchData(`${hostname}/6`),
		]);

		await flushPromises();

		expect(mockRequest).toBeCalledTimes(1);
		expect(mockRequest.mock.calls[0][2]).toHaveLength(3);

		jest.advanceTimersToNextTimer();
		await flushPromises();

		expect(mockRequest).toBeCalledTimes(2);
	});

	it('should handle errors in /batch endpoint', async () => {
		expect.assertions(2);
		mockRequest.mockImplementationOnce(async () =>
			Promise.reject({
				status: 400,
				error: 'some-error',
				message: 'error-message',
			}),
		);
		const client = new SmartCardClient();
		const resourceUrl = 'https://i.love.cheese';
		try {
			await client.fetchData(resourceUrl);
		} catch (error) {
			expect(error).toBeInstanceOf(APIError);
			expect(error).toEqual(
				expect.objectContaining({
					kind: 'fatal',
					hostname: 'i.love.cheese',
					type: 'UnexpectedError',
					name: 'APIError',
				}),
			);
		}
	});

	it('should handle errors containing error instance while fetching data', async () => {
		expect.assertions(2);
		mockRequest.mockImplementationOnce(async () => Promise.reject(new Error('test error')));
		const client = new SmartCardClient();
		const resourceUrl = 'https://i.love.cheese';
		try {
			await client.fetchData(resourceUrl);
		} catch (error) {
			expect(error).toBeInstanceOf(APIError);
			expect(error).toEqual(
				expect.objectContaining({
					kind: 'fatal',
					hostname: 'i.love.cheese',
					type: 'UnexpectedError',
					name: 'APIError',
					message: expect.stringContaining('"message":"test error"'),
				}),
			);
		}
	});

	it('should handle errors containing error instance (child class) while fetching data', async () => {
		expect.assertions(2);
		class SomeSpecificError extends Error {}

		mockRequest.mockImplementationOnce(async () =>
			Promise.reject(new SomeSpecificError('test error from child class')),
		);
		const client = new SmartCardClient();
		const resourceUrl = 'https://i.love.cheese';
		try {
			await client.fetchData(resourceUrl);
		} catch (error) {
			expect(error).toBeInstanceOf(APIError);
			expect(error).toEqual(
				expect.objectContaining({
					kind: 'fatal',
					hostname: 'i.love.cheese',
					type: 'UnexpectedError',
					name: 'APIError',
					message: expect.stringContaining('"message":"test error from child class"'),
				}),
			);
		}
	});

	it('fetchData should handle malformed responses and throw the appropriate error', async () => {
		mockRequest.mockImplementationOnce(async () => ({ status: 200 }));

		const client = new SmartCardClient();
		const resourceUrl = 'https://i.love.cheese';

		await expect(client.fetchData(resourceUrl)).rejects.toEqual(
			new APIError('fatal', 'i.love.cheese', 'Response undefined', 'UnexpectedError'),
		);
		expect(mockRequest).toBeCalled();
	});

	it('should return fallback error when error is a network error', async () => {
		expect.assertions(2);
		mockRequest.mockImplementationOnce(async () =>
			Promise.reject(new NetworkError('some-network-error')),
		);
		const client = new SmartCardClient();
		const resourceUrl = 'https://i.love.cheese';
		try {
			await client.fetchData(resourceUrl);
		} catch (error: any) {
			expect(error).toBeInstanceOf(APIError);
			expect(error.kind).toEqual('fallback');
		}
	});

	it('postData()', async () => {
		const client = new SmartCardClient();

		client.postData({
			action: {
				type: '',
				payload: {
					id: '',
				},
			},
			key: '',
			context: '',
		});
		expect(mockRequest).toBeCalled();
		expect(mockRequest).toBeCalledWith('post', '/gateway/api/object-resolver/invoke', {
			action: {
				type: '',
				payload: {
					id: '',
				},
			},
			key: '',
			context: '',
		});
	});

	ffTest.on(
		'platform.linking-platform.datasource.add-timezone-header',
		'timezone header in the request',
		() => {
			it('should set the timezone header correctly in the request call', async () => {
				mockRequest.mockImplementationOnce(async () => [successfulResponse]);
				const client = new SmartCardClient('stg');
				const resourceUrl = 'https://i.love.cheese';
				const response = await client.fetchData(resourceUrl);
				expect(mockRequest).toBeCalled();
				expect(mockRequest).toBeCalledWith(
					'post',
					expect.stringMatching(/.*?pug\.jira-dev.*?\/resolve\/batch/),
					[
						{
							resourceUrl,
						},
					],
					{ 'origin-timezone': 'UTC' },
				);
				expect(response).toBe(mocks.success);
			});

			it('should set the timezone header correctly in the request call when timezone is not UTC', async () => {
				const originalDateResolvedOptions = new Intl.DateTimeFormat().resolvedOptions();
				const mockedTimeZone = jest
					.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
					.mockReturnValue({
						...originalDateResolvedOptions,
						timeZone: 'Australia/Sydney',
					});

				mockRequest.mockImplementationOnce(async () => [successfulResponse]);
				const client = new SmartCardClient('stg');
				const resourceUrl = 'https://i.love.cheese';
				const response = await client.fetchData(resourceUrl);
				expect(mockRequest).toBeCalled();
				expect(mockRequest).toBeCalledWith(
					'post',
					expect.stringMatching(/.*?pug\.jira-dev.*?\/resolve\/batch/),
					[
						{
							resourceUrl,
						},
					],
					{ 'origin-timezone': 'Australia/Sydney' },
				);
				expect(response).toBe(mocks.success);
				mockedTimeZone.mockRestore();
			});
		},
	);

	ffTest.off(
		'platform.linking-platform.datasource.add-timezone-header',
		'no timezone header in the request',
		() => {
			it('should not set the header', async () => {
				mockRequest.mockImplementationOnce(async () => [successfulResponse]);
				const client = new SmartCardClient('stg');
				const resourceUrl = 'https://i.love.cheese';
				const response = await client.fetchData(resourceUrl);
				expect(mockRequest).toBeCalled();
				expect(mockRequest).toBeCalledWith(
					'post',
					expect.stringMatching(/.*?pug\.jira-dev.*?\/resolve\/batch/),
					[
						{
							resourceUrl,
						},
					],
					{},
				);
				expect(response).toBe(mocks.success);
			});
		},
	);

	describe('search()', () => {
		it('makes request with given parameters', async () => {
			const client = new SmartCardClient();

			await client.search({
				key: 'google-search-provider',
				action: { query: 'search terms', context: { id: 'some-id' } },
			});
			expect(mockRequest).toBeCalled();

			expect(mockRequest).toBeCalledWith('post', '/gateway/api/object-resolver/invoke/search', {
				key: 'google-search-provider',
				search: {
					query: 'search terms',
					context: { id: 'some-id' },
				},
			});
		});

		it('returns json-ld when no error occurs', async () => {
			mockRequest.mockImplementationOnce(async () => mocks.searchSuccess);
			const client = new SmartCardClient();

			const response = await client.search({
				key: 'google-search-provider',
				action: { query: 'search terms', context: { id: 'some-id' } },
			});
			expect(mockRequest).toBeCalled();

			expect(mockRequest).toBeCalledWith('post', '/gateway/api/object-resolver/invoke/search', {
				key: 'google-search-provider',
				search: {
					query: 'search terms',
					context: { id: 'some-id' },
				},
			});
			expect(response.data).not.toBeNull();
			expect(response.meta).not.toBeNull();
		});

		it('returns correct error when provider key is incorrect', async () => {
			mockRequest.mockImplementationOnce(async () => mocks.invokeSearchUnsupportedError);
			const client = new SmartCardClient();
			try {
				await client.search({
					key: 'not-a-valid-provider',
					action: { query: '', context: { id: 'some-id' } },
				});
			} catch (error) {
				expect(error).toBeInstanceOf(APIError);
				expect(error).toEqual(
					expect.objectContaining({
						kind: 'fatal',
						hostname: '',
						type: 'SearchUnsupportedError',
						name: 'APIError',
					}),
				);
			}
		});

		it('returns correct error for search timeout', async () => {
			mockRequest.mockImplementationOnce(async () => mocks.invokeSearchTimeoutError);
			const client = new SmartCardClient();
			try {
				await client.search({
					key: 'not-a-valid-provider',
					action: { query: '', context: { id: 'some-id' } },
				});
			} catch (error) {
				expect(error).toBeInstanceOf(APIError);
				expect(error).toEqual(
					expect.objectContaining({
						kind: 'error',
						hostname: '',
						type: 'SearchTimeoutError',
						name: 'APIError',
					}),
				);
			}
		});

		it('returns correct error for search failed', async () => {
			mockRequest.mockImplementationOnce(async () => mocks.invokeSearchFailedError);
			const client = new SmartCardClient();
			try {
				await client.search({
					key: 'not-a-valid-provider',
					action: { query: '', context: { id: 'some-id' } },
				});
			} catch (error) {
				expect(error).toBeInstanceOf(APIError);
				expect(error).toEqual(
					expect.objectContaining({
						kind: 'error',
						hostname: '',
						type: 'SearchFailedError',
						name: 'APIError',
					}),
				);
			}
		});

		it('returns correct error for search auth error', async () => {
			mockRequest.mockImplementationOnce(async () => mocks.invokeSearchAuthError);
			const client = new SmartCardClient();
			try {
				await client.search({
					key: 'not-a-valid-provider',
					action: { query: '', context: { id: 'some-id' } },
				});
			} catch (error) {
				expect(error).toBeInstanceOf(APIError);
				expect(error).toEqual(
					expect.objectContaining({
						kind: 'auth',
						hostname: '',
						type: 'SearchAuthError',
						name: 'APIError',
					}),
				);
			}
		});

		it('returns correct error when there is search rate limit error', async () => {
			mockRequest.mockImplementationOnce(async () => mocks.invokeSearchRateLimitError);
			const client = new SmartCardClient();
			try {
				await client.search({
					key: 'not-a-valid-provider',
					action: { query: '', context: { id: 'some-id' } },
				});
			} catch (error) {
				expect(error).toBeInstanceOf(APIError);
				expect(error).toEqual(
					expect.objectContaining({
						kind: 'error',
						hostname: '',
						type: 'SearchRateLimitError',
						name: 'APIError',
					}),
				);
			}
		});

		it('returns correct error for internal server error', async () => {
			mockRequest.mockImplementationOnce(async () => mocks.invokeInternalServerError);
			const client = new SmartCardClient();
			try {
				await client.search({
					key: 'not-a-valid-provider',
					action: { query: '', context: { id: 'some-id' } },
				});
			} catch (error) {
				expect(error).toBeInstanceOf(APIError);
				expect(error).toEqual(
					expect.objectContaining({
						kind: 'error',
						hostname: '',
						type: 'InternalServerError',
						name: 'APIError',
					}),
				);
			}
		});
	});

	describe('prefetchData', () => {
		it('successfully triggers prefetching of data for multiple URLs', async () => {
			mockRequest.mockImplementationOnce(async () => [
				successfulResponse,
				unauthorizedResponse,
				notFoundResponse,
			]);

			const client = new SmartCardClient();

			const responses = await Promise.all([
				client.prefetchData(`${hostname}/1`),
				client.prefetchData(`${hostname}/2`),
				client.prefetchData(`${hostname}/3`),
			]);

			expect(responses).toEqual([mocks.success, mocks.unauthorized, mocks.notFound]);
			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('initial request');
		});

		it('successfully triggers prefetching of data with exponential backoff for an errored URL which recovers', async () => {
			mockRequest.mockImplementationOnce(async () => [
				successfulResponse,
				unauthorizedResponse,
				errorResponse,
			]);
			// Fail on 1st retry attempt.
			mockRequest.mockImplementationOnce(async () => [errorResponse]);
			// Succeed on 2nd retry attempt.
			mockRequest.mockImplementationOnce(async () => [successfulResponse]);

			const client = new SmartCardClient();

			const responses = await Promise.all([
				client.prefetchData(`${hostname}/1`),
				client.prefetchData(`${hostname}/2`),
				client.prefetchData(`${hostname}/3`),
			]);

			expect(responses).toEqual([mocks.success, mocks.unauthorized, mocks.success]);
			expect(mockRequest).toHaveBeenCalledTimes(3);
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('initial request');
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 1');
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 2');
		});

		it('fails silently when prefetching data with exponential backoff for an errored URL which does not recover', async () => {
			mockRequest.mockImplementationOnce(async () => [
				successfulResponse,
				unauthorizedResponse,
				errorResponse,
			]);
			// Fail on 1st, 2nd, 3rd retry attempts as well.
			mockRequest.mockImplementationOnce(async () => [errorResponse]);
			mockRequest.mockImplementationOnce(async () => [errorResponse]);
			mockRequest.mockImplementationOnce(async () => [errorResponse]);

			const client = new SmartCardClient();

			const responses = await Promise.all([
				client.prefetchData(`${hostname}/1`),
				client.prefetchData(`${hostname}/2`),
				client.prefetchData(`${hostname}/3`),
			]);

			expect(responses).toEqual([
				mocks.success,
				mocks.unauthorized,
				// Since errors fail silently, the response in the case of an irrecoverable error
				// is set to `undefined`. This is handled accordingly upstream.
				undefined,
			]);

			expect(mockRequest).toHaveBeenCalledTimes(4);
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('initial request');
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 1');
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 2');
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 3');
		});

		it('fails silently when prefetching data (stops prefetching) with exponential backoff for an errored URL which recovers with fetch flow', async () => {
			// We place one successful mock at the start to represent the calling
			// of `client.fetchData()` and it succeeding
			// Note, that by successful we mean == not an error. We use unauthorized specifically to avoid
			// response being cached by `urlResponsePromiseCache`, but still be registered in `resolvedCache`.
			mockRequest.mockImplementationOnce(async () => [unauthorizedResponse]);
			// Then, we setup our prefetchers, with the last link failing to resolve,
			// even after retrying with backoff.
			mockRequest.mockImplementationOnce(async () => [
				successfulResponse,
				unauthorizedResponse,
				errorResponse,
			]);
			// Fail on 1st, 2nd, 3rd retry attempts as well (none of these should be
			// called, but adding the rest for clarity, asserted below).
			mockRequest.mockImplementationOnce(async () => [errorResponse]);
			mockRequest.mockImplementationOnce(async () => [errorResponse]);
			mockRequest.mockImplementationOnce(async () => [errorResponse]);

			const client = new SmartCardClient();

			// Kickoff a proper fetch of the URL.
			const fetchResponse = await client.fetchData(`${hostname}/3`);
			expect(fetchResponse).toEqual(mocks.unauthorized);

			// Then, start prefetching - we should only prefetch once (simulating a user scrolling
			// through a page very quickly) - after which we should stop trying to prefetch with
			// exponential backoff (since we are seeing errors).
			const responses = await Promise.all([
				client.prefetchData(`${hostname}/1`),
				client.prefetchData(`${hostname}/2`),
				client.prefetchData(`${hostname}/3`),
			]);

			expect(responses).toEqual([
				mocks.success,
				mocks.unauthorized,
				// Since errors fail silently, the response in the case of an irrecoverable error
				// is set to `undefined`. This is handled accordingly upstream.
				undefined,
			]);

			expect(mockRequest).toHaveBeenCalledTimes(2);
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('fetch request');
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('initial request');
			expect(mockRequest.mock.calls.shift()).toMatchSnapshot('retry attempt 1');
		});
	});

	describe('fetchData retry', () => {
		it('successfully triggers retry with exponential backoff for a url which returns 429', async () => {
			mockRequest.mockResolvedValueOnce([successfulResponse, errorResponse429]);

			mockRequest.mockResolvedValueOnce([errorResponse429]);
			mockRequest.mockResolvedValueOnce([successfulResponse]);

			const client = new SmartCardClient();
			const responses = await Promise.all([
				client.fetchData(`${hostname}/1`),
				client.fetchData(`${hostname}/2`),
			]);

			expect(responses).toEqual([mocks.success, mocks.success]);

			expect(mockRequest).toHaveBeenCalledTimes(3);

			const expectedFirstRequestParams = [
				'post',
				expectedDefaultResolveBatchUrl,
				[{ resourceUrl: `${hostname}/1` }, { resourceUrl: `${hostname}/2` }],
				{},
			];

			expect(mockRequest).toHaveBeenNthCalledWith(1, ...expectedFirstRequestParams);

			const expectedConsequentRequestParams = [
				'post',
				expectedDefaultResolveBatchUrl,
				[{ resourceUrl: `${hostname}/2` }],
				{},
			];

			expect(mockRequest).toHaveBeenNthCalledWith(2, ...expectedConsequentRequestParams);
			expect(mockRequest).toHaveBeenNthCalledWith(3, ...expectedConsequentRequestParams);
		});

		it('successfully retries url which returns 429 until failure', async () => {
			mockRequest.mockResolvedValue([errorResponse429]);

			const client = new SmartCardClient();

			await expect(client.fetchData(`${hostname}/1`)).rejects.toEqual(
				new APIError(
					'error',
					`${hostname}/1`,
					errorResponse429.error.message,
					errorResponse429.error.type,
				),
			);

			expect(mockRequest).toHaveBeenCalledTimes(4);

			const expectedRequestParams = [
				'post',
				expectedDefaultResolveBatchUrl,
				[{ resourceUrl: `${hostname}/1` }],
				{},
			];

			for (let i = 1; i <= 4; i++) {
				expect(mockRequest).toHaveBeenNthCalledWith(i, ...expectedRequestParams);
			}
		});
		it('successfully retries and returns an unauth response', async () => {
			mockRequest.mockResolvedValueOnce([errorResponse429]);
			mockRequest.mockResolvedValueOnce([errorResponse429]);
			mockRequest.mockResolvedValueOnce([unauthorizedResponse]);

			const client = new SmartCardClient();
			const unauthResponse = await client.fetchData(`${hostname}/unauthorized`);

			expect(unauthResponse).toBe(mocks.unauthorized);
			expect(mockRequest).toHaveBeenCalledTimes(3);
			const expectedRequestParams = [
				'post',
				expectedDefaultResolveBatchUrl,
				[{ resourceUrl: `${hostname}/unauthorized` }],
				{},
			];
			for (let i = 1; i <= 3; i++) {
				expect(mockRequest).toHaveBeenNthCalledWith(i, ...expectedRequestParams);
			}
		});

		it('successfully retries but throws error response on failure', async () => {
			mockRequest.mockResolvedValueOnce([errorResponse429]);
			mockRequest.mockResolvedValueOnce([errorResponse429]);
			mockRequest.mockResolvedValueOnce([errorResponse]);

			const client = new SmartCardClient();
			await expect(client.fetchData(`${hostname}/1`)).rejects.toEqual(
				new APIError(
					'error',
					`${hostname}/1`,
					errorResponse.error.message,
					errorResponse.error.type,
				),
			);

			expect(mockRequest).toHaveBeenCalledTimes(3);
			const expectedRequestParams = [
				'post',
				expectedDefaultResolveBatchUrl,
				[{ resourceUrl: `${hostname}/1` }],
				{},
			];
			for (let i = 1; i <= 3; i++) {
				expect(mockRequest).toHaveBeenNthCalledWith(i, ...expectedRequestParams);
			}
		});
	});

	describe('fetchDataAris', () => {
		it('successfully makes request to batch ari endpoint with success resolves', async () => {
			mockRequest.mockImplementationOnce(async () => [
				successfulResponse,
				successfulResponse,
				successfulResponse,
			]);
			const client = new SmartCardClient();
			const responses = await client.fetchDataAris([
				`ari:cloud:confluence:abcd:page:1234`,
				`ari:cloud:confluence:abcd:blogpost:5678`,
				`ari:cloud:confluence:abcd:comment:9012`,
			]);
			expect(mockRequest).toBeCalledTimes(1);
			expect(mockRequest).toBeCalledWith(
				'post',
				expectedDefaultResolveAriBatchUrl,
				[
					{
						ari: `ari:cloud:confluence:abcd:page:1234`,
					},
					{
						ari: `ari:cloud:confluence:abcd:blogpost:5678`,
					},
					{
						ari: `ari:cloud:confluence:abcd:comment:9012`,
					},
				],
				{},
			);

			expect(responses).toEqual([successfulResponse, successfulResponse, successfulResponse]);
		});

		it('successfully makes request to batch ari endpoint even with fail resolves', async () => {
			mockRequest.mockImplementationOnce(async () => [
				notFoundResponse,
				unauthorizedResponse,
				errorResponse,
			]);
			const client = new SmartCardClient();
			const responses = await client.fetchDataAris([
				`ari:cloud:confluence:abcd:page:1234`,
				`ari:cloud:confluence:abcd:blogpost:5678`,
				`ari:cloud:confluence:abcd:comment:9012`,
			]);
			expect(mockRequest).toBeCalledTimes(1);
			expect(mockRequest).toBeCalledWith(
				'post',
				expectedDefaultResolveAriBatchUrl,
				[
					{
						ari: `ari:cloud:confluence:abcd:page:1234`,
					},
					{
						ari: `ari:cloud:confluence:abcd:blogpost:5678`,
					},
					{
						ari: `ari:cloud:confluence:abcd:comment:9012`,
					},
				],
				{},
			);

			expect(responses).toEqual([notFoundResponse, unauthorizedResponse, errorResponse]);
		});

		it('successfully deduplicates request to batch ari endpoint ', async () => {
			mockRequest.mockImplementationOnce(async () => [successfulResponse, unauthorizedResponse]);
			const client = new SmartCardClient();
			const responses = await client.fetchDataAris([
				`ari:cloud:confluence:abcd:page:1234`,
				`ari:cloud:confluence:abcd:page:1234`,
				`ari:cloud:confluence:abcd:comment:9012`,
			]);
			expect(mockRequest).toBeCalledTimes(1);
			expect(mockRequest).toBeCalledWith(
				'post',
				expectedDefaultResolveAriBatchUrl,
				[
					{
						ari: `ari:cloud:confluence:abcd:page:1234`,
					},
					{
						ari: `ari:cloud:confluence:abcd:comment:9012`,
					},
				],
				{},
			);

			// NOTE: we still expect all three responses to be the same
			expect(responses).toEqual([successfulResponse, successfulResponse, unauthorizedResponse]);
		});

		it('successfully returns batch response when request to batch ari endpoint fails', async () => {
			const error = {
				status: 400,
				error: 'some-error',
				message: 'error-message',
			};
			const errorResponse = {
				status: 400,
				error: error,
			};
			mockRequest.mockImplementationOnce(async () => Promise.reject(error));
			const client = new SmartCardClient();
			const responses = await client.fetchDataAris([
				`ari:cloud:confluence:abcd:page:1234`,
				`ari:cloud:confluence:abcd:page:1234`,
				`ari:cloud:confluence:abcd:comment:9012`,
			]);
			expect(mockRequest).toBeCalledTimes(1);
			expect(mockRequest).toBeCalledWith(
				'post',
				expectedDefaultResolveAriBatchUrl,
				[
					{
						ari: `ari:cloud:confluence:abcd:page:1234`,
					},
					{
						ari: `ari:cloud:confluence:abcd:comment:9012`,
					},
				],
				{},
			);

			// any endpoint failure will still map errors into a batch response
			expect(responses).toEqual([errorResponse, errorResponse, errorResponse]);
		});
	});
});

describe('Smart Card Client with url caching', () => {
	it('should not make second call for the same url when response is successful', async () => {
		mockRequest.mockImplementation(mockRequestFn);
		const client = new SmartCardClient();

		// Since there is one call (notSupported) that will throw an exception, we can't use Promise.all
		// But we do want them all end up in the same batch.
		const firstSuccessResponsePromise = client.fetchData(`${hostname}/first/success`);
		const secondSuccessResponsePromise = client.fetchData(`${hostname}/second/success`);
		const notFoundResponsePromise = client.fetchData(`${hostname}/notFound`);
		const forbiddenResponsePromise = client.fetchData(`${hostname}/forbidden`);
		const unauthResponsePromise = client.fetchData(`${hostname}/unauthorized`);
		const notSupportedPromise = client.fetchData(`${hostname}/notSupported`);

		const [
			firstSuccessResponse,
			secondSuccessResponse,
			notFoundResponse,
			forbiddenResponse,
			unauthResponse,
		] = await Promise.all([
			firstSuccessResponsePromise,
			secondSuccessResponsePromise,
			notFoundResponsePromise,
			forbiddenResponsePromise,
			unauthResponsePromise,
		]);

		try {
			await notSupportedPromise;
		} catch (apiError: any) {
			expect(apiError.type).toEqual('ResolveUnsupportedError');
		}

		expect(mockRequest).toBeCalledTimes(1);
		expect(mockRequest).toBeCalledWith(
			'post',
			expectedDefaultResolveBatchUrl,
			[
				{
					resourceUrl: `${hostname}/first/success`,
				},
				{
					resourceUrl: `${hostname}/second/success`,
				},
				{
					resourceUrl: `${hostname}/notFound`,
				},
				{
					resourceUrl: `${hostname}/forbidden`,
				},
				{
					resourceUrl: `${hostname}/unauthorized`,
				},
				{
					resourceUrl: `${hostname}/notSupported`,
				},
			],
			{},
		);
		expect(firstSuccessResponse).toBe(mocks.success);
		expect(secondSuccessResponse).toBe(mocks.success);
		expect(notFoundResponse).toBe(mocks.notFound);
		expect(forbiddenResponse).toBe(mocks.forbidden);
		expect(unauthResponse).toBe(mocks.unauthorized);
		expect(unauthResponse).toBe(mocks.unauthorized);

		const firstSuccessSecondResponsePromise = client.fetchData(`${hostname}/first/success`);
		const thirdSuccessResponsePromise = client.fetchData(`${hostname}/third/success`);
		const notFoundSecondResponsePromise = client.fetchData(`${hostname}/notFound`);
		const forbiddenSecondResponsePromise = client.fetchData(`${hostname}/forbidden`);
		const unauthSecondResponsePromise = client.fetchData(`${hostname}/unauthorized`);
		const notSupportedSecondPromise = client.fetchData(`${hostname}/notSupported`);

		const [
			firstSuccessSecondResponse,
			thirdSuccessResponse,
			notFoundSecondResponse,
			forbiddenSecondResponse,
			unauthSecondResponse,
		] = await Promise.all([
			firstSuccessSecondResponsePromise,
			thirdSuccessResponsePromise,
			notFoundSecondResponsePromise,
			forbiddenSecondResponsePromise,
			unauthSecondResponsePromise,
		]);

		try {
			await notSupportedSecondPromise;
		} catch (apiError: any) {
			expect(apiError.type).toEqual('ResolveUnsupportedError');
		}

		expect(mockRequest).toBeCalledTimes(2);

		expect(mockRequest).toBeCalledWith(
			'post',
			expectedDefaultResolveBatchUrl,
			[
				// First url was already requested before and shuoldn't happen again.
				// {
				//   resourceUrl: `first.${hostname}/success`,
				// },

				// This is new url, so it should go ahead
				{
					resourceUrl: `${hostname}/third/success`,
				},

				// All non-success cases shouldn't be cached and so be called again.
				{
					resourceUrl: `${hostname}/notFound`,
				},
				{
					resourceUrl: `${hostname}/forbidden`,
				},
				{
					resourceUrl: `${hostname}/unauthorized`,
				},
				{
					resourceUrl: `${hostname}/notSupported`,
				},
			],
			{},
		);

		expect(firstSuccessSecondResponse).toBe(mocks.success);
		expect(thirdSuccessResponse).toBe(mocks.success);
		expect(notFoundSecondResponse).toBe(mocks.notFound);
		expect(forbiddenSecondResponse).toBe(mocks.forbidden);
		expect(unauthSecondResponse).toBe(mocks.unauthorized);
	});

	it('should make second call for the same url when response is successful if force flag is set', async () => {
		mockRequest.mockImplementation(mockRequestFn);
		const client = new SmartCardClient();

		const firstSuccessResponse = await client.fetchData(`${hostname}/first/success`, true);

		const firstSuccessSecondResponse = await client.fetchData(`${hostname}/first/success`, true);

		expect(firstSuccessResponse).toBe(mocks.success);
		expect(firstSuccessSecondResponse).toBe(mocks.success);

		expect(mockRequest).toBeCalledTimes(2);
		expect(mockRequest.mock.calls[0]).toEqual([
			'post',
			expectedDefaultResolveBatchUrl,
			[
				{
					resourceUrl: `${hostname}/first/success`,
				},
			],
			{},
		]);
		expect(mockRequest.mock.calls[1]).toEqual([
			'post',
			expectedDefaultResolveBatchUrl,
			[
				{
					resourceUrl: `${hostname}/first/success`,
				},
			],
			{},
		]);
	});

	it('should have limited cache', async () => {
		mockRequest.mockImplementation(mockRequestFn);
		const client = new SmartCardClient();

		// Requests 0..99. Should fill in full cache
		const requestPromises = Array(100)
			.fill(null)
			.map((_, i) => client.fetchData(`${hostname}/${i}/success`));
		await Promise.all(requestPromises);
		// Two batches of 50
		expect(mockRequest).toBeCalledTimes(2);

		// Requests 100..109. Should remove first 10 cached requests out.
		const requestPromises2 = Array(10)
			.fill(null)
			.map((_, i) => client.fetchData(`${hostname}/${i + 100}/success`));
		await Promise.all(requestPromises2);
		expect(mockRequest).toBeCalledTimes(3);

		// Requests 0..09
		const requestPromises3 = Array(10)
			.fill(null)
			.map((_, i) => client.fetchData(`${hostname}/${i}/success`));
		await Promise.all(requestPromises3);
		// If cache was unlimited these results would be taken from cache and next assertion would fail.
		expect(mockRequest).toBeCalledTimes(4);
	});

	it('should not initiate second call for the same url if already in progress', async () => {
		let delayedPromiseResolve1: Function = () => {};
		let delayedPromiseResolve2: Function = () => {};

		const delayedPromise1 = new Promise((resolve) => {
			delayedPromiseResolve1 = resolve;
		});
		const delayedPromise2 = new Promise((resolve) => {
			delayedPromiseResolve2 = resolve;
		});

		mockRequest.mockReturnValueOnce(delayedPromise1);
		mockRequest.mockReturnValueOnce(delayedPromise2);

		const client = new SmartCardClient();

		const firstSuccessResponsePromise = client.fetchData(`${hostname}/first/success`);

		await flushPromises();

		const secondSuccessResponsePromise = client.fetchData(`${hostname}/first/success`);

		delayedPromiseResolve1([successfulResponse]);

		const firstSuccessResponse = await firstSuccessResponsePromise;

		delayedPromiseResolve2([successfulResponse]);

		const secondSuccessResponse = await secondSuccessResponsePromise;

		expect(mockRequest).toBeCalledTimes(1);
		expect(mockRequest).toBeCalledWith(
			'post',
			expectedDefaultResolveBatchUrl,
			[
				{
					resourceUrl: `${hostname}/first/success`,
				},
			],
			{},
		);
		expect(firstSuccessResponse).toBe(mocks.success);
		expect(secondSuccessResponse).toBe(mocks.success);
	});

	it('should not cache request that end with promise rejection', async () => {
		mockRequest.mockRejectedValueOnce([new Error('some error')]);
		mockRequest.mockResolvedValueOnce([successfulResponse]);

		const client = new SmartCardClient();

		const failedResponsePromise = client.fetchData(`${hostname}/first/success`);

		await flushPromises();

		try {
			await failedResponsePromise;
		} catch (e) {
			expect(e).toEqual(expect.any(Error));
		}

		const successResponsePromise = await client.fetchData(`${hostname}/first/success`);

		expect(mockRequest).toBeCalledTimes(2);
		expect(mockRequest).toBeCalledWith(
			'post',
			expectedDefaultResolveBatchUrl,
			[
				{
					resourceUrl: `${hostname}/first/success`,
				},
			],
			{},
		);
		expect(successResponsePromise).toBe(mocks.success);
	});

	it('should use cache between prefetchData and fetchData calls', async () => {
		let delayedPromiseResolve1: Function = () => {};
		let delayedPromiseResolve2: Function = () => {};

		const delayedPromise1 = new Promise((resolve) => {
			delayedPromiseResolve1 = resolve;
		});
		const delayedPromise2 = new Promise((resolve) => {
			delayedPromiseResolve2 = resolve;
		});

		mockRequest.mockReturnValueOnce(delayedPromise1);
		mockRequest.mockReturnValueOnce(delayedPromise2);

		const client = new SmartCardClient();

		const firstSuccessResponsePromise = client.fetchData(`${hostname}/first/success`);

		await flushPromises();

		const secondSuccessResponsePromise = client.prefetchData(`${hostname}/first/success`);

		delayedPromiseResolve1([successfulResponse]);

		const firstSuccessResponse = await firstSuccessResponsePromise;

		delayedPromiseResolve2([successfulResponse]);

		const secondSuccessResponse = await secondSuccessResponsePromise;

		expect(mockRequest).toBeCalledTimes(1);
		expect(mockRequest).toBeCalledWith(
			'post',
			expectedDefaultResolveBatchUrl,
			[
				{
					resourceUrl: `${hostname}/first/success`,
				},
			],
			{},
		);
		expect(firstSuccessResponse).toBe(mocks.success);
		expect(secondSuccessResponse).toBe(mocks.success);
	});
});

describe('isSuccessfulResponse()', () => {
	it('should handle not valid responses', () => {
		expect(isSuccessfulResponse(undefined as any)).toBeFalsy();
		expect(isSuccessfulResponse(null as any)).toBeFalsy();
		expect(isSuccessfulResponse({} as any)).toBeFalsy();
	});

	it('should return true for valid responses', () => {
		const successResponse: SuccessResponse = {
			body: {} as any,
			status: 200,
		};
		expect(isSuccessfulResponse(successResponse)).toBeTruthy();
	});
});
