// eslint-disable-next-line import/order
import * as testMocks from './index.test.mock';

import { type JsonLd } from '@atlaskit/json-ld-types';
import { type CardContext, useSmartLinkContext } from '@atlaskit/link-provider';
import { flushPromises } from '@atlaskit/link-test-helpers';
import { ACTION_RESOLVING, APIError, type APIErrorKind } from '@atlaskit/linking-common';
import { asMockFunction } from '@atlaskit/media-test-helpers/jestHelpers';
import { auth } from '@atlaskit/outbound-auth-flow-client';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderHook } from '@atlassian/testing-library';

import { mocks } from '../../../utils/mocks';
import * as useActionFlags from '../../hooks/use-action-flags';
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
		asMockFunction(auth).mockResolvedValue();

		url = 'https://some/url';
		id = 'my-id';
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('register()', () => {
		it('dispatches pending action if card not in store', async () => {
			mockFetchData(Promise.resolve(mocks.success));

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});
			await result.current.register();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, undefined);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith({
				payload: undefined,
				type: ACTION_RESOLVING,
				url: 'https://some/url',
			});
		});

		ffTest.on(
			'platform_smartlink_inline_resolve_optimization',
			'when FG is on, register passes appearance to fetchData',
			() => {
				it('passes appearance parameter to fetchData when provided', async () => {
					mockFetchData(Promise.resolve(mocks.success));

					const result = renderHook(() => {
						return useSmartCardActions(id, url);
					});
					await result.current.register('inline');

					expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, 'inline');
				});

				it('passes block appearance for block cards', async () => {
					mockFetchData(Promise.resolve(mocks.success));

					const result = renderHook(() => {
						return useSmartCardActions(id, url);
					});
					await result.current.register('block');

					expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, 'block');
				});
			},
		);
	});

	describe('resolve()', () => {
		it('throws (allowing editor to handle) if resolving fails and there is no previous data', async () => {
			const mockError = new APIError('fatal', 'https://my.url', '0xBAADF00D');
			mockFetchData(Promise.reject(mockError));
			mockState({
				status: 'pending',
				details: undefined,
			});

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});
			const promise = result.current.register();
			await expect(promise).rejects.toThrow(Error);
			await expect(promise).rejects.toHaveProperty('kind', 'fatal');

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, undefined);
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

			const result = renderHook(() => {
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

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			result.current.reload();
			await deferrable.promise;
			await deferrable.flush();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, true, undefined);
		});

		it('dispatches reloading action when reload API invoked', async () => {
			const deferrable = mockFetchData(Promise.resolve(mocks.success));
			mockState({
				status: 'resolved',
				details: mocks.success,
			});

			const result = renderHook(() => {
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

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});
			const promise = result.current.register();
			await expect(promise).resolves.toBeUndefined();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, undefined);
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

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.register();
			await expect(promise).resolves.toBeUndefined();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, undefined);
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

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.register();
			await expect(promise).resolves.toBeUndefined();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, undefined);
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

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.register();
			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, undefined);
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

		it('does not fetch when metadataStatus is already resolved', async () => {
			mockState({
				status: 'resolved',
				details: mocks.success,
				metadataStatus: 'resolved',
			});
			mockFetchData(Promise.resolve(mocks.success));

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			result.current.loadMetadata();

			expect(mockContext.connections.client.fetchData).not.toHaveBeenCalled();
		});

		ffTest.on(
			'platform_smartlink_inline_resolve_optimization',
			'when FG is on, loadMetadata uses resolveNew with block appearance',
			() => {

		it('dispatches resolved metadata state for a success response', async () => {
			mockFetchData(Promise.resolve(mocks.success));

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.loadMetadata();
			await expect(promise).resolves.toBeUndefined();

			// loadMetadata always requests 'block' appearance to get full data including summary
			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, 'block');
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

				const result = renderHook(() => {
					return useSmartCardActions(id, url);
				});

				const promise = result.current.loadMetadata();

				await expect(promise).resolves.toBeUndefined();
				// loadMetadata always requests 'block' appearance to get full data including summary
				expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, 'block');
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

				const result = renderHook(() => {
					return useSmartCardActions(id, url);
				});

				const promise = result.current.loadMetadata();

				await expect(promise).resolves.toBeUndefined();
				// loadMetadata always requests 'block' appearance to get full data including summary
				expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, 'block');
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

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.loadMetadata();

			await expect(promise).resolves.toBeUndefined();
			// loadMetadata always requests 'block' appearance to get full data including summary
			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, 'block');
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

		it('fetches with block appearance when metadataStatus is pending', async () => {
			mockState({
				status: 'resolved',
				details: mocks.success,
				metadataStatus: 'pending',
			});
			mockFetchData(Promise.resolve(mocks.success));

			const result = renderHook(() => {
				return useSmartCardActions(id, url);
			});

			const promise = result.current.loadMetadata();
			await expect(promise).resolves.toBeUndefined();

			expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, 'block');
		});

			}, // end ffTest.on callback
		); // end ffTest.on

		ffTest.off(
			'platform_smartlink_inline_resolve_optimization',
			'when FG is off, loadMetadata uses original resolve without appearance',
			() => {
				it('does not pass appearance when FG is off', async () => {
					mockFetchData(Promise.resolve(mocks.success));

					const result = renderHook(() => {
						return useSmartCardActions(id, url);
					});

					const promise = result.current.loadMetadata();
					await expect(promise).resolves.toBeUndefined();

					expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(url, false, undefined);
				});
			},
		);
	});

	describe('authorize()', () => {
		const setup = async (state: CardState) => {
			const mockShowConnectFlag = jest.fn();
			jest.spyOn(useActionFlags, 'default').mockImplementation(() => ({
				showConnectFlag: mockShowConnectFlag,
			}));
			mockState(state);
			mockFetchData(Promise.resolve(mocks.success));
			const result = renderHook(() => useSmartCardActions(id, url));

			result.current.authorize('inline');
			await flushPromises();

			return { mockShowConnectFlag };
		};

		ffTest.on('platform_sl_connect_account_flag', '', () => {
			it('trigger the connect account flag on unauthorized status', async () => {
				const { mockShowConnectFlag } = await setup({
					status: 'unauthorized',
					details: mocks.unauthorized,
				});

				expect(auth).toHaveBeenCalledWith('https://outbound-auth/flow');
				expect(mockShowConnectFlag).toHaveBeenCalledTimes(1);
			});
		});

		ffTest.off('platform_sl_connect_account_flag', '', () => {
			it('does not trigger the connect account flag on unauthorized status', async () => {
				const { mockShowConnectFlag } = await setup({
					status: 'unauthorized',
					details: mocks.unauthorized,
				});

				expect(auth).toHaveBeenCalledWith('https://outbound-auth/flow');
				expect(mockShowConnectFlag).not.toHaveBeenCalledTimes(1);
			});
		});

		ffTest.both('platform_sl_connect_account_flag', '', () => {
			it('does not trigger the connect account flag on forbidden status', async () => {
				const { mockShowConnectFlag } = await setup({
					status: 'forbidden',
					details: mocks.forbidden,
				});

				expect(auth).toHaveBeenCalledWith('https://outbound-auth/flow');
				expect(mockShowConnectFlag).not.toHaveBeenCalled();
			});
		});
	});

	describe('post-auth Chat auto-open', () => {
		beforeEach(() => {
			jest.clearAllMocks();

			const { expValEquals } = jest.requireMock('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(false);
		});

		const gdriveMockDetails = {
			meta: {
				access: 'unauthorized',
				visibility: 'restricted',
				definitionId: 'd1',
				key: 'google-object-provider',
				auth: [{ key: 'gdrive-oauth', displayName: 'Connect', url: 'https://outbound-auth/flow' }],
			},
			data: {
				'@context': { '@vocab': 'https://www.w3.org/ns/activitystreams#' },
				'@type': 'Object',
				name: 'Q3 Planning Notes',
			},
		};

		const enabledRovoOptions = { isRovoEnabled: true, isRovoLLMEnabled: true };

		const setupPostAuthTest = () => {
			const { expValEquals } = jest.requireMock('@atlaskit/tmp-editor-statsig/exp-val-equals');
			expValEquals.mockReturnValue(true);

			mockContext.rovoOptions = enabledRovoOptions;
			const mockPostMessage = jest.spyOn(window, 'postMessage').mockImplementation(jest.fn());
			const mockShowConnectFlag = jest.fn();
			jest.spyOn(useActionFlags, 'default').mockImplementation(() => ({
				showConnectFlag: mockShowConnectFlag,
			}));

			(mockContext.store.getState as jest.Mock).mockImplementation(() => ({
				[url]: { status: 'unauthorized', details: gdriveMockDetails },
			}));

			return { expValEquals, mockPostMessage, mockShowConnectFlag };
		};

		ffTest.on('platform_sl_3p_post_auth_chat_open_fg', '', () => {
			it('posts chat-new message after successful GDrive auth when gate on + treatment', async () => {
				const { mockPostMessage, mockShowConnectFlag } = setupPostAuthTest();
				url = 'https://docs.google.com/document/d/abc123/edit';
				mockFetchData(Promise.resolve(mocks.success));

				const result = renderHook(() => useSmartCardActions(id, url));
				await result.current.authorize('inline');

				expect(mockPostMessage).toHaveBeenCalledWith(
					{
						eventType: 'rovo-post-message',
						payload: {
							type: 'chat-smartlink-3p-post-auth-launch',
							source: 'smart-link-3p-post-auth',
							data: {
								extensionKey: 'google-drive',
								provider: 'Google Drive',
								projectContext: {
									projectId: url,
									projectName: 'Q3 Planning Notes',
									projectUrl: url,
								},
							},
							openChat: true,
							openChatMode: 'mini-modal',
						},
						payloadId: expect.any(String),
					},
					'*',
				);

				expect(mockShowConnectFlag).not.toHaveBeenCalled();
			});
		});

		ffTest.on('platform_sl_connect_account_flag', '', () => {
			it('does NOT post chat-new message when kill switch is off', async () => {
				const { mockPostMessage, mockShowConnectFlag } = setupPostAuthTest();
				url = 'https://docs.google.com/document/d/abc123/edit';
				mockFetchData(Promise.resolve(mocks.success));

				const result = renderHook(() => useSmartCardActions(id, url));
				await result.current.authorize('inline');

				expect(mockPostMessage).not.toHaveBeenCalled();
				expect(mockShowConnectFlag).toHaveBeenCalled();
			});
		});

		ffTest.on('platform_sl_3p_post_auth_chat_open_fg', '', () => {
			ffTest.on('platform_sl_connect_account_flag', '', () => {
				it('does NOT post chat-new message when in experiment control group', async () => {
					const { expValEquals, mockPostMessage, mockShowConnectFlag } = setupPostAuthTest();
					expValEquals.mockReturnValue(false);
					url = 'https://docs.google.com/document/d/abc123/edit';
					mockFetchData(Promise.resolve(mocks.success));

					const result = renderHook(() => useSmartCardActions(id, url));
					await result.current.authorize('inline');

					expect(expValEquals).toHaveBeenCalledWith(
						'platform_sl_3p_post_auth_chat_open_exp',
						'isEnabled',
						true,
					);
					expect(mockPostMessage).not.toHaveBeenCalled();
					expect(mockShowConnectFlag).toHaveBeenCalled();
				});
			});
		});

		ffTest.on('platform_sl_connect_account_flag', '', () => {
			it('does NOT post chat-new message for non-GDrive providers', async () => {
				const { mockPostMessage, mockShowConnectFlag } = setupPostAuthTest();
				url = 'https://gitlab.com/project/repo';
				const gitlabDetails = {
					...gdriveMockDetails,
					meta: { ...gdriveMockDetails.meta, key: 'gitlab-object-provider' },
				};
				(mockContext.store.getState as jest.Mock).mockImplementation(() => ({
					[url]: { status: 'unauthorized', details: gitlabDetails },
				}));
				mockFetchData(Promise.resolve(mocks.success));

				const result = renderHook(() => useSmartCardActions(id, url));
				await result.current.authorize('inline');

				expect(mockPostMessage).not.toHaveBeenCalled();
				expect(mockShowConnectFlag).toHaveBeenCalled();
			});
		});

		ffTest.on('platform_sl_3p_post_auth_chat_open_fg', '', () => {
			ffTest.on('platform_sl_connect_account_flag', '', () => {
				it('does NOT post chat-new message on non-AI-enabled tenant', async () => {
					const { mockPostMessage, mockShowConnectFlag } = setupPostAuthTest();
					url = 'https://docs.google.com/document/d/abc123/edit';
					(mockContext.store.getState as jest.Mock).mockImplementation(() => ({
						[url]: { status: 'unauthorized', details: gdriveMockDetails },
					}));
					mockContext.rovoOptions = { isRovoEnabled: false, isRovoLLMEnabled: false };
					mockFetchData(Promise.resolve(mocks.success));

					const result = renderHook(() => useSmartCardActions(id, url));
					await result.current.authorize('inline');

					expect(mockPostMessage).not.toHaveBeenCalled();
					expect(mockShowConnectFlag).toHaveBeenCalled();
				});
			});
		});

		it('does NOT post chat-new message for forbidden (try another account) status', async () => {
			const { mockPostMessage, mockShowConnectFlag } = setupPostAuthTest();
			url = 'https://docs.google.com/document/d/abc123/edit';
			const forbiddenDetails = {
				...gdriveMockDetails,
				meta: { ...gdriveMockDetails.meta, access: 'forbidden' },
			};
			(mockContext.store.getState as jest.Mock).mockImplementation(() => ({
				[url]: { status: 'forbidden', details: forbiddenDetails },
			}));
			mockFetchData(Promise.resolve(mocks.success));

			const result = renderHook(() => useSmartCardActions(id, url));
			await result.current.authorize('inline');

			expect(mockPostMessage).not.toHaveBeenCalled();
			expect(mockShowConnectFlag).not.toHaveBeenCalled();
		});

		it('does NOT post Smart Link post-auth launch message on auth failure', async () => {
			const { mockPostMessage } = setupPostAuthTest();
			url = 'https://docs.google.com/document/d/abc123/edit';
			asMockFunction(auth).mockRejectedValue({ type: 'auth_window_closed' });
			mockFetchData(Promise.resolve(mocks.success));

			const result = renderHook(() => useSmartCardActions(id, url));
			await result.current.authorize('inline');

			expect(mockPostMessage).not.toHaveBeenCalled();
		});
	});
});
