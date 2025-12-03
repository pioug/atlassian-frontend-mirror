import { logException } from '@atlaskit/editor-common/monitoring';
import {
	Fragment,
	type Node as PMNode,
	type ResolvedPos,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';
import type { TextSelection } from '@atlaskit/editor-prosemirror/state';

const LIST_ITEM_TYPES = new Set(['taskItem', 'decisionItem', 'listItem']);

const LIST_NODE_TYPES = new Set(['taskList', 'bulletList', 'orderedList', 'decisionList']);

/**
 * Find the depth of the deepest common ancestor node.
 */
const getCommonAncestorDepth = ($from: ResolvedPos, $to: ResolvedPos): number => {
	const minDepth = Math.min($from.depth, $to.depth);

	for (let d = 0; d <= minDepth; d++) {
		if ($from.node(d) !== $to.node(d)) {
			return d - 1;
		}
	}

	return minDepth;
};

/**
 * Find the closest parent container node that contains the selection.
 * - For lists: returns the topmost list (to handle nested lists)
 * - For other containers returns the closest one
 * Returns the parent and its position.
 */
export const getCommonParentContainer = (
	$from: ResolvedPos,
	$to: ResolvedPos,
): { node: PMNode | null; pos: number } => {
	const commonDepth = getCommonAncestorDepth($from, $to);

	// Single pass: look for topmost list OR first non-list parent
	let topMostList: PMNode | null = null;
	let topMostListPos = -1;
	let firstNonListParent: PMNode | null = null;
	let firstNonListParentPos = -1;

	for (let depth = commonDepth; depth > 0; depth--) {
		const node = $from.node(depth);

		if (LIST_NODE_TYPES.has(node.type.name)) {
			// Keep updating to find the topmost list (last one found going upward)
			topMostList = node;
			topMostListPos = $from.before(depth);
		} else if (!firstNonListParent && node.type.name !== 'doc') {
			// Only capture the first (innermost) non-list parent
			firstNonListParent = node;
			firstNonListParentPos = $from.before(depth);
		}
	}

	// Return topmost list if found, else first non-list parent
	if (topMostList) {
		return { node: topMostList, pos: topMostListPos };
	}

	return { node: firstNonListParent, pos: firstNonListParentPos };
};

/**
 * Wraps nodes in a doc fragment if there are multiple nodes
 */
export const wrapNodesInDoc = (schema: Schema, nodes: PMNode[]): PMNode => {
	if (nodes.length === 0) {
		return schema.nodes.doc.createChecked({}, Fragment.empty);
	}

	// Single node: return unwrapped
	if (nodes.length === 1) {
		return nodes[0];
	}

	// For multiple nodes, wrap in doc
	try {
		return schema.node('doc', null, Fragment.from(nodes));
	} catch (error) {
		logException(error as Error, { location: 'editor-plugin-selection-extension' });
		return schema.nodes.doc.createChecked({}, Fragment.empty);
	}
};

export const getSelectionInfoFromSameNode = (selection: TextSelection) => {
	const { $from, $to } = selection;

	return {
		selectedNode: $from.node(),
		selectionRanges: [
			{
				start: {
					pointer: `/content/${$from.index()}/text`,
					position: $from.parentOffset,
				},
				end: {
					pointer: `/content/${$from.index()}/text`,
					position: $to.parentOffset,
				},
			},
		],
		nodePos: $from.before(),
	};
};

export const getSelectionInfo = (selection: TextSelection, schema: Schema) => {
	const { $from, $to } = selection;

	// For same parent selections, check for parent container
	if ($from.parent === $to.parent) {
		const { node: parentNode, pos: parentNodePos } = getCommonParentContainer($from, $to);
		if (parentNode) {
			return {
				selectedNode: parentNode,
				nodePos: parentNodePos,
			};
		}

		const nodePos = $from.before();
		return {
			selectedNode: $from.node(),
			nodePos,
		};
	}

	// find the common ancestor
	const range = $from.blockRange($to);

	if (!range) {
		return {
			selectedNode: $from.node(),
			nodePos: $from.depth > 0 ? $from.before() : $from.pos,
		};
	}

	if (range.parent.type.name !== 'doc') {
		// If it's a list OR list item, check for topmost list parent
		if (
			LIST_NODE_TYPES.has(range.parent.type.name) ||
			LIST_ITEM_TYPES.has(range.parent.type.name)
		) {
			const { node: topList, pos: topListPos } = getCommonParentContainer($from, $to);
			if (topList) {
				return {
					selectedNode: topList,
					nodePos: topListPos,
				};
			}
		}

		// For non-list containers (panel, expand, etc.), return the immediate parent
		const nodePos = range.depth > 0 ? $from.before(range.depth) : 0;
		return {
			selectedNode: range.parent,
			nodePos,
		};
	}

	// Extract complete nodes within the block range
	const nodes: PMNode[] = [];
	for (let i = range.startIndex; i < range.endIndex; i++) {
		nodes.push(range.parent.child(i));
	}

	const selectedNode = wrapNodesInDoc(schema, nodes);

	return {
		selectedNode,
		nodePos: range.start,
	};
};
