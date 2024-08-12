import { renderHook } from '@testing-library/react-hooks';

import type { EmojiAttributes } from '@atlaskit/adf-schema';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { emoji } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';

import { useNodeViewDataProviderValue } from '../../hooks';
import { NodeViewDataProvider } from '../../index';

describe('NodeViewDataProvider hooks', () => {
	const exampleProvider = new NodeViewDataProvider<
		{ attrs: EmojiAttributes },
		{ resolvedData: string }
	>({
		nodeName: 'emoji',
		existingCache: {
			'smile-smiling-example': { resolvedData: 'resolved' },
		},
		nodeToKey(node): string {
			return `${node.attrs.shortName}-${node.attrs.text}-${node.attrs.id}`;
		},
		resolve(_node, _?: { signal?: AbortSignal }) {
			return Promise.resolve(undefined);
		},
	});

	it('should return a value if the NodeViewDataProvider has a cached value available', () => {
		const { result } = renderHook(() => {
			const emojiNode = emoji({
				shortName: 'smile',
				id: 'example',
				text: 'smiling',
			})()(defaultSchema) as PMNode;
			const result = useNodeViewDataProviderValue({
				provider: exampleProvider,
				node: emojiNode,
			});
			return result;
		});

		expect(result.current).toEqual({ resolvedData: 'resolved' });
	});
	it('should return undefined if the NodeViewDataProvider has no cached value available', () => {
		const { result } = renderHook(() => {
			const emojiNode = emoji({
				shortName: 'frown',
				id: 'confused',
				text: 'frowning',
			})()(defaultSchema) as PMNode;
			const result = useNodeViewDataProviderValue({
				provider: exampleProvider,
				node: emojiNode,
			});
			return result;
		});

		expect(result.current).toEqual(undefined);
	});
});
