import memoizeOne from 'memoize-one';

import { getParentOfTypeCount, isNestedTablesSupported } from '@atlaskit/editor-common/nesting';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { NodeType, Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';
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

export const isInSameLayout = ($from: ResolvedPos, $to: ResolvedPos): boolean => {
	const fromNode = $from.nodeAfter;
	const toNode = $to.nodeAfter;
	return !!(
		fromNode &&
		toNode &&
		fromNode.type.name === 'layoutColumn' &&
		['layoutSection', 'layoutColumn'].includes(toNode.type.name) &&
		// fromNode can either be in the same layoutSection as toNode or is a layoutColumn inside the toNode (type layoutSection)
		($from.sameParent($to) || $from.parent === toNode)
	);
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

export const transformFragmentExpandToNestedExpand = (fragment: Fragment): Fragment | null => {
	const children = [] as PMNode[];

	try {
		fragment.forEach((node) => {
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

	return Fragment.fromArray(children);
};

export const transformSliceExpandToNestedExpand = (slice: Slice): Slice | null => {
	const fragment = transformFragmentExpandToNestedExpand(slice.content);

	if (!fragment) {
		return null;
	}

	return new Slice(fragment, slice.openStart, slice.openEnd);
};

export const memoizedTransformExpandToNestedExpand = memoizeOne((node: PMNode) => {
	try {
		return transformExpandToNestedExpand(node);
	} catch (e) {
		return null;
	}
});

export const canCreateNodeWithContentInsideAnotherNode = (
	nodeTypesToCreate: NodeType[],
	nodeWithTargetFragment: Fragment,
): boolean => {
	try {
		return !!nodeTypesToCreate.every((nodeTypeToCreate) =>
			nodeTypeToCreate.createChecked({}, nodeWithTargetFragment),
		);
	} catch (e) {
		return false;
	}
};

export function canMoveNodeToIndex(
	destParent: PMNode,
	indexIntoParent: number,
	srcNode: PMNode,
	$destNodePos: ResolvedPos,
	destNode?: PMNode,
): boolean {
	let srcNodeType = srcNode.type;
	const schema = srcNodeType.schema;
	const {
		table,
		tableCell,
		tableHeader,
		expand,
		nestedExpand,
		doc,
		panel,
		layoutColumn,
		layoutSection,
	} = schema.nodes;
	const destParentNodeType = destParent?.type;
	const activeNodeType = srcNode?.type;
	const layoutColumnContent = srcNode.content;
	const isNestingTablesSupported = isNestedTablesSupported(schema);

	if (activeNodeType === layoutColumn && editorExperiment('advanced_layouts', true)) {
		// Allow drag layout column and drop into layout section
		if (destNode?.type === layoutSection || destParentNodeType === doc) {
			return true;
		}

		if (destParentNodeType === tableCell || destParentNodeType === tableHeader) {
			const contentContainsExpand = findChildrenByType(srcNode, expand).length > 0;
			//convert expand to nestedExpand if there are expands inside the layout column
			// otherwise, the createChecked will fail as expand is not a valid child of tableCell/tableHeader, but nestedExpand is
			const convertedFragment = contentContainsExpand
				? transformFragmentExpandToNestedExpand(layoutColumnContent)
				: layoutColumnContent;

			if (!convertedFragment) {
				return false;
			}

			return canCreateNodeWithContentInsideAnotherNode([tableCell, tableHeader], convertedFragment);
		}
		if (destParentNodeType === panel) {
			return canCreateNodeWithContentInsideAnotherNode([panel], layoutColumnContent);
		}

		if (destParentNodeType === expand) {
			return canCreateNodeWithContentInsideAnotherNode([expand], layoutColumnContent);
		}

		if (destParentNodeType === nestedExpand) {
			return canCreateNodeWithContentInsideAnotherNode([nestedExpand], layoutColumnContent);
		}
	}

	// NOTE: this will block drop targets from showing for dragging a table into another table
	// unless nested tables are supported and the nesting depth does not exceed 1
	if (
		(destParentNodeType === tableCell || destParentNodeType === tableHeader) &&
		activeNodeType === table
	) {
		const nestingDepth = getParentOfTypeCount(table)($destNodePos);
		if (!isNestingTablesSupported || (isNestingTablesSupported && nestingDepth > 1)) {
			return false;
		}
	}

	if (isInsideTable(destParent.type) && isExpand(srcNodeType)) {
		if (memoizedTransformExpandToNestedExpand(srcNode)) {
			srcNodeType = nestedExpand;
		} else {
			return false;
		}
	} else if (
		(isDoc(destParent.type) || isLayoutColumn(destParent.type)) &&
		isNestedExpand(srcNodeType)
	) {
		srcNodeType = expand;
	}
	return destParent.canReplaceWith(indexIntoParent, indexIntoParent, srcNodeType);
}

export function canMoveSliceToIndex(
	slice: Slice,
	sliceFromPos: number,
	sliceToPos: number,
	destParent: PMNode,
	indexIntoParent: number,
	$destNodePos: ResolvedPos,
	destNode?: PMNode,
): boolean {
	let canMoveNodes = true;
	const doc = $destNodePos.doc;
	const nodesPos: number[] = [];

	// Drag multiple nodes to be inside themselves not allowed
	if ($destNodePos.pos < sliceToPos && $destNodePos.pos >= sliceFromPos) {
		return false;
	}

	// Multiple layout columns do not drop correctly.
	if (slice.content.firstChild?.type.name === 'layoutColumn') {
		return false;
	}

	for (let i = 0; i < slice.content.childCount; i++) {
		const node = slice.content.maybeChild(i);
		if (i === 0) {
			nodesPos[i] = sliceFromPos;
		} else {
			nodesPos[i] = nodesPos[i - 1] + (slice.content.maybeChild(i - 1)?.nodeSize || 0);
		}

		if (node && node.isInline) {
			// If the node is an inline node, we need to find the parent node
			// as passing in them into canMoveNodeToIndex will return false
			const $nodePos = doc.resolve(nodesPos[i]);
			const parentNode = $nodePos.parent;
			if (
				!parentNode ||
				(parentNode &&
					!canMoveNodeToIndex(destParent, indexIntoParent, parentNode, $destNodePos, destNode))
			) {
				canMoveNodes = false;
				break;
			}
		} else if (
			node &&
			!canMoveNodeToIndex(destParent, indexIntoParent, node, $destNodePos, destNode)
		) {
			canMoveNodes = false;
			break;
		}
	}

	return canMoveNodes;
}
