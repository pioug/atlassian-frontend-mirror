import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';
import type {
	Fragment,
	MarkType,
	NodeType,
	Mark as PMMark,
	Node as PMNode,
	ResolvedPos,
	Schema,
	Slice,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { CardAppearance } from '@atlaskit/smart-card';

/**
 * Finds all top level nodes affected by the transaction
 * Uses from/to positions in transaction's steps to work out which nodes will
 * be changed by the transaction
 */
export const findChangedNodesFromTransaction = (tr: Transaction): PMNode[] => {
	const nodes: PMNode[] = [];
	const steps = (tr.steps || []) as (Step & {
		from: number;
		slice?: Slice;
		to: number;
	})[];

	steps.forEach((step) => {
		step.getMap().forEach((_oldStart, _oldEnd, newStart, newEnd) => {
			tr.doc.nodesBetween(newStart, Math.min(newEnd, tr.doc.content.size), (node) => {
				if (!nodes.find((n) => n === node)) {
					nodes.push(node);
				}
				return false;
			});
		});
	});

	return nodes;
};

export const validNode = (node: PMNode): boolean => {
	try {
		node.check(); // this will throw an error if the node is invalid
	} catch (error) {
		return false;
	}
	return true;
};

/** Validates prosemirror nodes, and returns true only if all nodes are valid */
export const validateNodes = (nodes: PMNode[]): boolean => nodes.every(validNode);

type PMEntities = PMNode | PMMark | null | undefined;

export const isType = (node: PMEntities, type: NodeType | MarkType | undefined) =>
	type && node && node.type === type;

export const isParagraph = (node: PMEntities, schema: Schema) =>
	isType(node, schema.nodes.paragraph);

export const isText = (node: PMEntities, schema: Schema) => isType(node, schema.nodes.text);

export const isLinkMark = (node: PMEntities, schema: Schema) => isType(node, schema.marks.link);

export enum SelectedState {
	selectedInRange,
	selectedInside,
}

/**
 * Returns if the current selection from achor-head is selecting the node.
 * If the node is not selected then null is returned.
 * If the node is selected then an enum is returned that describes weather the node
 * is fully selected by a range or if the "inside" of the node has been selected or clicked.
 */
export const isNodeSelectedOrInRange = (
	anchorPosition: number,
	headPosition: number,
	nodePosition: number | undefined,
	nodeSize: number,
): SelectedState | null => {
	if (typeof nodePosition !== 'number') {
		return null;
	}

	const rangeStart = Math.min(anchorPosition, headPosition);
	const rangeEnd = Math.max(anchorPosition, headPosition);
	const nodeStart = nodePosition;
	const nodeEnd = nodePosition + nodeSize;
	if (anchorPosition === headPosition) {
		return null;
	}
	if (
		(rangeStart <= nodeStart && nodeEnd < rangeEnd) ||
		(rangeStart < nodeStart && nodeEnd <= rangeEnd)
	) {
		return SelectedState.selectedInRange;
	}
	if (nodeStart <= anchorPosition && headPosition <= nodeEnd) {
		return SelectedState.selectedInside;
	}
	return null;
};

/**
 * Checks if a particular node fragment is supported in the parent
 * @param state EditorState
 * @param fragment The fragment to be checked for
 */
export const isSupportedInParent = (
	state: EditorState,
	fragment: Fragment,
	currentAppearance?: CardAppearance,
): boolean => {
	const depth = currentAppearance === 'embed' || currentAppearance === 'block' ? undefined : -1;
	const parent = state.selection.$from.node(depth);
	return parent && parent.type.validContent(fragment);
};

/**
 * Checks if the passed in node is a media node
 * Includes media, mediaInline, mediaGroup, mediaSingle
 * @param node The PM node to be checked
 */
export const isMediaNode = (node: PMNode): boolean => {
	return ['media', 'mediaInline', 'mediaGroup', 'mediaSingle'].includes(node.type.name);
};

/**
 * Checks if the node before selection is a media node
 * If there is no node before, checks the node before the parent node
 * Includes media, mediaInline, mediaGroup, mediaSingle
 * @param $pos The position of the selection
 * @param state The editor state
 */
export const isNodeBeforeMediaNode = ($pos: ResolvedPos, state: EditorState): boolean => {
	let nodeBefore = $pos.nodeBefore;
	if (!nodeBefore) {
		const depthOfParent = $pos.depth - 1 || 1;
		const parentNode = findParentNodeOfType([
			state.schema.nodes[`${$pos.node(depthOfParent).type.name}`],
		])(state.selection);

		const resolvedPosOfParentNode = parentNode ? state.tr.doc.resolve(parentNode.pos) : undefined;

		const nodeBeforeParent =
			resolvedPosOfParentNode && resolvedPosOfParentNode.pos < state.doc.nodeSize
				? resolvedPosOfParentNode.nodeBefore
				: undefined;

		if (nodeBeforeParent) {
			nodeBefore = nodeBeforeParent;
		}
	}

	if (nodeBefore) {
		return ['media', 'mediaInline', 'mediaGroup', 'mediaSingle'].includes(nodeBefore.type.name);
	}

	return false;
};

const transformer = new JSONTransformer();
export function toJSON(node: PMNode): JSONDocNode {
	return transformer.encode(node);
}

export function nodeToJSON(node: PMNode): JSONNode {
	return transformer.encodeNode(node);
}
