import { act, renderHook } from '@testing-library/react-hooks';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { emoji } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';
import type { EmojiProvider } from '@atlaskit/emoji';

import { useNodeDataProviderGet } from '../../plugin-hooks';
import { createEmojiNodeDataProvider } from '../../providers/emoji';

const testEmojiNode = emoji({
	shortName: 'frown',
	id: 'confused',
	text: 'frowning',
})()(defaultSchema) as PMNode;

describe('NodeDataProvider hooks', () => {
	describe('useNodeDataProviderGet', () => {
		test('should go from loading to loaded when no cached value', async () => {
			const mockEmojiAttrs = { resolved: 'resolvedData' };
			const exampleEmojiProvider = createEmojiNodeDataProvider({
				emojiProvider: Promise.resolve({
					fetchByEmojiId: async () => mockEmojiAttrs,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} as any as EmojiProvider),
			});

			const { result } = renderHook(() => {
				const result = useNodeDataProviderGet({
					node: testEmojiNode,
					provider: exampleEmojiProvider,
				});

				return result;
			});

			expect(result.current).toMatchObject({ state: 'loading', result: undefined });

			await act(async () => {
				await new Promise((res) => setTimeout(res));
			});

			expect(result.current).toMatchObject({ state: 'resolved', result: mockEmojiAttrs });
		});

		test('should go from loading to failed when resolution fails', async () => {
			const exampleEmojiProvider = createEmojiNodeDataProvider({
				emojiProvider: Promise.resolve({
					fetchByEmojiId: async () => {
						return undefined;
					},
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} as any as EmojiProvider),
			});

			const { result } = renderHook(() => {
				const result = useNodeDataProviderGet({
					node: testEmojiNode,
					provider: exampleEmojiProvider,
				});

				return result;
			});

			expect(result.current).toMatchObject({ state: 'loading', result: undefined });

			await act(async () => {
				await new Promise((res) => setTimeout(res));
				await new Promise((res) => setTimeout(res));
			});

			expect(result.current).toMatchObject({ state: 'failed', result: undefined });
		});

		test('should start as loaded when cached value available', async () => {
			const exampleEmojiProvider = createEmojiNodeDataProvider({
				emojiProvider: Promise.resolve({
					fetchByEmojiId: async () => ({}),
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} as any as EmojiProvider),
			});
			const mockCachedValue = { resolved: 'cachedData' };
			exampleEmojiProvider.updateCache(
				// @ts-ignore
				{ [exampleEmojiProvider.nodeToKey(testEmojiNode)]: mockCachedValue },
				{ strategy: 'replace' },
			);

			const { result } = renderHook(() => {
				const result = useNodeDataProviderGet({
					node: testEmojiNode,
					provider: exampleEmojiProvider,
				});

				return result;
			});

			expect(result.current).toMatchObject({ state: 'resolved', result: mockCachedValue });
		});
	});
});
