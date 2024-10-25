// eslint-disable-next-line import/order
import * as testMocks from './index.test.mock';

import { renderHook } from '@testing-library/react-hooks';
import { type JsonLd } from 'json-ld-types';

import { useSmartLinkContext } from '@atlaskit/link-provider';
import { APIError, type CardState } from '@atlaskit/linking-common';
import { asMockFunction } from '@atlaskit/media-test-helpers';
import { type CardContext } from '@atlaskit/smart-card';

import { mocks } from '../../../../utils/mocks';
import useResolve from '../index';

describe('useResolve', () => {
	let url: string;
	let id: string;
	let mockContext: CardContext;

	const mockFetchData = (responsePromise: Promise<JsonLd.Response>) => {
		asMockFunction(mockContext.connections.client.fetchData).mockReturnValue(responsePromise);

		return {
			promise: responsePromise,
			flush: () => new Promise((resolve) => process.nextTick(resolve)),
		};
	};

	const mockState = (state: CardState) => {
		asMockFunction(mockContext.store.getState).mockImplementationOnce(() => ({
			[url]: state,
		}));
	};

	beforeEach(() => {
		mockContext = testMocks.mockGetContext();
		asMockFunction(useSmartLinkContext).mockImplementation(() => mockContext);
		url = 'https://some/url';
		id = 'my-id';
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should call fetch when there is no data in the store', async () => {
		mockFetchData(Promise.resolve(mocks.success));
		mockState({
			status: 'pending',
			details: undefined,
		});

		const resolve = renderHook(() => useResolve()).result.current;
		await resolve(url, false, false, id);

		expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);

		expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'metadata',
				url: 'https://some/url',
				payload: undefined,
				error: undefined,
				metadataStatus: 'resolved',
			}),
		);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'resolved',
				url: 'https://some/url',
				payload: mocks.success,
				error: undefined,
				metadataStatus: undefined,
			}),
		);
	});

	it('should call fetch when isReloading flag is true', async () => {
		mockFetchData(Promise.resolve(mocks.success));
		mockState({
			status: 'resolved',
			details: mocks.success,
		});

		const resolve = renderHook(() => useResolve()).result.current;
		await resolve(url, true, false, id);

		expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, true);
		expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'metadata',
				url: 'https://some/url',
				payload: undefined,
				error: undefined,
				metadataStatus: 'resolved',
			}),
		);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'reloading',
				url: 'https://some/url',
				payload: mocks.success,
			}),
		);
	});

	it('should call fetch when isMetadataRequest flag is true', async () => {
		mockFetchData(Promise.resolve(mocks.success));
		mockState({
			status: 'resolved',
			details: mocks.success,
		});

		const resolve = renderHook(() => useResolve()).result.current;
		await resolve(url, false, true, id);

		expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
		expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'metadata',
				url: 'https://some/url',
				payload: undefined,
				error: undefined,
				metadataStatus: 'resolved',
			}),
		);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'resolved',
				url: 'https://some/url',
				payload: mocks.success,
				error: undefined,
				metadataStatus: undefined,
				ignoreStatusCheck: true,
			}),
		);
	});

	it('throws (allowing editor to handle) if resolving fails and there is no previous data', async () => {
		const mockError = new APIError('fatal', 'https://my.url', '0xBAADF00D');
		mockFetchData(Promise.reject(mockError));
		mockState({
			status: 'pending',
			details: undefined,
		});

		const resolve = renderHook(() => useResolve()).result.current;
		const promise = resolve(url, false, false, id);
		await expect(promise).rejects.toThrow(Error);
		await expect(promise).rejects.toHaveProperty('kind', 'fatal');

		expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);

		// Assert that we dispatch an action to update card state to fatally errored
		expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith({
			payload: undefined,
			type: 'errored',
			url: 'https://some/url',
			error: new APIError('fatal', 'https://some/url', '0xBAADF00D'),
		});
	});

	it('resolves to authentication error data if resolving failed for auth reasons', async () => {
		const mockError = new APIError('auth', 'https://my.url', 'YOU SHALL NOT PASS');
		mockFetchData(Promise.reject(mockError));
		mockState({
			status: 'pending',
			details: undefined,
		});

		const resolve = renderHook(() => useResolve()).result.current;
		const promise = resolve(url, false, false, id);
		await expect(promise).resolves.toBeUndefined();

		expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith({
			payload: {
				meta: {
					access: 'unauthorized',
					auth: [],
					definitionId: 'provider-not-found',
					visibility: 'restricted',
				},
				data: {
					'@context': {
						'@vocab': 'https://www.w3.org/ns/activitystreams#',
						atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
						schema: 'http://schema.org/',
					},
					'@type': 'Object',
				},
			},
			type: 'resolved',
			url: 'https://some/url',
		});
	});

	it('resolves to error data if no authFlow is available and authorisation is required (unauthorized)', async () => {
		mockContext = {
			...mockContext,
			config: {
				...mockContext.config,
				authFlow: 'disabled',
			},
		};
		mockFetchData(Promise.resolve(mocks.unauthorized));
		mockState({
			status: 'unauthorized',
			details: undefined,
		});

		const resolve = renderHook(() => useResolve()).result.current;
		const promise = resolve(url, false, false, id);
		await expect(promise).resolves.toBeUndefined();

		expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith({
			type: 'fallback',
			url: 'https://some/url',
			error: new APIError('fallback', 'https://some', 'Provider.authFlow is not set to OAuth2.'),
			payload: mocks.unauthorized,
		});
	});

	it('resolves to error data if no authFlow is available and authorisation is required (forbidden)', async () => {
		mockContext = {
			...mockContext,
			config: {
				...mockContext.config,
				authFlow: 'disabled',
			},
		};
		mockFetchData(Promise.resolve(mocks.forbidden));
		mockState({
			status: 'forbidden',
			details: undefined,
		});

		const resolve = renderHook(() => useResolve()).result.current;
		const promise = resolve(url, false, false, id);
		await expect(promise).resolves.toBeUndefined();

		expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
		expect(mockContext.store.dispatch).toHaveBeenCalledWith({
			type: 'fallback',
			url: 'https://some/url',
			error: new APIError('fallback', 'https://some', 'Provider.authFlow is not set to OAuth2.'),
			payload: mocks.forbidden,
		});
	});

	it('resolves to error if data response is undefined', async () => {
		mockFetchData(Promise.resolve(undefined as any));
		mockState({
			status: 'pending',
			details: undefined,
		});

		const resolve = renderHook(() => useResolve()).result.current;
		const promise = resolve(url, false, false, id);

		expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
		await expect(promise).rejects.toBeInstanceOf(Error);
		await expect(promise).rejects.toHaveProperty('kind', 'fatal');

		expect(mockContext.store.dispatch).toHaveBeenCalledWith({
			payload: undefined,
			type: 'errored',
			url: 'https://some/url',
			error: new APIError('fatal', 'https://some/url', 'Fatal error resolving URL'),
		});
	});
});
