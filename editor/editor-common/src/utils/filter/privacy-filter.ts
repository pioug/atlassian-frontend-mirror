import { traverse } from '@atlaskit/adf-utils/traverse';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { isResolvingMentionProvider, type MentionProvider } from '@atlaskit/mention/resource';

import type { ProviderFactory } from '../../provider-factory';

/**
 * Sanitises a document where some content should not be in the document (e.g. mention names).
 *
 * It is expected that these names we be resolved separately (e.g. when rendering
 * a node view).
 */
export function sanitizeNodeForPrivacy(
	json: JSONDocNode,
	providerFactory?: ProviderFactory,
): JSONDocNode {
	const mentionNames = new Map<string, string>();
	let hasCacheableMentions = false;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const sanitizedJSON = traverse(json as any, {
		mention: (node) => {
			if (node.attrs && node.attrs.text) {
				hasCacheableMentions = true;
				// Remove @ prefix
				const text = node.attrs.text;
				const name = text.startsWith('@') ? text.slice(1) : text;
				mentionNames.set(node.attrs.id, name);
			}
			return {
				...node,
				attrs: {
					...node.attrs,
					text: '',
				},
			};
		},
	}) as JSONDocNode;

	if (hasCacheableMentions && providerFactory) {
		const handler = (_name: string, providerPromise?: Promise<MentionProvider>) => {
			if (providerPromise) {
				providerPromise.then((provider) => {
					if (isResolvingMentionProvider(provider)) {
						mentionNames.forEach((name, id) => {
							provider.cacheMentionName(id, name);
						});
						mentionNames.clear();
						providerFactory.unsubscribe('mentionProvider', handler);
					}
				});
			}
		};
		providerFactory.subscribe('mentionProvider', handler);
	}

	return sanitizedJSON;
}
