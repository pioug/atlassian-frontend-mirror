import EventEmitter from 'node:events';

import type { EmojiAttributes } from '@atlaskit/adf-schema';
import { doc, emoji, p } from '@atlaskit/adf-utils/builders';

import { buildCaches } from '../../cache';
import { NodeDataProvider } from '../../index';

describe('NodeDataProvider buildCaches', () => {
	it('should load up the provider with a cache', async () => {
		const exampleProvider = new NodeDataProvider<{ attrs: EmojiAttributes }, any>({
			existingCache: {},
			nodeName: 'emoji',
			nodeToKey(node: { attrs: EmojiAttributes }): string {
				return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
			},
			resolve(_node: { attrs: EmojiAttributes }, _?: { signal?: AbortSignal }) {
				return Promise.resolve({ resolvedData: 'immediately resolved' });
			},
		});

		await buildCaches({
			adf: doc(p('Hello, World!', emoji({ shortName: 'smile', id: 'example', text: 'smiling' }))),
			nodeDataProviders: { emoji: exampleProvider },
		});

		expect(exampleProvider.cache).toEqual({
			'smile-smiling-example': { resolvedData: 'immediately resolved' },
		});
	});

	describe('signal usage', () => {
		it('should load fully when signal received, but not aborted', async () => {
			let mockExternalDataSource = new EventEmitter();
			const exampleProvider = new NodeDataProvider<{ attrs: EmojiAttributes }, any>({
				existingCache: {},
				nodeName: 'emoji',
				nodeToKey(node: { attrs: EmojiAttributes }): string {
					return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
				},
				resolve(node: { attrs: EmojiAttributes }, _?: { signal?: AbortSignal }) {
					if (node.attrs.id === `resolve on demand`) {
						return new Promise<{ resolvedData: string } | undefined>((res) => {
							// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
							mockExternalDataSource.on('resolve', () => {
								res({ resolvedData: 'resolved on demand' });
							});
						});
					}
					return Promise.resolve({ resolvedData: 'immediately resolved' });
				},
			});
			const cacheBuilding = buildCaches({
				adf: doc(
					p(
						'Hello, World!',
						emoji({ shortName: 'smile', id: 'example', text: 'smiling' }),
						emoji({
							shortName: 'confuse',
							id: `resolve on demand`,
							text: 'confounded',
						}),
					),
				),
				nodeDataProviders: { emoji: exampleProvider },
				signal: new AbortController().signal,
			});
			let cacheBuildingFinished = false;
			cacheBuilding.then(() => {
				cacheBuildingFinished = true;
			});

			await new Promise((res) => setTimeout(res, 0));

			// the cache builder should be partially built and still pending
			expect(cacheBuildingFinished).toBe(false);
			expect(exampleProvider.cache).toEqual({
				'smile-smiling-example': { resolvedData: 'immediately resolved' },
			});

			// this triggers the resolve inside the cache builder
			// and should result in the cache builder resolving
			mockExternalDataSource.emit('resolve');
			await new Promise((res) => setTimeout(res, 0));

			expect(cacheBuildingFinished).toBe(true);
			expect(exampleProvider.cache).toEqual({
				'smile-smiling-example': { resolvedData: 'immediately resolved' },
				'confuse-confounded-resolve on demand': { resolvedData: 'resolved on demand' },
			});
		});

		it('should exit with the partially built cache when abort signal received', async () => {
			const exampleProvider = new NodeDataProvider<{ attrs: EmojiAttributes }, any>({
				existingCache: {},
				nodeName: 'emoji',
				nodeToKey(node: { attrs: EmojiAttributes }): string {
					return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
				},
				resolve(node: { attrs: EmojiAttributes }, _?: { signal?: AbortSignal }) {
					if (node.attrs.id === `resolve on demand`) {
						return new Promise<{ resolvedData: string } | undefined>((res) => {
							// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
							_?.signal?.addEventListener('abort', () => {
								res(undefined);
							});
						});
					}
					return Promise.resolve({ resolvedData: 'immediately resolved' });
				},
			});
			const buildCacheAbortController = new AbortController();
			const cacheBuilding = buildCaches({
				adf: doc(
					p(
						'Hello, World!',
						emoji({ shortName: 'smile', id: 'example', text: 'smiling' }),
						emoji({
							shortName: 'confuse',
							id: `resolve on demand`,
							text: 'confounded',
						}),
					),
				),
				nodeDataProviders: { emoji: exampleProvider },
				signal: buildCacheAbortController.signal,
			});
			let cacheBuildingFinished = false;
			cacheBuilding.then(() => {
				cacheBuildingFinished = true;
			});

			await new Promise((res) => setTimeout(res, 0));

			// the cache builder should be partially built and still pending
			expect(cacheBuildingFinished).toBe(false);
			expect(exampleProvider.cache).toEqual({
				'smile-smiling-example': { resolvedData: 'immediately resolved' },
			});

			// this should abort all in flight resolves and
			// should result in the cache builder resolving
			buildCacheAbortController.abort();
			await new Promise((res) => setTimeout(res, 0));

			expect(cacheBuildingFinished).toBe(true);
			expect(exampleProvider.cache).toEqual({
				'smile-smiling-example': { resolvedData: 'immediately resolved' },
			});
		});
	});

	describe('No overlapping resolves occur', () => {
		it('should only try resolving a node once', async () => {
			let trackedResolvesCounter = 0;
			const exampleProvider = new NodeDataProvider<{ attrs: EmojiAttributes }, any>({
				existingCache: {},
				nodeName: 'emoji',
				nodeToKey(node: { attrs: EmojiAttributes }): string {
					return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
				},
				resolve(node: { attrs: EmojiAttributes }, _?: { signal?: AbortSignal }) {
					return new Promise<{ resolvedData: string }>((res) => {
						trackedResolvesCounter++;
						res({ resolvedData: 'resolved and tracked' });
					});
				},
			});
			const abortController = new AbortController();
			const cacheBuilding = buildCaches({
				adf: doc(
					p(
						'Hello, World!',
						emoji({ shortName: 'a', id: `resolve-and-track`, text: 'a' }),
						emoji({ shortName: 'a', id: `resolve-and-track`, text: 'a' }),
						emoji({ shortName: 'a', id: `resolve-and-track`, text: 'a' }),
						emoji({ shortName: 'a', id: `resolve-and-track`, text: 'a' }),
					),
				),
				nodeDataProviders: { emoji: exampleProvider },
				signal: abortController.signal,
			});

			await cacheBuilding;

			expect(trackedResolvesCounter).toEqual(1);
			expect(exampleProvider.cache).toEqual({
				'a-a-resolve-and-track': { resolvedData: 'resolved and tracked' },
			});
		});
	});
});
