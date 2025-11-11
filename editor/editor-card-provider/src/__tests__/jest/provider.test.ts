import { EditorCardProvider } from '../../provider';
import { CardClient } from '@atlaskit/link-provider';
import { type BlockCardAdf, type EmbedCardAdf, type InlineCardAdf } from '@atlaskit/linking-common';
import { type JSONNode } from '@atlaskit/editor-json-transformer';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

jest.spyOn(CardClient.prototype, 'fetchData').mockRejectedValue({});

describe('EditorCardProvider', () => {
	let provider: EditorCardProvider;
	let mockCardClient: jest.Mocked<CardClient>;

	beforeEach(() => {
		setBooleanFeatureFlagResolver(
			(flag) =>
				flag === 'smartlink_jira_software_form' ||
				flag === 'avp_unfurl_shared_charts_embed_by_default_2',
		);
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

	describe('nodeDataKey', () => {
		it('should return the url from the node attributes', () => {
			const url = 'https://atlassian.com/test';
			const node: InlineCardAdf = {
				type: 'inlineCard',
				attrs: { url },
			};

			expect(provider.nodeDataKey(node)).toBe(url);
		});
	});

	describe('fetchNodesData', () => {
		it('should call cardClient.fetchData for each node and return the results', async () => {
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
			expect(mockCardClient.fetchData).toHaveBeenCalledWith('https://url1.com');
			expect(mockCardClient.fetchData).toHaveBeenCalledWith('https://url2.com');
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

		expect(customCardClient.fetchData).toHaveBeenCalledWith('https://example.com');
	});

	it('should not set product to custom CardClient', async () => {
		const customCardClient = new CardClient();
		jest.spyOn(customCardClient, 'setProduct');

		new EditorCardProvider(undefined, undefined, undefined, undefined, customCardClient);

		expect(customCardClient.setProduct).not.toHaveBeenCalled();
	});

	describe('getHardCodedAppearance - AVP Visualization URLs', () => {
		// Create a test subclass to access protected method
		class TestableEditorCardProvider extends EditorCardProvider {
			public testGetHardCodedAppearance(url: string) {
				return this.getHardCodedAppearance(url);
			}
		}

		let testProvider: TestableEditorCardProvider;

		beforeEach(() => {
			// Set up feature flag resolver for AVP tests
			setBooleanFeatureFlagResolver(
				(flag) =>
					flag === 'smartlink_jira_software_form' ||
					flag === 'avp_unfurl_shared_charts_embed_by_default_2',
			);
			testProvider = new TestableEditorCardProvider();
		});

		afterEach(() => {
			// Restore the original resolver to prevent test pollution
			setBooleanFeatureFlagResolver(
				(flag) =>
					flag === 'smartlink_jira_software_form' ||
					flag === 'avp_unfurl_shared_charts_embed_by_default_2',
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
});
