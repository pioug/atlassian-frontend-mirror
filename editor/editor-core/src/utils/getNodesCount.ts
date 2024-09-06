import type { Node } from '@atlaskit/editor-prosemirror/model';

export function getNodesCount(node: Node): Record<string, number> {
	let count: Record<string, number> = {};

	node.nodesBetween(0, node.nodeSize - 2, (node) => {
		count[node.type.name] = (count[node.type.name] || 0) + 1;
	});

	return count;
}
