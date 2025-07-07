import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

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
const blockLeafNodesNext = ['blockCard', 'rule', 'extension'];

const DISABLE_CHILD_DROP_TARGET = ['orderedList', 'bulletList'];

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
	const blockLeafNodeList = fg('platform_editor_block_controls_perf_opt_patch_1')
		? blockLeafNodesNext
		: blockLeafNodes;
	// special cases like hr rule here
	if (blockLeafNodeList.includes(nodeType || '') || $pos.pos === 0) {
		const parent = $pos.node(depth);
		const node = $pos.nodeAfter;
		const index = $pos.index();
		const before = index > 0 ? parent.child(index - 1) : null;
		const after = index < parent.childCount - 1 ? parent.child(index + 1) : null;

		return {
			pos: $pos.pos,
			node,
			parent,
			before,
			after,
			index,
			depth,
		} as SurroundingNodes;
	}

	const isRootNode = depth === 1;

	const node = $pos.node(depth);

	// go through the path to find the first node that is not allow child drop target
	// From top to bottom, we check the node types at each depth
	for (let i = 1; i < depth; i++) {
		const nodeType = $pos.node(i).type.name;
		if (DISABLE_CHILD_DROP_TARGET.includes(nodeType)) {
			return findSurroundingNodes(state, state.doc.resolve($pos.before(i + 1)), nodeType);
		}
	}

	if (IGNORE_NODES.includes(node.type.name) && !isRootNode) {
		// If the node is an ignored node, we return the surrounding nodes of its parent
		return findSurroundingNodes(state, state.doc.resolve($pos.before(depth - 1)));
	}

	const pos = depth > 0 ? $pos.before(depth) : 0;
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
