import { type EmojiAttributes } from '@atlaskit/adf-schema';
import type { EmojiDescriptionWithVariations, EmojiProvider } from '@atlaskit/emoji';

import { NodeDataProvider } from '../index';

export function createEmojiNodeDataProvider({
	emojiProvider,
	existingCache,
}: {
	emojiProvider: Promise<EmojiProvider>;
	existingCache?: Record<string, EmojiDescriptionWithVariations>;
}): EmojiNodeDataProvider {
	const emojiNodeDataProvider = new NodeDataProvider<
		{ attrs: EmojiAttributes },
		EmojiDescriptionWithVariations
	>({
		existingCache,
		nodeName: 'emoji',
		nodeToKey: (node) => {
			const key = `${node.attrs.id}-${node.attrs.shortName}-${node.attrs.text}`;

			return key;
		},
		async resolve(node, _resolveOptions) {
			const emojiDescriptionWithVariations = await (
				await emojiProvider
			).fetchByEmojiId(
				{
					id: node.attrs.id,
					shortName: node.attrs.shortName,
					fallback: node.attrs.text,
				},
				true,
			);

			if (!emojiDescriptionWithVariations) {
				throw new Error('Could not resolve emoji');
			}

			return emojiDescriptionWithVariations;
		},
	});

	return emojiNodeDataProvider;
}

export type EmojiNodeDataProvider = NodeDataProvider<
	{ attrs: EmojiAttributes },
	EmojiDescriptionWithVariations
>;
