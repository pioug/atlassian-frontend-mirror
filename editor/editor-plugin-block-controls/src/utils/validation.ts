import memoizeOne from 'memoize-one';

import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const isInsideTable = (nodeType: NodeType): Boolean => {
	const { tableCell, tableHeader } = nodeType.schema.nodes;
	return [tableCell, tableHeader].indexOf(nodeType) >= 0;
};

export const isLayoutColumn = (nodeType: NodeType): Boolean => {
	return nodeType === nodeType.schema.nodes.layoutColumn;
};

export const isDoc = (nodeType: NodeType): Boolean => {
	return nodeType === nodeType.schema.nodes.doc;
};

export const isExpand = (nodeType: NodeType): Boolean => {
	return nodeType === nodeType.schema.nodes.expand;
};

export const isNestedExpand = (nodeType: NodeType): Boolean => {
	return nodeType === nodeType.schema.nodes.nestedExpand;
};

/**
 * This function converts an expand into a nested expand,
 * although it may fail based on the expand's content.
 * @param expandNode the node to transform.
 * @returns an nested expand node
 * @throws RangeError: Invalid content for node nestedExpand
 */
export const transformExpandToNestedExpand = (expandNode: PMNode): PMNode | null => {
	const { expand, nestedExpand } = expandNode.type.schema.nodes;

	if (expandNode.type === expand) {
		return nestedExpand.createChecked(expandNode.attrs, expandNode.content, expandNode.marks);
	}

	return null;
};

export const transformSliceExpandToNestedExpand = (slice: Slice): Slice | null => {
	const children = [] as PMNode[];

	try {
		slice.content.forEach((node) => {
			if (isExpand(node.type)) {
				const nestedExpandNode = transformExpandToNestedExpand(node);
				if (nestedExpandNode) {
					children.push(nestedExpandNode);
				}
			} else {
				children.push(node);
			}
		});
	} catch (e) {
		return null;
	}

	return new Slice(Fragment.fromArray(children), slice.openStart, slice.openEnd);
};

export const memoizedTransformExpandToNestedExpand = memoizeOne((node: PMNode) => {
	try {
		return transformExpandToNestedExpand(node);
	} catch (e) {
		return null;
	}
});

export function canMoveNodeToIndex(destParent: PMNode, indexIntoParent: number, srcNode: PMNode) {
	let srcNodeType = srcNode.type;

	const parentNodeType = destParent?.type.name;
	const activeNodeType = srcNode?.type.name;

	// Place experiments here instead of just inside move-node.ts as it stops the drag marker from appearing.
	if (editorExperiment('nest-media-and-codeblock-in-quote', false)) {
		if (
			parentNodeType === 'blockquote' &&
			(activeNodeType === 'mediaGroup' ||
				activeNodeType === 'mediaSingle' ||
				activeNodeType === 'codeBlock')
		) {
			return false;
		}
	}

	// Place experiments here instead of just inside move-node.ts as it stops the drag marker from appearing.
	if (editorExperiment('nested-expand-in-expand', false)) {
		if (
			parentNodeType === 'expand' &&
			(activeNodeType === 'expand' || activeNodeType === 'nestedExpand')
		) {
			return false;
		}
	}

	if (isInsideTable(destParent.type) && isExpand(srcNodeType)) {
		if (memoizedTransformExpandToNestedExpand(srcNode)) {
			srcNodeType = srcNodeType.schema.nodes.nestedExpand;
		} else {
			return false;
		}
	} else if (
		(isDoc(destParent.type) || isLayoutColumn(destParent.type)) &&
		isNestedExpand(srcNodeType)
	) {
		srcNodeType = srcNodeType.schema.nodes.expand;
	}
	return destParent.canReplaceWith(indexIntoParent, indexIntoParent, srcNodeType);
}
