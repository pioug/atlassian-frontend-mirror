import type { EmojiDefinition } from '@atlaskit/adf-schema';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import {
	defaultEmojiHeight,
	type EmojiId,
	type EmojiProvider,
	type EmojiResource,
	type OptionalEmojiDescriptionWithVariations,
} from '@atlaskit/emoji';
import { NodeDataProvider } from '@atlaskit/node-data-provider';

export class EmojiNodeDataProvider extends NodeDataProvider<
	EmojiDefinition,
	OptionalEmojiDescriptionWithVariations
> {
	name = 'emojiNodeDataProvider' as const;
	private readonly emojiResource: EmojiResource;
	private readonly emojiProvider: Promise<EmojiProvider>;

	constructor(resource: EmojiResource) {
		super();

		this.emojiResource = resource;
		this.emojiProvider = resource.getEmojiProvider();
	}

	isNodeSupported(node: JSONNode): node is EmojiDefinition {
		return node.type === 'emoji';
	}

	nodeDataKey(node: EmojiDefinition): string {
		return node.attrs.id ?? node.attrs.shortName;
	}

	async fetchNodesData(
		nodes: EmojiDefinition[],
	): Promise<OptionalEmojiDescriptionWithVariations[]> {
		// If we have an `optimisticImageApi`, use it to generate a URL immediately.
		// This is how emojis are server-side rendered in Confluence.
		// Without this, the emoji server response will hit timeout on SSR and the emoji will not be rendered.
		//
		// Check platform/packages/editor/renderer/src/react/nodes/emoji.tsx
		// and platform/packages/elements/emoji/src/components/common/ResourcedEmojiComponent.tsx
		const getOptimisticImageUrl = this.emojiResource.emojiProviderConfig.optimisticImageApi?.getUrl;
		if (getOptimisticImageUrl) {
			return nodes.map((node) => {
				const emojiId: EmojiId = {
					id: node.attrs.id,
					shortName: node.attrs.shortName,
					fallback: node.attrs.text,
				};
				const optimisticImageURL = getOptimisticImageUrl(emojiId);

				return {
					id: node.attrs.id,
					shortName: node.attrs.shortName,
					fallback: node.attrs.text,
					representation: {
						height: defaultEmojiHeight,
						width: defaultEmojiHeight,
						imagePath: optimisticImageURL,
					},
					searchable: true,
					// Type and category are unknown at this point.
					// It's not a big deal, because EmojiNodeView doesn't use them.
					type: '',
					category: '',
				};
			});
		}

		// This is slower path because during access to emojiProvider emojiResource
		// makes a request to fetch all emojis.
		const emojiProvider = await this.emojiProvider;

		const fetches = nodes.map((node) => {
			const emojiId: EmojiId = {
				id: node.attrs.id,
				shortName: node.attrs.shortName,
				fallback: node.attrs.text,
			};

			// This usually fast because the emojiProvider already has all emojis fetched.
			return emojiProvider.fetchByEmojiId(emojiId, true);
		});

		return Promise.all(fetches);
	}
}
