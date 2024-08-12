import type { EmojiAttributes } from '@atlaskit/adf-schema';

import { NodeViewDataProvider } from '../../index';

describe('NodeViewDataProvider', () => {
	it('support creation of a new provider', async () => {
		const exampleProvider = new NodeViewDataProvider<
			{ attrs: EmojiAttributes },
			{ resolvedData: string }
		>({
			existingCache: {},
			nodeName: 'emoji',
			nodeToKey(node): string {
				return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
			},
			resolve(_node, _?: { signal?: AbortSignal }) {
				return Promise.resolve({ resolvedData: 'resolved' });
			},
		});

		expect(exampleProvider).toBeInstanceOf(NodeViewDataProvider);

		const key = exampleProvider.nodeToKey({
			attrs: { shortName: 'smile', id: 'example', text: 'smiling' },
		});
		expect(key).toEqual('smile-smiling-example');

		const result = await exampleProvider.resolve({
			attrs: { shortName: 'smile' },
		});

		expect(result).toEqual({ resolvedData: 'resolved' });
	});

	describe('get ', () => {
		it('should return cached data without a promise', async () => {
			const exampleProvider = new NodeViewDataProvider<
				{ attrs: EmojiAttributes },
				{ resolvedData: string }
			>({
				existingCache: {
					'smile-undefined-undefined': { resolvedData: 'resolved' },
				},
				nodeName: 'emoji',
				nodeToKey(node: { attrs: EmojiAttributes }): string {
					return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
				},
				resolve(node: { attrs: EmojiAttributes }, _?: { signal?: AbortSignal }) {
					return Promise.resolve({ resolvedData: 'resolved' });
				},
			});
			const result = exampleProvider.get({ attrs: { shortName: 'smile' } });

			expect(result).toEqual({ resolvedData: 'resolved' });
		});

		it('should return a promise which resolves with data when cache not provided', async () => {
			const exampleProvider = new NodeViewDataProvider<
				{ attrs: EmojiAttributes },
				{ resolvedData: string }
			>({
				existingCache: {},
				nodeName: 'emoji',
				nodeToKey(node: { attrs: EmojiAttributes }): string {
					return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
				},
				resolve(node: { attrs: EmojiAttributes }, _?: { signal?: AbortSignal }) {
					return Promise.resolve({ resolvedData: 'resolved' });
				},
			});
			const promiseResult = exampleProvider.get({
				attrs: { shortName: 'smile' },
			});

			expect('then' in promiseResult).toBe(true);

			const result = await promiseResult;

			expect(result).toEqual({ resolvedData: 'resolved' });
		});
	});
});
