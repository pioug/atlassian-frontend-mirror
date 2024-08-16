/* eslint-disable @typescript-eslint/no-explicit-any */

import { renderHook } from '@testing-library/react-hooks';

import type { EmojiAttributes } from '@atlaskit/adf-schema';
import { doc, emoji, p } from '@atlaskit/adf-utils/builders';

import { NodeDataProvider } from '../../../index';
import * as globalNdpCaches from '../../_global-ndp-caches';
import { useContentNodeDataProvidersSetup } from '../../_internal-context';

function exampleGetNodeDataProviders() {
	const emojiProvider = new NodeDataProvider<{ attrs: EmojiAttributes }, any>({
		nodeName: 'emoji',
		nodeToKey(node): string {
			return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
		},
		resolve(_node, _?: { signal?: AbortSignal }) {
			return Promise.resolve({ resolvedData: 'resolved-by-example-provider' });
		},
	});

	return { emoji: emojiProvider };
}

const originalImplementation = globalNdpCaches.useGlobalNdpCachesContext;
const globalNdpCachesSpy = jest.spyOn(globalNdpCaches, 'useGlobalNdpCachesContext');

describe('useContentNodeDataProvidersSetup', () => {
	afterEach(() => {
		globalNdpCachesSpy.mockImplementation(originalImplementation);
		globalNdpCaches._resetGlobalNdpCachesContext();
	});

	describe('data providers cache', () => {
		it('should return existing node data providers if they are cached', () => {
			globalNdpCachesSpy.mockImplementation(() => {
				return {
					page: {
						get() {
							return 'mock-content-cache';
						},
						set() {
							return;
						},
					},
				} as any;
			});
			const { result } = renderHook(() => {
				const result = useContentNodeDataProvidersSetup(
					{
						contentType: 'page',
						contentId: '9001',
					},
					{ getNodeDataProviders: exampleGetNodeDataProviders },
				);
				return result;
			});

			expect(result.current).toBe('mock-content-cache');
		});

		it('should return a new node data provider if none are cached', () => {
			const { result } = renderHook(() => {
				const result = useContentNodeDataProvidersSetup(
					{
						contentType: 'page',
						contentId: '9001',
					},
					{ getNodeDataProviders: exampleGetNodeDataProviders },
				);
				return result;
			});

			expect(result.current).toMatchObject({ emoji: expect.any(NodeDataProvider) });
		});

		it("should use the existing cache if it's provided", () => {
			const existingCache = {
				emoji: {
					'smile-smiling-example': { resolvedData: 'mock-existing-cache' },
				},
			};
			const { result } = renderHook(() => {
				const result = useContentNodeDataProvidersSetup(
					{
						contentType: 'page',
						contentId: '9001',
					},
					{
						getNodeDataProviders: exampleGetNodeDataProviders,
						existingProvidersCache: existingCache,
					},
				);
				return result;
			});

			expect(result.current!.emoji.cache).toMatchObject(existingCache.emoji);
		});
	});

	describe('nodeview data provider internal caches', () => {
		it('should warm the nodeview data provider caches if adf provided', async () => {
			const mockDocumentWithEmoji = doc(
				p('Hello, World!', emoji({ shortName: 'smile', id: 'example', text: 'smiling' })),
			);
			type CacheWarmedResult = Parameters<
				NonNullable<Parameters<typeof useContentNodeDataProvidersSetup>[1]['onCacheWarmed']>
			>[0];
			let resolveWaitingForCacheWarm = (onCacheWarmedResult: CacheWarmedResult) => {};
			let waitingForCacheWarm = new Promise<CacheWarmedResult>((res) => {
				resolveWaitingForCacheWarm = (result: CacheWarmedResult) => res(result);
			});
			renderHook(() => {
				const result = useContentNodeDataProvidersSetup(
					{
						contentType: 'page',
						contentId: '9001',
					},
					{
						getNodeDataProviders: exampleGetNodeDataProviders,
						adfToUpdateWith: mockDocumentWithEmoji,
						onCacheWarmed: (result) => {
							resolveWaitingForCacheWarm(result);
						},
					},
				);
				return result;
			});

			const { nodeDataProviders, warmedNodeDataProvidersCache } = await waitingForCacheWarm;

			expect(nodeDataProviders).toMatchObject({
				emoji: expect.any(NodeDataProvider),
			});

			expect(warmedNodeDataProvidersCache).toMatchObject({
				emoji: { 'smile-smiling-example': { resolvedData: 'resolved-by-example-provider' } },
			});
		});
	});
});
