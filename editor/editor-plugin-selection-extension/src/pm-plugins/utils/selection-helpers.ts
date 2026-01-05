import { logException } from '@atlaskit/editor-common/monitoring';
import {
	Fragment,
	type Node as PMNode,
	type ResolvedPos,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';
import type { TextSelection } from '@atlaskit/editor-prosemirror/state';

import type { SelectionRange } from '../../types';

const LIST_ITEM_TYPES = new Set(['taskItem', 'decisionItem', 'listItem']);

const LIST_NODE_TYPES = new Set(['taskList', 'bulletList', 'orderedList', 'decisionList']);

/**
 * Build a JSON pointer path for a node within the selectedNode structure.
 * @param pathIndices - Array of content indices representing the path to the node
 */
const buildJsonPointer = (pathIndices: number[]): string =>
	pathIndices.map((index) => `/content/${index}`).join('');

/**
 * Build selection ranges for multi-node selections.
 * This function traverses the selectedNode and creates JSON pointer-based ranges
 * that describe what parts of the selectedNode are included in the selection.
 */
export const buildSelectionRanges = (
	selectedNode: PMNode,
	selectedNodePos: number,
	$from: ResolvedPos,
	$to: ResolvedPos,
): SelectionRange[] | undefined => {
	const selectionStart = $from.pos;
	const selectionEnd = $to.pos;

	const tokenOffset = selectedNode.type.name === 'doc' ? 0 : 1;
	const nodeStart = selectedNodePos + tokenOffset;
	const nodeEnd = selectedNodePos + selectedNode.nodeSize - tokenOffset;

	// If selection spans entire content, return undefined (complete block selection)
	if (selectionStart <= nodeStart && selectionEnd >= nodeEnd) {
		return undefined;
	}

	const selectionRanges: SelectionRange[] = [];

	// Traverse the selectedNode and find all nodes/text within the selection range
	const traverse = (node: PMNode, nodePos: number, path: number[]) => {
		const nodeEndPos = nodePos + node.nodeSize;

		// Skip nodes completely before or after selection
		if (nodeEndPos <= selectionStart || nodePos >= selectionEnd) {
			return;
		}

		if (node.isText) {
			const textStart = nodePos;
			const textEnd = nodePos + (node.text?.length || 0);
			const rangeStart = Math.max(textStart, selectionStart);
			const rangeEnd = Math.min(textEnd, selectionEnd);

			if (rangeStart < rangeEnd) {
				const pointer = `${buildJsonPointer(path)}/text`;
				selectionRanges.push({
					start: { pointer, position: rangeStart - textStart },
					end: { pointer, position: rangeEnd - textStart },
				});
			}
		} else if (node.content.size > 0) {
			const contentStart = nodePos + 1;
			const contentEnd = nodeEndPos - 1;
			const isWholeBlockSelected =
				node.isBlock &&
				!node.isTextblock &&
				!LIST_NODE_TYPES.has(node.type.name) &&
				selectionStart <= contentStart &&
				selectionEnd >= contentEnd;

			if (isWholeBlockSelected) {
				const pointer = buildJsonPointer(path);
				selectionRanges.push({ start: { pointer }, end: { pointer } });
			} else {
				// Traverse children for textblocks, lists, or partial selections
				let childPos = nodePos + 1;
				for (let i = 0; i < node.content.childCount; i++) {
					traverse(node.content.child(i), childPos, [...path, i]);
					childPos += node.content.child(i).nodeSize;
				}
			}
		} else if (nodePos >= selectionStart && nodeEndPos <= selectionEnd) {
			// Handle leaf nodes (e.g., hardBreak, image)
			const pointer = buildJsonPointer(path);
			selectionRanges.push({ start: { pointer }, end: { pointer } });
		}
	};

	// Traverse each child of the selectedNode
	let childPos = nodeStart;
	for (let i = 0; i < selectedNode.content.childCount; i++) {
		const child = selectedNode.content.child(i);
		traverse(child, childPos, [i]);
		childPos += child.nodeSize;
	}

	return selectionRanges.length > 0 ? selectionRanges : undefined;
};

/** Find the depth of the deepest common ancestor node. */
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
			const selectionRanges = buildSelectionRanges(parentNode, parentNodePos, $from, $to);
			return {
				selectedNode: parentNode,
				nodePos: parentNodePos,
				selectionRanges,
			};
		}

		const nodePos = $from.before();
		const selectionRanges = buildSelectionRanges($from.node(), nodePos, $from, $to);
		return {
			selectedNode: $from.node(),
			nodePos,
			selectionRanges,
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
		// For lists, find topmost list parent; otherwise use immediate parent
		if (
			LIST_NODE_TYPES.has(range.parent.type.name) ||
			LIST_ITEM_TYPES.has(range.parent.type.name)
		) {
			const { node: topList, pos: topListPos } = getCommonParentContainer($from, $to);
			if (topList) {
				const selectionRanges = buildSelectionRanges(topList, topListPos, $from, $to);
				return {
					selectedNode: topList,
					nodePos: topListPos,
					selectionRanges,
				};
			}
		}

		const nodePos = range.depth > 0 ? $from.before(range.depth) : 0;
		const selectionRanges = buildSelectionRanges(range.parent, nodePos, $from, $to);
		return {
			selectedNode: range.parent,
			nodePos,
			selectionRanges,
		};
	}

	// Extract complete nodes within the block range
	const nodes: PMNode[] = [];
	for (let i = range.startIndex; i < range.endIndex; i++) {
		nodes.push(range.parent.child(i));
	}

	const selectedNode = wrapNodesInDoc(schema, nodes);
	const selectionRanges = buildSelectionRanges(selectedNode, range.start, $from, $to);

	return {
		selectedNode,
		nodePos: range.start,
		selectionRanges,
	};
};
