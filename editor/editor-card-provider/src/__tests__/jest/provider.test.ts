import { EditorCardProvider } from '../../provider';
import { CardClient } from '@atlaskit/link-provider';
import { type BlockCardAdf, type EmbedCardAdf, type InlineCardAdf } from '@atlaskit/linking-common';
import { type JSONNode } from '@atlaskit/editor-json-transformer';

jest.spyOn(CardClient.prototype, 'fetchData').mockRejectedValue({});

describe('EditorCardProvider', () => {
	let provider: EditorCardProvider;
	let mockCardClient: jest.Mocked<CardClient>;

	beforeEach(() => {
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
});
