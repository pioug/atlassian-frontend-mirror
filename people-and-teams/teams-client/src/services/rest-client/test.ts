import { HttpError, SLOIgnoreError } from '../../common/utils/error';
import { statusCodeHandlersProvider } from '../../common/utils/status-code-handlers-provider';

import { clearCookie, getCookieAsInteger, REDIRECT_COUNT } from './utils/cookie';
import { parseErrorMessage } from './utils/parse-error-message';

import { resetRedirectCountOnceFlag, RestClient } from './index';

const fetch = fetchMock;

const mockFetchOnce = (data = {}, config = {}) => {
	const body = typeof data === 'object' ? JSON.stringify(data) : (data as string);
	return fetch.once(body, {
		headers: {
			'content-type': 'application/json',
		},
		...config,
	});
};

const mockFetch = (data = {}, config = {}) => {
	const body = typeof data === 'object' ? JSON.stringify(data) : (data as string);
	return fetch.mockResponse(body, {
		headers: {
			'content-type': 'application/json',
		},
		...config,
	});
};

describe('(Common) RestClient', () => {
	let restClient: typeof RestClient.prototype;

	beforeEach(() => {
		restClient = new RestClient({ serviceUrl: '' });
		fetch.resetMocks();
	});

	afterEach(() => {
		resetRedirectCountOnceFlag();
		clearCookie(REDIRECT_COUNT);
	});

	describe('makeRequest', () => {
		test('retries', async () => {
			fetch
				.mockResponseOnce('{}', { status: 500 })
				.mockResponseOnce('{}', { status: 503 })
				.mockResponseOnce('{}', { status: 599 })
				.mockResponseOnce('{}', { status: 200 });
			await restClient.makeRequest('/mocks');

			// initial call + 3 retries
			expect(fetch).toHaveBeenCalledTimes(4);
		});
	});

	describe('getResource', () => {
		test('should return the parsed json body', async () => {
			const data = { key: 'value' };
			mockFetchOnce(data);
			const res = await restClient.getResource('/mocks');
			expect(res).toEqual(data);
		});

		test('should return the parsed string body without content type in header', async () => {
			// fetchMock.get('/mocks', 'hello world');
			mockFetchOnce('hello world', { headers: {} });
			const res = await restClient.getResource('/mocks');
			expect(res).toEqual('hello world');
		});

		test('should return the parsed string body with content type in header', async () => {
			mockFetchOnce('hello world', {
				headers: {
					'content-type': 'text/plain',
				},
			});
			const res = await restClient.getResource('/mocks');
			expect(res).toEqual('hello world');
		});

		test('should not try to parse 204 responses', async () => {
			mockFetchOnce('hello world', {
				status: 204,
			});
			const res = await restClient.getResource('/mocks');
			expect(res).toEqual(null);
		});

		test('should throw an error when the response is not in the 200 range', async () => {
			mockFetch('error', {
				status: 500,
			});

			let caughtError;
			try {
				await restClient.getResource('/mocks');
			} catch (error) {
				caughtError = error;
			}

			expect((caughtError as Error).message).toBe('error');
			expect(caughtError).toBeInstanceOf(HttpError);
		});

		test('should call the 401 handler if provided', async () => {
			mockFetchOnce('error', {
				status: 401,
			});
			const onUnauthorised = jest.fn();
			statusCodeHandlersProvider.setHandlers({ 401: onUnauthorised });
			restClient = new RestClient({ serviceUrl: '' });
			let caughtError;
			try {
				await restClient.getResource('/mocks');
			} catch (error) {
				caughtError = error;
			}

			expect(statusCodeHandlersProvider.get()[401]).toBe(onUnauthorised);
			expect(caughtError).toBeInstanceOf(SLOIgnoreError);
			expect(onUnauthorised).toHaveBeenCalledTimes(1);
		});

		test('should scrub "timestamp" field from error text response on get, for sentry dedup', async () => {
			const text =
				'{"timestamp":"2017-11-13T04:31:01.906+0000","status":401,"error":"Unauthorized","message":"m"}';
			mockFetch(text, { status: 500 });

			let caughtError: any;
			try {
				await restClient.getResource('/mocks');
			} catch (error) {
				caughtError = error;
			}
			expect(caughtError).toBeInstanceOf(HttpError);
			expect(caughtError.status).toEqual(500);
			expect(caughtError.message).toEqual('401 Unauthorized');
		});

		test('should set redirect count on 401 failure and recover on success', async () => {
			mockFetchOnce('error', { status: 401 });
			mockFetchOnce({ key: 'value' });

			try {
				await restClient.getResource('/mocks');
			} catch (error) {}
			expect(getCookieAsInteger(REDIRECT_COUNT)).toEqual(1);
			expect(await restClient.postResource('/mocks')).toEqual({
				key: 'value',
			});
		});

		test('multiple fail calls only increment the count once', async () => {
			mockFetchOnce('error', { status: 401 });
			mockFetchOnce('error', { status: 401 });
			mockFetchOnce('error', { status: 401 });

			try {
				await restClient.getResource('/mocks');
			} catch (error) {}

			try {
				await restClient.getResource('/mocks');
			} catch (error) {}

			try {
				await restClient.getResource('/mocks');
			} catch (error) {}

			expect(getCookieAsInteger(REDIRECT_COUNT)).toEqual(1);
		});
	});

	describe('postResource', () => {
		test('should send a post request', async () => {
			mockFetchOnce({ key: 'value' });
			expect(await restClient.postResource('/mocks')).toEqual({
				key: 'value',
			});
		});

		test('should pass additional headers when posting data', () => {
			mockFetchOnce();

			restClient.postResource('/mock', { key: 'value' });

			expect(fetch.mock.calls[0][1]).toMatchObject({
				method: 'post',
				body: '{"key":"value"}',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		});
	});

	describe('putResource', () => {
		test('should send a put request', async () => {
			mockFetchOnce({ key: 'value' });
			expect(await restClient.putResource('/mocks')).toEqual({
				key: 'value',
			});
		});

		test('should pass additional headers when putting data', async () => {
			mockFetchOnce();
			await restClient.putResource('/mock', { key: 'value' });

			expect(fetch.mock.calls[0][1]).toMatchObject({
				method: 'put',
				body: '{"key":"value"}',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		});
	});

	describe('parseErrorMessage', () => {
		const errMsg = 'This is an error message';

		const mockResponse = (body: any) => {
			const blob = new Blob([JSON.stringify(body)], {
				type: 'application/json',
			});
			return new Response(blob, { status: 400 });
		};

		const getMessage = async (body: any) => await parseErrorMessage(mockResponse(body));

		test('Set string array as error message', async () => {
			const result = await getMessage({ errors: [errMsg] });
			expect(result).toEqual(errMsg);
		});

		test('Set response code as error message', async () => {
			const result = await getMessage({ errors: [{ code: errMsg }] });
			expect(result).toEqual(errMsg);
		});

		test('Set response message as error message', async () => {
			const result = await getMessage({ errors: [{ message: errMsg }] });
			expect(result).toEqual(errMsg);
		});

		test('Set fallback code as error message', async () => {
			const result = await getMessage({ errors: [{ missing: 'error keys' }] });
			expect(result).toEqual('MISSING_ERROR_MESSAGE');
		});
	});
});
