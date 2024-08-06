import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export function canMoveToIndex(destParent: PMNode, indexIntoParent: number, srcType: NodeType) {
	return destParent.canReplaceWith(indexIntoParent, indexIntoParent, srcType);
}
