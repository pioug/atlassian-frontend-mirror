import type { EmojiDefinition } from '@atlaskit/adf-schema';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import type {
	EmojiProvider,
	EmojiResource,
	OptionalEmojiDescriptionWithVariations,
} from '@atlaskit/emoji';
import { NodeDataProvider } from '@atlaskit/node-data-provider';

export class EmojiNodeDataProvider extends NodeDataProvider<
	EmojiDefinition,
	OptionalEmojiDescriptionWithVariations
> {
	name = 'emojiNodeDataProvider' as const;
	private readonly emojiProvider: Promise<EmojiProvider>;

	constructor(resource: EmojiResource) {
		super();
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
		const emojiProvider = await this.emojiProvider;

		const fetches = nodes.map((node) =>
			emojiProvider.fetchByEmojiId(
				{
					id: node.attrs.id,
					shortName: node.attrs.shortName,
					fallback: node.attrs.text,
				},
				true,
			),
		);

		return Promise.all(fetches);
	}
}
