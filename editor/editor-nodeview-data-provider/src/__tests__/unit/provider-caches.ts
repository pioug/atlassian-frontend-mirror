import type { EmojiAttributes } from '@atlaskit/adf-schema';
import { doc, emoji, p } from '@atlaskit/adf-utils/builders';

import { NodeViewDataProvider } from '../../index';
import { buildCaches } from '../../provider-cache';

describe('NodeViewDataProvider buildCaches', () => {
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
			if (node.attrs.id === `don't resolve`) {
				return new Promise<undefined>((res) => {
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					_?.signal?.addEventListener('abort', () => {
						res(undefined);
					});
				});
			}
			if (node.attrs.id === `resolve on demand`) {
				return new Promise<{ resolvedData: string }>((res) => {
					// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
					_?.signal?.addEventListener('resolve', () => {
						res({ resolvedData: 'resolved' });
					});
				});
			}
			return Promise.resolve({ resolvedData: 'resolved' });
		},
	});

	it('should load up the provider with a cache', async () => {
		await buildCaches({
			adf: doc(p('Hello, World!', emoji({ shortName: 'smile', id: 'example', text: 'smiling' }))),
			nodeViewDataProviders: [exampleProvider],
		});

		expect(exampleProvider.cache).toEqual({
			'smile-smiling-example': { resolvedData: 'resolved' },
		});
	});

	describe('signal usage', () => {
		it('should load fully when signal received, but not aborted', async () => {
			await buildCaches({
				adf: doc(p('Hello, World!', emoji({ shortName: 'smile', id: 'example', text: 'smiling' }))),
				nodeViewDataProviders: [exampleProvider],
				signal: new AbortController().signal,
			});

			expect(exampleProvider.cache).toEqual({
				'smile-smiling-example': { resolvedData: 'resolved' },
			});
		});
	});
});
