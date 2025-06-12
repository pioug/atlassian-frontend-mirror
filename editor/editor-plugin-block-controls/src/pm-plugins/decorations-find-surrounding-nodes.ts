import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

type SurroundingNodes = {
	pos: number; // position of the node
	node: PMNode; // to be dislayed with before/after drop target
	depth: number; // depth of the node in the document
	index: number; // index of the node in its parent
	parent: PMNode; // parent node of the current node
	before: PMNode | null; // node before the current node
	after: PMNode | null; // node after the current node
};

const IGNORE_NODES = ['tableRow', 'listItem', 'caption', 'media'];

const blockLeafNodes = ['blockCard', 'rule'];

/**
 * This function returns the surrounding nodes of a given resolved position in the editor.
 * It provides the position, node, parent, before and after nodes, index, and depth.
 * @param state current editor state
 * @param $pos a resolved position in the editor state.
 * @returns {SurroundingNodes} An object containing the surrounding nodes information.
 * @example
 * const surroundingNodes = findSurroundingNodes(state, $pos);
 */
export const findSurroundingNodes = (
	state: EditorState,
	$pos: ResolvedPos,
	nodeType?: string | null,
): SurroundingNodes => {
	const depth = $pos.depth;

	// special cases like hr rule here
	if (blockLeafNodes.includes(nodeType || '') || $pos.pos === 0) {
		const parent = $pos.node(depth);
		const node = $pos.nodeAfter;
		const index = $pos.index();
		const before = index > 0 ? parent.child(index - 1) : null;
		const after = index < parent.childCount - 1 ? parent.child(index + 1) : null;

		return {
			pos: $pos.pos,
			node: node,
			parent,
			before,
			after,
			index,
			depth: 1,
		} as SurroundingNodes;
	}

	const isRootNode = depth === 1;

	const node = $pos.node(depth);
	const isIgnoredNode = IGNORE_NODES.includes(node.type.name);

	if (isIgnoredNode && !isRootNode) {
		// If the node is an ignored node, we return the surrounding nodes of its parent
		return findSurroundingNodes(state, state.doc.resolve($pos.before(depth - 1)));
	}

	const pos = $pos.before(depth);
	const parent = isRootNode ? state.doc : $pos.node(depth - 1);
	const index = $pos.index(depth - 1);

	const before = index > 0 ? parent.child(index - 1) : null;

	const after = index < parent.childCount - 1 ? parent.child(index + 1) : null;

	return {
		pos,
		node,
		parent,
		before,
		after,
		index,
		depth,
	} as SurroundingNodes;
};
