import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ExtensionParams, Parameters } from '@atlaskit/editor-common/extensions';

/**
 * Merges extensions (displayed as inline) with adjacent textblocks
 *
 * Input:
 * [
 *   { type: 'paragraph', content: [ { type: 'text', text: 'Hello' } ] },
 *   { type: 'bodiedExtension', content: [ { type: 'text', text: 'World' } ] },
 *   { type: 'paragraph', content: [ { type: 'text', text: '!' } ] },
 * ]
 *
 * Output:
 * [
 *   { type: 'paragraph', content: [
 *     { type: 'text', text: 'Hello' },
 *     { type: 'bodiedExtension', content: [ { type: 'text', text: 'World' } ] },
 *     { type: 'text', text: '!' }
 *   ] },
 * ]
 */
export function mergeInlinedExtension({
	nodes,
	shouldDisplayExtensionAsInline,
}: {
	nodes: PMNode[];
	shouldDisplayExtensionAsInline: (extensionParams: ExtensionParams<Parameters>) => boolean;
}): PMNode[] {
	function isInlineBodiedExtension(node?: PMNode | null): boolean {
		return Boolean(
			node?.type.name === 'bodiedExtension' &&
				shouldDisplayExtensionAsInline({
					type: node.type.name,
					extensionKey: node.attrs?.extensionKey,
					extensionType: node.attrs?.extensionType,
					parameters: node.attrs?.parameters,
					content: node.content,
					localId: node.attrs?.localId,
				}),
		);
	}

	try {
		// if it's [inlinedBodiedExtension], wrap it in a textblock
		if (nodes.length === 1 && isInlineBodiedExtension(nodes[0])) {
			return [nodes[0].type.schema.nodes.paragraph.create(null, nodes[0])];
		}

		const newNodes: PMNode[] = [];

		for (const node of nodes) {
			const previousNode: PMNode | undefined = newNodes[newNodes.length - 1];

			// first node
			if (!previousNode) {
				newNodes.push(node);
				continue;
			}

			// textblock + inlinedBodiedExtension
			if (isInlineBodiedExtension(node) && previousNode.isTextblock) {
				newNodes[newNodes.length - 1] = previousNode.copy(previousNode.content.addToEnd(node));
			}
			// textblock(..., inlinedBodiedExtension) + textblock
			else if (
				node.isTextblock &&
				previousNode.isTextblock &&
				isInlineBodiedExtension(previousNode.content.lastChild)
			) {
				newNodes[newNodes.length - 1] = previousNode.copy(
					previousNode.content.append(node.content),
				);
			}
			// inlinedBodiedExtension + textblock
			else if (isInlineBodiedExtension(previousNode) && node.isTextblock) {
				newNodes[newNodes.length - 1] = node.copy(node.content.addToStart(previousNode));
			}
			// inlinedBodiedExtension + non-textblock
			else if (isInlineBodiedExtension(previousNode) && !node.isTextblock) {
				newNodes[newNodes.length - 1] = node.type.schema.nodes.paragraph.create(null, previousNode);
				newNodes.push(node);
			}
			// default case
			else {
				newNodes.push(node);
			}
		}

		return newNodes;
	} catch {}
	return nodes;
}
