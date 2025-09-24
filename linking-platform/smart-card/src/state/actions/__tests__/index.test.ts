// eslint-disable-next-line import/order
import * as testMocks from './index.test.mock';

import { renderHook } from '@testing-library/react-hooks';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { type CardContext, useSmartLinkContext } from '@atlaskit/link-provider';
import { ACTION_RESOLVING, APIError, type APIErrorKind } from '@atlaskit/linking-common';
import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { mocks } from '../../../utils/mocks';
import { type CardState } from '../../types';
import { useSmartCardActions } from '../index';

describe('Smart Card: Actions', () => {
	let url: string;
	let id: string;
	let mockContext: CardContext;
	const mockFetchData = (response: Promise<JsonLd.Response | undefined>) => {
		let deferrable: Promise<JsonLd.Response | undefined> = Promise.resolve(undefined);

		const fn = async () => {
			deferrable = Promise.resolve(response);
			return response;
		};

		(mockContext.connections.client.fetchData as jest.Mock).mockImplementationOnce(fn);

		return {
			promise: deferrable,
			flush: () => new Promise((resolve) => process.nextTick(resolve)),
		};
	};
	const mockState = (state: CardState) => {
		(mockContext.store.getState as jest.Mock).mockImplementation(() => ({
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

	describe('register()', () => {
		it('dispatches pending action if card not in store', async () => {
			mockFetchData(Promise.resolve(mocks.success));

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});
			await result.current.register();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith({
				payload: undefined,
				type: ACTION_RESOLVING,
				url: 'https://some/url',
			});
		});

		ffTest.on('platform_initial_data_for_smart_cards', '', () => {
			it('will not set pending state when placeholder data is provided', async () => {
				mockFetchData(Promise.resolve(mocks.success));

				const { result } = renderHook(() => {
					return useSmartCardActions(id, url, {
						status: 'resolved',
						metadataStatus: undefined,
						details: mocks.success,
					});
				});
				await result.current.register();

				expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
				expect(mockContext.store.dispatch).not.toHaveBeenCalledWith(
					expect.objectContaining({
						type: ACTION_RESOLVING,
					}),
				);
			});
		});
	});

	describe('resolve()', () => {
		it('throws (allowing editor to handle) if resolving fails and there is no previous data', async () => {
			const mockError = new APIError('fatal', 'https://my.url', '0xBAADF00D');
			mockFetchData(Promise.reject(mockError));
			mockState({
				status: 'pending',
				details: undefined,
			});

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});
			const promise = result.current.register();
			await expect(promise).rejects.toThrow(Error);
			await expect(promise).rejects.toHaveProperty('kind', 'fatal');

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(3);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith({
				payload: undefined,
				type: 'resolving',
				url: 'https://some/url',
			});
			// Assert that we dispatch an action to update card state to fatally errored
			expect(mockContext.store.dispatch).toHaveBeenCalledWith({
				payload: undefined,
				type: 'errored',
				url: 'https://some/url',
				error: new APIError('fatal', 'https://some/url', '0xBAADF00D'),
			});
		});

		it('dispatches resolved action when data successfully fetched', async () => {
			mockFetchData(Promise.resolve(mocks.success));
			mockState({
				status: 'pending',
				details: undefined,
			});

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});
			await result.current.register();

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(4);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'resolved',
					url: 'https://some/url',
					payload: mocks.success,
				}),
			);
		});

		it('should call fetch with force flag when reload API invoked', async () => {
			const deferrable = mockFetchData(Promise.resolve(mocks.success));
			mockState({
				status: 'resolved',
				details: mocks.success,
			});

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			result.current.reload();
			await deferrable.promise;
			await deferrable.flush();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, true);
		});

		it('dispatches reloading action when reload API invoked', async () => {
			const deferrable = mockFetchData(Promise.resolve(mocks.success));
			mockState({
				status: 'resolved',
				details: mocks.success,
			});

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			result.current.reload();

			await deferrable.promise;
			await deferrable.flush();

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'reloading',
					url: 'https://some/url',
					payload: mocks.success,
				}),
			);
		});

		it('resolves to authentication error data if resolving failed for auth reasons', async () => {
			const mockError = new APIError('auth', 'https://my.url', 'YOU SHALL NOT PASS');
			mockFetchData(Promise.reject(mockError));
			mockState({
				status: 'pending',
				details: undefined,
			});

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});
			const promise = result.current.register();
			await expect(promise).resolves.toBeUndefined();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(3);
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

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.register();
			await expect(promise).resolves.toBeUndefined();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(3);
			expect(mockContext.store.dispatch).nthCalledWith(3, {
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

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.register();
			await expect(promise).resolves.toBeUndefined();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(3);
			expect(mockContext.store.dispatch).nthCalledWith(3, {
				type: 'fallback',
				url: 'https://some/url',
				error: new APIError('fallback', 'https://some', 'Provider.authFlow is not set to OAuth2.'),
				payload: mocks.forbidden,
			});
		});

		it('resolves to error data response is undefined', async () => {
			mockFetchData(Promise.resolve(undefined));
			mockState({
				status: 'pending',
				details: undefined,
			});

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.register();
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

	describe('loadMetadata()', () => {
		beforeEach(() => {
			mockState({
				status: 'resolved',
				details: mocks.success,
			});
		});

		it('dispatches resolved metadata state for a success response', async () => {
			mockFetchData(Promise.resolve(mocks.success));

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.loadMetadata();
			await expect(promise).resolves.toBeUndefined();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(3);
			expect(mockContext.store.dispatch).toHaveBeenNthCalledWith(1, {
				payload: undefined,
				type: 'metadata',
				url: url,
				error: undefined,
				metadataStatus: 'pending',
			});
			expect(mockContext.store.dispatch).toHaveBeenNthCalledWith(2, {
				payload: undefined,
				type: 'metadata',
				url: url,
				error: undefined,
				metadataStatus: 'resolved',
			});
			expect(mockContext.store.dispatch).toHaveBeenNthCalledWith(3, {
				payload: mocks.success,
				type: 'resolved',
				url: url,
				error: undefined,
				metadataStatus: undefined,
				ignoreStatusCheck: true,
			});
		});

		const errorKinds: APIErrorKind[] = ['fatal', 'auth', 'error', 'fallback'];
		it.each(errorKinds)(
			'dispatches error metadata state if response is a %s error',
			async (errorKind) => {
				const mockError = new APIError(errorKind, url, 'error-message');
				mockFetchData(Promise.reject(mockError));

				const { result } = renderHook(() => {
					return useSmartCardActions(id, url);
				});

				const promise = result.current.loadMetadata();

				await expect(promise).resolves.toBeUndefined();
				expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
				expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
				expect(mockContext.store.dispatch).toHaveBeenNthCalledWith(1, {
					payload: undefined,
					type: 'metadata',
					url: url,
					error: undefined,
					metadataStatus: 'pending',
				});
				expect(mockContext.store.dispatch).toHaveBeenNthCalledWith(2, {
					payload: undefined,
					type: 'metadata',
					url: url,
					error: undefined,
					metadataStatus: 'errored',
				});
			},
		);

		const responseKinds: Array<[string, JsonLd.Response]> = [
			['forbidden', mocks.forbidden],
			['unauthorized', mocks.unauthorized],
			['notFound', mocks.notFound],
		];
		it.each(responseKinds)(
			'dispatches error metadata state if response is a %s response',
			async (name, responseKind) => {
				mockFetchData(Promise.resolve(responseKind));

				const { result } = renderHook(() => {
					return useSmartCardActions(id, url);
				});

				const promise = result.current.loadMetadata();

				await expect(promise).resolves.toBeUndefined();
				expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
				expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
				expect(mockContext.store.dispatch).toHaveBeenNthCalledWith(1, {
					payload: undefined,
					type: 'metadata',
					url: url,
					error: undefined,
					metadataStatus: 'pending',
				});
				expect(mockContext.store.dispatch).toHaveBeenNthCalledWith(2, {
					payload: undefined,
					type: 'metadata',
					url: url,
					error: undefined,
					metadataStatus: 'errored',
				});
			},
		);

		it('dispatches error metadata status if response is undefined', async () => {
			mockFetchData(Promise.resolve(undefined));

			const { result } = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.loadMetadata();

			await expect(promise).resolves.toBeUndefined();
			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false);
			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
			expect(mockContext.store.dispatch).toHaveBeenNthCalledWith(1, {
				payload: undefined,
				type: 'metadata',
				url: url,
				error: undefined,
				metadataStatus: 'pending',
			});
			expect(mockContext.store.dispatch).toHaveBeenNthCalledWith(2, {
				payload: undefined,
				type: 'metadata',
				url: url,
				error: undefined,
				metadataStatus: 'errored',
			});
		});
	});
});
