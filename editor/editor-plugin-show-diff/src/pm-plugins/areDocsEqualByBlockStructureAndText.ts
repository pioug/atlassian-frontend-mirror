import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Returns true if both nodes have the same tree structure (type and child count at every level).
 */
function isBlockStructureEqual(node1: PMNode, node2: PMNode): boolean {
	if (node1.type !== node2.type || node1.childCount !== node2.childCount) {
		return false;
	}
	for (let i = 0; i < node1.childCount; i++) {
		if (!isBlockStructureEqual(node1.child(i), node2.child(i))) {
			return false;
		}
	}
	return true;
}

/**
 * Looser equality for "safe diff" cases: same full text content and same block structure
 * (e.g. text moved across text-node boundaries). Used when strict areNodesEqualIgnoreAttrs fails.
 * This is safe because we ensure decorations get applied to valid positions.
 */
export function areDocsEqualByBlockStructureAndText(doc1: PMNode, doc2: PMNode): boolean {
	return (
		doc1.textContent === doc2.textContent &&
		doc1.nodeSize === doc2.nodeSize &&
		isBlockStructureEqual(doc1, doc2)
	);
}
