import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Removes all disallowed marks from a node based on the target node type.
 *
 * @param node - The node to remove marks from.
 * @param targetNode - The target node type to check against.
 * @returns The nodes with the marks removed.
 */
export const removeDisallowedMarks = (nodes: PMNode[], targetNode: NodeType) => {
	return nodes.map((node) => node.mark(targetNode.allowedMarks(node.marks)));
};
