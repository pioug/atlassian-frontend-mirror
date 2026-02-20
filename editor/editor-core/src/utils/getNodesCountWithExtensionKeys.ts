import type { Node } from '@atlaskit/editor-prosemirror/model';

type NodesAndExtensionKeys = {
	extensionKeys: Record<string, number>;
	nodes: Record<string, number>;
};

/**
 * Counts node types and extension keys in a single traversal.
 * We exclude the end-of-doc token by iterating to nodeSize - 2,
 * which matches the typical ProseMirror pattern for traversing all child nodes.
 */
export function getNodesCountWithExtensionKeys(node: Node): NodesAndExtensionKeys {
	const nodes: Record<string, number> = {};
	const extensionKeys: Record<string, number> = {};
	const extensionNodeNames = [
		'extension',
		'bodiedExtension',
		'inlineExtension',
		'multiBodiedExtension',
	];

	node.nodesBetween(0, node.nodeSize - 2, (currentNode) => {
		nodes[currentNode.type.name] = (nodes[currentNode.type.name] || 0) + 1;

		if (!extensionNodeNames.includes(currentNode.type.name)) {
			return;
		}

		const extensionKey = currentNode.attrs?.extensionKey;

		if (!extensionKey) {
			return;
		}

		extensionKeys[extensionKey] = (extensionKeys[extensionKey] || 0) + 1;
	});

	return { nodes, extensionKeys };
}
