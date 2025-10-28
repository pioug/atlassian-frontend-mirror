import type { EmojiDefinition } from '@atlaskit/adf-schema';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	defaultEmojiHeight,
	type EmojiId,
	type EmojiProvider,
	type EmojiResource,
	type OptionalEmojiDescriptionWithVariations,
} from '@atlaskit/emoji';
import { NodeDataProvider, isPromise } from '@atlaskit/node-data-provider';

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

	/**
	 * Implementing different re-fetching strategy for emoji.
	 *
	 * Default strategy for NodeDataProvider is to:
	 * 1. If entry is in cache = return from cache
	 * 2. Re-fetch data.
	 * 3. Update cache
	 * 4. Re-render node with fresh data.
	 *
	 * This is similar, but doesn't update the node.
	 * 1. If entry is in cache = return from cache
	 * 2. Re-fetch data.
	 * 3. Update cache
	 */
	getData(
		node: EmojiDefinition | PMNode,
		callback: (
			payload:
				| { data: OptionalEmojiDescriptionWithVariations; error?: undefined }
				| { data?: undefined; error: Error },
		) => void,
	) {
		const cached = this.getNodeDataFromCache(node);
		if (cached && cached.data && !isPromise(cached.data)) {
			callback(cached as { data: OptionalEmojiDescriptionWithVariations });
			if (!isSSR() && typeof requestAnimationFrame !== 'undefined') {
				requestAnimationFrame(() => void this.getDataAsync(node, () => {}));
			}
		} else {
			void this.getDataAsync(node, callback);
		}
	}

	async fetchNodesData(
		nodes: EmojiDefinition[],
	): Promise<OptionalEmojiDescriptionWithVariations[]> {
		// If we have an `optimisticImageApi`, use it to generate a URL immediately.
		// This is how emojis are server-side rendered in Confluence.
		// Without this, the emoji server response will hit timeout on SSR and the emoji will not be rendered.
		//
		// We are using this optimization only in SSR because on client side we need to know a valid emoji size
		// which is not possible to get from optimisticImageApi.
		//
		// Check platform/packages/editor/renderer/src/react/nodes/emoji.tsx
		// and platform/packages/elements/emoji/src/components/common/ResourcedEmojiComponent.tsx
		const getOptimisticImageUrl = this.emojiResource.emojiProviderConfig.optimisticImageApi?.getUrl;
		if (isSSR() && getOptimisticImageUrl) {
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

		const fetches = nodes.map(async (node) => {
			const emojiId: EmojiId = {
				id: node.attrs.id,
				shortName: node.attrs.shortName,
				fallback: node.attrs.text,
			};

			// This usually fast because the emojiProvider already has all emojis fetched.
			const result = await emojiProvider.fetchByEmojiId(emojiId, true);

			// If we have optimisticImageApi, we need to path response and set URL from it to match the URL used in SSR.
			if (getOptimisticImageUrl && result) {
				const optimisticImageURL = getOptimisticImageUrl(emojiId);

				if (result.representation && 'imagePath' in result.representation) {
					return {
						...result,
						representation: {
							...result.representation,
							imagePath: optimisticImageURL,
						},
					};
				}
			}

			return result;
		});

		return Promise.all(fetches);
	}
}
