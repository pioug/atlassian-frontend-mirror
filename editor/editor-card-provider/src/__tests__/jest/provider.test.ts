import { EditorCardProvider } from '../../provider';
import { CardClient } from '@atlaskit/link-provider';
import type { SmartCardLocalCacheClient } from '../../smart-card-local-cache-client';
import type {
	BlockCardAdf,
	EmbedCardAdf,
	InlineCardAdf,
	DatasourceAdfTableView,
} from '@atlaskit/linking-common';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import type { CallbackPayload } from '@atlaskit/node-data-provider';
import type { JsonLd } from '@atlaskit/json-ld-types';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

jest.spyOn(CardClient.prototype, 'fetchData').mockRejectedValue({});

// Test subclass exposing protected methods for getHardCodedAppearance assertions
class TestableEditorCardProvider extends EditorCardProvider {
	public testGetHardCodedAppearance(url: string) {
		return this.getHardCodedAppearance(url);
	}
}

// Test subclass that opts in to honouring a requested embed appearance as the
// default, mirroring how Confluence overrides the hook behind an experiment.
class OptInEmbedEditorCardProvider extends EditorCardProvider {
	protected shouldHonorRequestedEmbedAsDefault(): boolean {
		return true;
	}
}

describe('EditorCardProvider', () => {
	let provider: EditorCardProvider;
	let mockCardClient: jest.Mocked<CardClient>;

	beforeEach(() => {
		setBooleanFeatureFlagResolver((flag) => flag === 'avp_unfurl_shared_charts_embed_by_default_2');
		provider = new EditorCardProvider();
		// Access the mocked instance created in the provider's constructor
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		mockCardClient = (provider as any).cardClient;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('isNodeSupported', () => {
		it('should return true for a valid inlineCard node', () => {
			const node: JSONNode = {
				type: 'inlineCard',
				attrs: { url: 'https://atlassian.com' },
			};

			expect(provider.isNodeSupported(node)).toBe(true);
		});

		it('should return true for a valid blockCard node', () => {
			const node: JSONNode = {
				type: 'blockCard',
				attrs: { url: 'https://atlassian.com' },
			};

			expect(provider.isNodeSupported(node)).toBe(true);
		});

		it('should return true for a valid embedCard node', () => {
			const node: JSONNode = {
				type: 'embedCard',
				attrs: { url: 'https://atlassian.com' },
			};

			expect(provider.isNodeSupported(node)).toBe(true);
		});

		it('should return false for a node with an unsupported type', () => {
			const node: JSONNode = { type: 'paragraph' };

			expect(provider.isNodeSupported(node)).toBe(false);
		});

		it('should return false for a card node without attrs', () => {
			const node: JSONNode = { type: 'inlineCard' };

			expect(provider.isNodeSupported(node)).toBe(false);
		});

		it('should return false for a card node without a url in attrs', () => {
			const node: JSONNode = { type: 'inlineCard', attrs: {} };

			expect(provider.isNodeSupported(node)).toBe(false);
		});

		it('should return false for a card node with a non-string url', () => {
			const node: JSONNode = {
				type: 'inlineCard',
				attrs: { url: 123 },
			};

			expect(provider.isNodeSupported(node)).toBe(false);
		});
	});

	eeTest
		.describe('platform_editor_smartlink_local_cache', 'platform_editor_smartlink_local_cache')
		.variant(true, () => {
			describe('getData', () => {
				const cacheTestUrl = 'https://atlassian.com';
				const cacheTestNode: InlineCardAdf = { type: 'inlineCard', attrs: { url: cacheTestUrl } };

				const createSmartLinkResponse = (
					url: string,
					meta: JsonLd.Meta.BaseMeta = { access: 'granted', visibility: 'public' },
				): SmartLinkResponse => ({
					data: {
						'@type': 'Page',
						'@context': {
							'@vocab': 'https://www.w3.org/ns/activitystreams#',
							atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
							schema: 'http://schema.org/',
						},
						url,
					},
					meta,
				});

				const setupCacheScenario = (
					asyncResponse: SmartLinkResponse,
					cachedResponse?: SmartLinkResponse,
				) => {
					const callback = jest.fn(() => {});
					const getItemSpy = jest
						// @ts-ignore accessing private property for test
						.spyOn(provider.smartCardLocalCacheClient, 'getItem')
						.mockReturnValue(cachedResponse);
					// @ts-ignore accessing private property for test
					const setItemSpy = jest.spyOn(provider.smartCardLocalCacheClient, 'setItem');
					const getDataAsyncSpy = jest.spyOn(provider as any, 'getDataAsync').mockImplementation(((
						_: unknown,
						cb: (payload: CallbackPayload<JsonLd.Response>) => void,
					) => {
						cb({ data: asyncResponse });
						return Promise.resolve();
					}) as any);

					provider.getData(cacheTestNode, callback);

					return { callback, getDataAsyncSpy, getItemSpy, setItemSpy };
				};
				it('should return null for unsupported nodes', async () => {
					const node: DatasourceAdfTableView = { type: 'table' };
					const noop = () => {};

					const data = provider.getData(node as any, noop);
					expect(data).toBeUndefined();
				});

				it('should return the card data for supported nodes', async () => {
					const callback = jest.fn(() => {});
					const setItemSpy = jest.spyOn(
						// @ts-ignore accessing private property for test
						provider.smartCardLocalCacheClient as SmartCardLocalCacheClient,
						'getItem',
					);

					const node: InlineCardAdf = {
						type: 'inlineCard',
						attrs: { url: 'https://atlassian.com' },
					};
					const mockCardData: SmartLinkResponse = {
						data: {
							'@type': 'Page',
							'@context': {
								'@vocab': 'https://www.w3.org/ns/activitystreams#',
								atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
								schema: 'http://schema.org/',
							},
							url: 'https://example.com',
						},
						meta: {
							access: 'granted',
							visibility: 'public',
						},
					};
					setItemSpy.mockReturnValue(mockCardData);

					provider.getData(node, callback);
					expect(setItemSpy).toHaveBeenCalledWith('https://atlassian.com');
					expect(callback).toHaveBeenCalledTimes(1);
					expect(callback).toHaveBeenCalledWith({ data: mockCardData });
					setItemSpy.mockRestore();
				});

				it('should update cache via setItem when getDataAsync returns data and no error', async () => {
					const callback = jest.fn(() => {});
					const getItemSpy = jest.spyOn(
						// @ts-ignore accessing private property for test
						provider.smartCardLocalCacheClient as SmartCardLocalCacheClient,
						'getItem',
					);
					const setItemSpy = jest.spyOn(
						// @ts-ignore accessing private property for test
						provider.smartCardLocalCacheClient as SmartCardLocalCacheClient,
						'setItem',
					);
					getItemSpy.mockReturnValue(undefined);

					const node: InlineCardAdf = {
						type: 'inlineCard',
						attrs: { url: 'https://atlassian.com' },
					};
					const mockCardData: SmartLinkResponse = {
						data: {
							'@type': 'Page',
							'@context': {
								'@vocab': 'https://www.w3.org/ns/activitystreams#',
								atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
								schema: 'http://schema.org/',
							},
							url: 'https://example.com',
						},
						meta: {
							access: 'granted',
							visibility: 'public',
						},
					};
					const getDataAsyncSpy = jest.spyOn(provider as any, 'getDataAsync');
					const mockGetDataAsync = (
						_: unknown,
						cb: (payload: CallbackPayload<JsonLd.Response>) => void,
					) => {
						cb({ data: mockCardData });
						return Promise.resolve();
					};
					getDataAsyncSpy.mockImplementation(mockGetDataAsync as any);

					provider.getData(node, callback);

					expect(getDataAsyncSpy).toHaveBeenCalledTimes(1);
					expect(getDataAsyncSpy).toHaveBeenCalledWith(node, expect.any(Function));
					expect(setItemSpy).toHaveBeenCalledTimes(1);
					expect(setItemSpy).toHaveBeenCalledWith('https://atlassian.com', mockCardData);
					// one call from async branch (no cache)
					expect(callback).toHaveBeenCalledTimes(1);
					expect(callback).toHaveBeenCalledWith({ data: mockCardData });
				});

				it('should call callback twice when cache hit happens (cached first, then async payload)', async () => {
					const callback = jest.fn(() => {});
					const getItemSpy = jest.spyOn(
						// @ts-ignore accessing private property for test
						provider.smartCardLocalCacheClient as SmartCardLocalCacheClient,
						'getItem',
					);
					const setItemSpy = jest.spyOn(
						// @ts-ignore accessing private property for test
						provider.smartCardLocalCacheClient as SmartCardLocalCacheClient,
						'setItem',
					);

					const node: InlineCardAdf = {
						type: 'inlineCard',
						attrs: { url: 'https://atlassian.com' },
					};
					const cached: SmartLinkResponse = {
						data: {
							'@type': 'Page',
							'@context': {
								'@vocab': 'https://www.w3.org/ns/activitystreams#',
								atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
								schema: 'http://schema.org/',
							},
							url: 'https://cached.example.com',
						},
						meta: { access: 'granted', visibility: 'public' },
					};
					const fresh: SmartLinkResponse = {
						data: {
							'@type': 'Page',
							'@context': {
								'@vocab': 'https://www.w3.org/ns/activitystreams#',
								atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
								schema: 'http://schema.org/',
							},
							url: 'https://fresh.example.com',
						},
						meta: { access: 'granted', visibility: 'public' },
					};

					getItemSpy.mockReturnValue(cached);

					const getDataAsyncSpy = jest.spyOn(provider as any, 'getDataAsync');
					const mockGetDataAsync = (
						_: unknown,
						cb: (payload: CallbackPayload<JsonLd.Response>) => void,
					) => {
						cb({ data: fresh });
						return Promise.resolve();
					};
					getDataAsyncSpy.mockImplementation(mockGetDataAsync as any);

					provider.getData(node, callback);

					expect(getDataAsyncSpy).toHaveBeenCalledTimes(1);
					expect(getDataAsyncSpy).toHaveBeenCalledWith(node, expect.any(Function));
					expect(setItemSpy).toHaveBeenCalledTimes(1);
					expect(setItemSpy).toHaveBeenCalledWith('https://atlassian.com', fresh);
					expect(callback).toHaveBeenCalledTimes(2);
					expect(callback).toHaveBeenNthCalledWith(1, { data: cached });
					expect(callback).toHaveBeenNthCalledWith(2, { data: fresh });
				});

				it('should not update cache via setItem when getDataAsync returns an error', async () => {
					const callback = jest.fn(() => {});
					const getItemSpy = jest.spyOn(
						// @ts-ignore accessing private property for test
						provider.smartCardLocalCacheClient as SmartCardLocalCacheClient,
						'getItem',
					);
					const setItemSpy = jest.spyOn(
						// @ts-ignore accessing private property for test
						provider.smartCardLocalCacheClient as SmartCardLocalCacheClient,
						'setItem',
					);
					getItemSpy.mockReturnValue(undefined);

					const node: InlineCardAdf = {
						type: 'inlineCard',
						attrs: { url: 'https://atlassian.com' },
					};
					const getDataAsyncSpy = jest.spyOn(provider as any, 'getDataAsync');
					const mockGetDataAsync = (
						_: unknown,
						cb: (payload: CallbackPayload<JsonLd.Response>) => void,
					) => {
						cb({ error: new Error('boom'), data: { some: 'data' } as any });
						return Promise.resolve();
					};
					getDataAsyncSpy.mockImplementation(mockGetDataAsync as any);

					provider.getData(node, callback);

					expect(setItemSpy).not.toHaveBeenCalled();
					expect(callback).toHaveBeenCalledTimes(1);
					expect(callback.mock.calls[0].at(0)).toEqual(
						expect.objectContaining({
							error: expect.any(Error),
							data: { some: 'data' },
						}),
					);
				});

				it('should return cached data when cached response status is resolved', async () => {
					const cachedResponse = createSmartLinkResponse('https://cached.example.com');
					const asyncResponse = createSmartLinkResponse('https://fresh.example.com');
					const { callback, setItemSpy } = setupCacheScenario(asyncResponse, cachedResponse);

					expect(setItemSpy).toHaveBeenCalledTimes(1);
					expect(setItemSpy).toHaveBeenCalledWith(cacheTestUrl, asyncResponse);
					expect(callback).toHaveBeenCalledTimes(2);
					expect(callback).toHaveBeenNthCalledWith(1, { data: cachedResponse });
					expect(callback).toHaveBeenNthCalledWith(2, { data: asyncResponse });
				});

				it.each<[JsonLd.Meta.BaseMeta]>([
					[{ access: 'forbidden', visibility: 'restricted' }],
					[{ access: 'unauthorized', visibility: 'restricted' }],
				])(
					'should ignore cached data when cached response status is not resolved',
					async (meta) => {
						const cachedResponse = createSmartLinkResponse('https://cached.example.com', meta);
						const asyncResponse = createSmartLinkResponse('https://fresh.example.com');
						const { callback, setItemSpy } = setupCacheScenario(asyncResponse, cachedResponse);

						expect(setItemSpy).toHaveBeenCalledTimes(1);
						expect(setItemSpy).toHaveBeenCalledWith(cacheTestUrl, asyncResponse);
						expect(callback).toHaveBeenCalledTimes(1);
						expect(callback).toHaveBeenCalledWith({ data: asyncResponse });
					},
				);

				it.each<[JsonLd.Meta.BaseMeta]>([
					[{ access: 'forbidden', visibility: 'restricted' }],
					[{ access: 'forbidden', visibility: 'restricted', accessType: 'ACCESS_EXISTS' }],
					[
						{
							access: 'forbidden',
							visibility: 'not_found',
							accessType: 'DENIED_REQUEST_EXISTS',
						},
					],
					[{ access: 'forbidden', visibility: 'not_found', accessType: 'DIRECT_ACCESS' }],
					[{ access: 'forbidden', visibility: 'not_found', accessType: 'FORBIDDEN' }],
					[
						{
							access: 'forbidden',
							visibility: 'not_found',
							accessType: 'PENDING_REQUEST_EXISTS',
						},
					],
					[{ access: 'forbidden', visibility: 'not_found' }],
					[{ access: 'forbidden', visibility: 'not_found', accessType: 'ACCESS_EXISTS' }],
					[{ access: 'forbidden', visibility: 'restricted' }],
					[{ access: 'unauthorized', visibility: 'restricted' }],
				])(
					'should not update cache via setItem when getDataAsync returns data with unresolved status',
					async (meta) => {
						const asyncResponse = createSmartLinkResponse('https://example.com', meta);
						const { callback, setItemSpy } = setupCacheScenario(asyncResponse);

						expect(setItemSpy).not.toHaveBeenCalled();
						expect(callback).toHaveBeenCalledTimes(1);
						expect(callback.mock.calls[0].at(0)).toEqual({
							data: expect.objectContaining({
								data: expect.any(Object),
								meta: expect.objectContaining(meta),
							}),
						});
					},
				);
			});
		});

	describe('nodeDataKey', () => {
		it('should return the url from the node attributes when inline resolve optimization is off', () => {
			const url = 'https://atlassian.com/test';
			const node: InlineCardAdf = {
				type: 'inlineCard',
				attrs: { url },
			};

			expect(provider.nodeDataKey(node)).toBe(url);
		});

		it('should include card appearance when inline resolve optimization is on', () => {
			setBooleanFeatureFlagResolver(
				(flag) =>
					flag === 'avp_unfurl_shared_charts_embed_by_default_2' ||
					flag === 'platform_smartlink_inline_resolve_optimization',
			);

			const url = 'https://atlassian.com/test';
			const inlineNode: InlineCardAdf = {
				type: 'inlineCard',
				attrs: { url },
			};
			const blockNode: BlockCardAdf = {
				type: 'blockCard',
				attrs: { url },
			};
			const embedNode: EmbedCardAdf = {
				type: 'embedCard',
				attrs: { url, layout: 'wide' },
			};

			expect(provider.nodeDataKey(inlineNode)).toBe(`${url}|inline`);
			expect(provider.nodeDataKey(blockNode)).toBe(`${url}|block`);
			expect(provider.nodeDataKey(embedNode)).toBe(`${url}|embed`);
		});
	});

	describe('fetchNodesData', () => {
		it('should call cardClient.fetchData without appearance when inline resolve optimization is off', async () => {
			const nodes: (InlineCardAdf | BlockCardAdf | EmbedCardAdf)[] = [
				{ type: 'inlineCard', attrs: { url: 'https://url1.com' } },
				{ type: 'blockCard', attrs: { url: 'https://url2.com' } },
			];
			const mockResponses = [
				{ data: { url: 'https://url1.com' } },
				{ data: { url: 'https://url2.com' } },
			];

			jest
				.spyOn(CardClient.prototype, 'fetchData')
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.mockResolvedValueOnce(mockResponses[0] as any)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.mockResolvedValueOnce(mockResponses[1] as any);

			const results = await provider.fetchNodesData(nodes);

			expect(mockCardClient.fetchData).toHaveBeenCalledTimes(2);
			expect(mockCardClient.fetchData).toHaveBeenCalledWith('https://url1.com', false, undefined);
			expect(mockCardClient.fetchData).toHaveBeenCalledWith('https://url2.com', false, undefined);
			expect(results).toEqual(mockResponses);
		});

		it('should call cardClient.fetchData with appearance when inline resolve optimization is on', async () => {
			setBooleanFeatureFlagResolver(
				(flag) =>
					flag === 'avp_unfurl_shared_charts_embed_by_default_2' ||
					flag === 'platform_smartlink_inline_resolve_optimization',
			);

			const nodes: (InlineCardAdf | BlockCardAdf | EmbedCardAdf)[] = [
				{ type: 'inlineCard', attrs: { url: 'https://url1.com' } },
				{ type: 'blockCard', attrs: { url: 'https://url2.com' } },
			];
			const mockResponses = [
				{ data: { url: 'https://url1.com' } },
				{ data: { url: 'https://url2.com' } },
			];

			jest
				.spyOn(CardClient.prototype, 'fetchData')
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.mockResolvedValueOnce(mockResponses[0] as any)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.mockResolvedValueOnce(mockResponses[1] as any);

			const results = await provider.fetchNodesData(nodes);

			expect(mockCardClient.fetchData).toHaveBeenCalledTimes(2);
			expect(mockCardClient.fetchData).toHaveBeenCalledWith('https://url1.com', false, 'inline');
			expect(mockCardClient.fetchData).toHaveBeenCalledWith('https://url2.com', false, 'block');
			expect(results).toEqual(mockResponses);
		});

		it('should handle promises rejections from fetchData', async () => {
			const nodes: InlineCardAdf[] = [{ type: 'inlineCard', attrs: { url: 'https://fail.com' } }];
			const error = new Error('Fetch failed');
			mockCardClient.fetchData.mockRejectedValue(error);

			await expect(provider.fetchNodesData(nodes)).rejects.toThrow(error);
		});
	});

	it('should allow to pass custom CardClient', async () => {
		setBooleanFeatureFlagResolver(
			(flag) =>
				flag === 'avp_unfurl_shared_charts_embed_by_default_2' ||
				flag === 'platform_smartlink_inline_resolve_optimization',
		);

		const customCardClient = new CardClient();
		jest.spyOn(customCardClient, 'fetchData').mockResolvedValue({
			data: {
				'@type': 'Page',
				'@context': {
					'@vocab': 'https://www.w3.org/ns/activitystreams#',
					atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
					schema: 'http://schema.org/',
				},
				url: 'https://example.com',
			},
			meta: {
				access: 'granted',
				visibility: 'public',
			},
		});

		const cardProvider = new EditorCardProvider(
			undefined,
			undefined,
			undefined,
			undefined,
			customCardClient,
		);

		await cardProvider.fetchNodesData([
			{ type: 'inlineCard', attrs: { url: 'https://example.com' } },
		]);

		expect(customCardClient.fetchData).toHaveBeenCalledWith('https://example.com', false, 'inline');
	});

	it('should not set product to custom CardClient', async () => {
		const customCardClient = new CardClient();
		jest.spyOn(customCardClient, 'setProduct');

		new EditorCardProvider(undefined, undefined, undefined, undefined, customCardClient);

		expect(customCardClient.setProduct).not.toHaveBeenCalled();
	});

	describe('getHardCodedAppearance - AVP Visualization URLs', () => {
		let testProvider: TestableEditorCardProvider;

		beforeEach(() => {
			// Set up feature flag resolver for AVP tests
			setBooleanFeatureFlagResolver(
				(flag) => flag === 'avp_unfurl_shared_charts_embed_by_default_2',
			);
			testProvider = new TestableEditorCardProvider();
		});

		afterEach(() => {
			// Restore the original resolver to prevent test pollution
			setBooleanFeatureFlagResolver(
				(flag) => flag === 'avp_unfurl_shared_charts_embed_by_default_2',
			);
		});

		it('should return embed for AVP Visualization URLs with numeric entity-id', () => {
			const url = 'https://hello.atlassian.net/avpviz/c/12345';
			expect(testProvider.testGetHardCodedAppearance(url)).toBe('embed');
		});

		it('should return embed for AVP Visualization URLs with UUID entity-id', () => {
			const url = 'https://hello.atlassian.net/avpviz/c/8fb8c642-803d-59fe-8d1c-066610e860c6';
			expect(testProvider.testGetHardCodedAppearance(url)).toBe('embed');
		});

		it('should return embed for AVP Visualization URLs with alphanumeric entity-id', () => {
			const url = 'https://hello.atlassian.net/avpviz/c/abc123-def456';
			expect(testProvider.testGetHardCodedAppearance(url)).toBe('embed');
		});

		it('should return embed for AVP Visualization URLs with query parameters', () => {
			const url = 'https://hello.atlassian.net/avpviz/c/12345?foo=bar&baz=qux';
			expect(testProvider.testGetHardCodedAppearance(url)).toBe('embed');
		});

		it('should return embed for AVP Visualization URLs with trailing slash', () => {
			const url = 'https://hello.atlassian.net/avpviz/c/12345/';
			expect(testProvider.testGetHardCodedAppearance(url)).toBe('embed');
		});

		it('should return embed for AVP Visualization URLs on different domains', () => {
			const url = 'https://jdog.jira-dev.com/avpviz/c/entity-123';
			expect(testProvider.testGetHardCodedAppearance(url)).toBe('embed');
		});

		it('should return undefined for URLs missing /c/ segment', () => {
			const url = 'https://hello.atlassian.net/avpviz/12345';
			expect(testProvider.testGetHardCodedAppearance(url)).toBeUndefined();
		});

		it('should return undefined for URLs with different path structure', () => {
			const url = 'https://hello.atlassian.net/avpviz/view/12345';
			expect(testProvider.testGetHardCodedAppearance(url)).toBeUndefined();
		});

		it('should return undefined for URLs with empty entity-id', () => {
			const url = 'https://hello.atlassian.net/avpviz/c/';
			expect(testProvider.testGetHardCodedAppearance(url)).toBeUndefined();
		});

		it('should return undefined for URLs with avpviz in query parameter', () => {
			const url = 'https://hello.atlassian.net/some/path?avpviz=c/12345';
			expect(testProvider.testGetHardCodedAppearance(url)).toBeUndefined();
		});

		it('should return undefined for regular URLs', () => {
			const url = 'https://hello.atlassian.net/some/other/path';
			expect(testProvider.testGetHardCodedAppearance(url)).toBeUndefined();
		});

		it('should return undefined for AVP Visualization URLs when feature gate is disabled', () => {
			setBooleanFeatureFlagResolver(() => false);
			const disabledProvider = new TestableEditorCardProvider();
			const url = 'https://hello.atlassian.net/avpviz/c/12345';
			expect(disabledProvider.testGetHardCodedAppearance(url)).toBeUndefined();
		});

		it('should return embed for AVP Visualization URLs when feature gate is enabled', () => {
			setBooleanFeatureFlagResolver(
				(flag) => flag === 'avp_unfurl_shared_charts_embed_by_default_2',
			);
			const enabledProvider = new TestableEditorCardProvider();
			const url = 'https://hello.atlassian.net/avpviz/c/12345';
			expect(enabledProvider.testGetHardCodedAppearance(url)).toBe('embed');
		});
	});

	describe('getHardCodedAppearance - Loom URLs', () => {
		let testProvider: TestableEditorCardProvider;

		beforeEach(() => {
			testProvider = new TestableEditorCardProvider();
		});

		it('should return embed for Loom video share URLs', () => {
			const url = 'https://www.loom.com/share/abcdef0123456789abcdef0123456789';
			expect(testProvider.testGetHardCodedAppearance(url)).toBe('embed');
		});

		it('should return embed for Loom screenshot URLs when feature gate is enabled', () => {
			setBooleanFeatureFlagResolver((flag) => flag === 'loom-support-screenshot-sl-resolution');
			const url = 'https://www.loom.com/i/abcdef0123456789abcdef0123456789';
			expect(testProvider.testGetHardCodedAppearance(url)).toBe('embed');
		});

		it('should return undefined for Loom screenshot URLs when feature gate is disabled', () => {
			setBooleanFeatureFlagResolver(() => false);
			const url = 'https://www.loom.com/i/abcdef0123456789abcdef0123456789';
			expect(testProvider.testGetHardCodedAppearance(url)).toBeUndefined();
		});

		it('should return undefined for Loom URLs with an invalid id', () => {
			const url = 'https://www.loom.com/share/not-a-valid-id';
			expect(testProvider.testGetHardCodedAppearance(url)).toBeUndefined();
		});
	});

	describe('resolve - Confluence shortlinks', () => {
		const shortLinkUrl = 'https://example.atlassian.net/wiki/x/AbCdEfG';

		const setupResolveMocks = (
			target: EditorCardProvider,
			resolvedUrl: string,
			userPreference?: string,
		) => {
			jest.spyOn(target as any, 'findPatternData').mockResolvedValue({
				source: '^https://example\\.atlassian\\.net/wiki/x/[^/]+$',
			});
			jest.spyOn(target as any, 'findUserPreference').mockResolvedValue(userPreference);
			const fetchData = jest.spyOn(target as any, 'fetchData').mockResolvedValue({
				data: {
					'@type': 'Document',
					url: resolvedUrl,
				},
			});
			jest.spyOn(target as any, 'getDatasourceFromResolveResponse').mockResolvedValue(undefined);
			jest.spyOn(target as any, 'getAuthStatusFromResolveResponse').mockResolvedValue(undefined);

			return fetchData;
		};

		it('overrides the requested inline appearance when the shortlink resolves to a hardcoded embed URL', async () => {
			passGate('platform_native_embeds_enable_shortlink_resolution');
			const resolvedUrl =
				'https://example.atlassian.net/wiki/spaces/TEST/whiteboard/123456789';
			const fetchData = setupResolveMocks(provider, resolvedUrl);

			const adf = await provider.resolve(shortLinkUrl, 'inline', false, true);

			expect(adf.type).toBe('embedCard');
			expect(fetchData).toHaveBeenCalledWith(shortLinkUrl);
			expect(fetchData).toHaveBeenCalledTimes(1);
		});

		it('keeps the requested appearance when the resolved URL has no hardcoded embed appearance', async () => {
			passGate('platform_native_embeds_enable_shortlink_resolution');
			setupResolveMocks(
				provider,
				'https://example.atlassian.net/wiki/spaces/TEST/pages/123456789',
			);

			const adf = await provider.resolve(shortLinkUrl, 'inline', false, true);

			expect(adf.type).toBe('inlineCard');
		});

		it('does not resolve the shortlink when the shortlink resolution gate is off', async () => {
			failGate('platform_native_embeds_enable_shortlink_resolution');
			const fetchData = setupResolveMocks(
				provider,
				'https://example.atlassian.net/wiki/spaces/TEST/whiteboard/123456789',
			);

			const adf = await provider.resolve(shortLinkUrl, 'inline', false, true);

			expect(adf.type).toBe('inlineCard');
			expect(fetchData).not.toHaveBeenCalled();
		});

		it.each([
			'http://example.atlassian.net/wiki/x/AbCdEfG',
			'https://example.atlassian.net/another/path/wiki/x/AbCdEfG',
			'https:///wiki/x/AbCdEfG',
		])('does not resolve a malformed Confluence shortlink: %s', async (url) => {
			passGate('platform_native_embeds_enable_shortlink_resolution');
			const fetchData = setupResolveMocks(
				provider,
				'https://example.atlassian.net/wiki/spaces/TEST/whiteboard/123456789',
			);

			const adf = await provider.resolve(url, 'inline', false, true);

			expect(adf.type).toBe('inlineCard');
			expect(fetchData).not.toHaveBeenCalled();
		});

		it('preserves an explicit inline user appearance preference', async () => {
			passGate('platform_native_embeds_enable_shortlink_resolution');
			const fetchData = setupResolveMocks(
				provider,
				'https://example.atlassian.net/wiki/spaces/TEST/whiteboard/123456789',
				'inline',
			);

			const adf = await provider.resolve(shortLinkUrl, 'inline', false, true);

			expect(adf.type).toBe('inlineCard');
			expect(fetchData).not.toHaveBeenCalled();
		});

		it.each([
			{ userPreference: 'url', expectedType: undefined },
			{ userPreference: 'block', expectedType: 'blockCard' },
		])(
			'preserves an explicit $userPreference user appearance preference',
			async ({ userPreference, expectedType }) => {
				if (userPreference === 'block') {
					passGate('platform_native_embeds_enable_shortlink_resolution');
				}
				const fetchData = setupResolveMocks(
					provider,
					'https://example.atlassian.net/wiki/spaces/TEST/whiteboard/123456789',
					userPreference,
				);

				const resolution = provider.resolve(shortLinkUrl, 'inline', false, true);

				if (expectedType === undefined) {
					await expect(resolution).rejects.toBeUndefined();
				} else {
					await expect(resolution).resolves.toMatchObject({ type: expectedType });
				}
				expect(fetchData).not.toHaveBeenCalled();
			},
		);

		it.each([
			{ gateState: 'enabled', isGateEnabled: true },
			{ gateState: 'disabled', isGateEnabled: false },
		])(
			'preserves an explicit embed user appearance preference when the gate is $gateState',
			async ({ isGateEnabled }) => {
				if (isGateEnabled) {
					passGate('platform_native_embeds_enable_shortlink_resolution');
				} else {
					failGate('platform_native_embeds_enable_shortlink_resolution');
				}
				const fetchData = setupResolveMocks(
					provider,
					'https://example.atlassian.net/wiki/spaces/TEST/whiteboard/123456789',
					'embed',
				);
				jest.spyOn(provider as any, 'canBeResolvedAsEmbed').mockResolvedValue(true);

				const adf = await provider.resolve(shortLinkUrl, 'inline', false, true);

				expect(adf.type).toBe('embedCard');
				expect(fetchData).not.toHaveBeenCalled();
			},
		);
	});

	describe('resolve - requested embed as default (shouldHonorRequestedEmbedAsDefault)', () => {
		const url = 'https://example.com/some/resource';

		const setupResolveMocks = (
			target: EditorCardProvider,
			{
				userPreference,
				canEmbed,
				providerDefault,
			}: {
				canEmbed: boolean;
				providerDefault?: string;
				userPreference?: string;
			},
		) => {
			jest
				.spyOn(target as any, 'findPatternData')
				.mockResolvedValue(providerDefault ? { defaultView: providerDefault } : undefined);
			jest.spyOn(target as any, 'findUserPreference').mockResolvedValue(userPreference);
			jest.spyOn(target as any, 'checkLinkResolved').mockResolvedValue(true);
			jest.spyOn(target as any, 'canBeResolvedAsEmbed').mockResolvedValue(canEmbed);
			jest.spyOn(target as any, 'getDatasourceFromResolveResponse').mockResolvedValue(undefined);
			jest.spyOn(target as any, 'getAuthStatusFromResolveResponse').mockResolvedValue(undefined);
		};

		it('resolves as an embed when the user has no preference and the link is embeddable', async () => {
			const optIn = new OptInEmbedEditorCardProvider();
			setupResolveMocks(optIn, { userPreference: undefined, canEmbed: true });

			const adf = await optIn.resolve(url, 'embed', false, true);

			expect(adf.type).toBe('embedCard');
		});

		it('falls back to a block card when the link cannot be embedded', async () => {
			const optIn = new OptInEmbedEditorCardProvider();
			setupResolveMocks(optIn, { userPreference: undefined, canEmbed: false });

			const adf = await optIn.resolve(url, 'embed', false, true);

			expect(adf.type).toBe('blockCard');
		});

		it('lets an explicit user preference win over the requested embed', async () => {
			const optIn = new OptInEmbedEditorCardProvider();
			setupResolveMocks(optIn, { userPreference: 'inline', canEmbed: true });

			const adf = await optIn.resolve(url, 'embed', false, true);

			expect(adf.type).toBe('inlineCard');
		});

		it('wins over a provider default appearance', async () => {
			const optIn = new OptInEmbedEditorCardProvider();
			setupResolveMocks(optIn, {
				userPreference: undefined,
				canEmbed: true,
				providerDefault: 'block',
			});

			const adf = await optIn.resolve(url, 'embed', false, true);

			expect(adf.type).toBe('embedCard');
		});

		it('leaves behaviour unchanged when the hook is off (provider default wins)', async () => {
			const base = new EditorCardProvider();
			setupResolveMocks(base, {
				userPreference: undefined,
				canEmbed: true,
				providerDefault: 'block',
			});

			const adf = await base.resolve(url, 'embed', false, true);

			expect(adf.type).toBe('blockCard');
		});
	});
});
