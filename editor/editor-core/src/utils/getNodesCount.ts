import type { Node } from '@atlaskit/editor-prosemirror/model';

// When experiment platform_editor_prosemirror_rendered_data is removed, review whether this helper is still needed.
export function getNodesCount(node: Node): Record<string, number> {
	const count: Record<string, number> = {};

	node.nodesBetween(0, node.nodeSize - 2, (node) => {
		count[node.type.name] = (count[node.type.name] || 0) + 1;
	});

	return count;
}
