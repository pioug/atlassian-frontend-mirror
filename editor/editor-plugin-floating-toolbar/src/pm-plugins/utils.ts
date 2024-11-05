import type { Node } from '@atlaskit/editor-prosemirror/model';

// find node in descendants by condition
export function findNode(parent: Node, predicate: (node: Node) => boolean): Node | undefined {
	let matchedNode: Node | undefined;

	parent.descendants((node) => {
		// dont run predicate if node already found
		if (matchedNode) {
			return false;
		}
		if (predicate(node)) {
			matchedNode = node;
			return false;
		}
		return true;
	});
	return matchedNode;
}
