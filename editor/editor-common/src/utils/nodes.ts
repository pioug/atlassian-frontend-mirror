import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';
import type { MarkType, NodeType, Mark as PMMark, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

import { SelectedState } from './SelectedState';
import { validNode } from './validNode';

/** Validates prosemirror nodes, and returns true only if all nodes are valid */
export const validateNodes = (nodes: PMNode[]): boolean => nodes.every(validNode);

type PMEntities = PMNode | PMMark | null | undefined;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isType = (
	node: PMEntities,
	type: NodeType | MarkType | undefined,
): boolean | null | undefined => type && node && node.type === type;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isParagraph = (node: PMEntities, schema: Schema): boolean | null | undefined =>
	isType(node, schema.nodes.paragraph);

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isText = (node: PMEntities, schema: Schema): boolean | null | undefined =>
	isType(node, schema.nodes.text);

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const isLinkMark = (node: PMEntities, schema: Schema): boolean | null | undefined =>
	isType(node, schema.marks.link);

/**
 * Returns if the current selection from achor-head is selecting the node.
 * If the node is not selected then null is returned.
 * If the node is selected then an enum is returned that describes weather the node
 * is fully selected by a range or if the "inside" of the node has been selected or clicked.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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

const transformer = new JSONTransformer();
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function toJSON(node: PMNode): JSONDocNode {
	return transformer.encode(node);
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function nodeToJSON(node: PMNode): JSONNode {
	return transformer.encodeNode(node);
}
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { findChangedNodesFromTransaction } from './findChangedNodesFromTransaction';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { validNode } from './validNode';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { SelectedState } from './SelectedState';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isSupportedInParent } from './isSupportedInParent';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isMediaNode } from './isMediaNode';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isNodeBeforeMediaNode } from './isNodeBeforeMediaNode';
