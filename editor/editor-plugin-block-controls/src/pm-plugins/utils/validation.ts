import memoizeOne from 'memoize-one';

import { getParentOfTypeCount } from '@atlaskit/editor-common/nesting';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { NodeType, Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { findChildrenByType } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';
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

export const isInSameLayout = ($from: ResolvedPos, $to: ResolvedPos) => {
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

export function canMoveNodeToIndex(
	destParent: PMNode,
	indexIntoParent: number,
	srcNode: PMNode,
	$destNodePos: ResolvedPos,
	destNode?: PMNode,
) {
	let srcNodeType = srcNode.type;

	const parentNodeType = destParent?.type.name;
	const activeNodeType = srcNode?.type.name;
	const isNestingTablesSupported =
		fg('platform_editor_use_nested_table_pm_nodes') &&
		editorExperiment('nested-tables-in-tables', true, { exposure: true });
	const tableNodeType = srcNode.type.schema.nodes.table;
	const expandNodeType = srcNode.type.schema.nodes.expand;

	if (activeNodeType === 'layoutColumn' && editorExperiment('advanced_layouts', true)) {
		// Allow drag layout column and drop into layout section
		if (destNode?.type.name === 'layoutSection' || parentNodeType === 'doc') {
			return true;
		}

		if (
			(parentNodeType === 'tableCell' || parentNodeType === 'tableHeader') &&
			fg('platform_editor_drag_layout_column_into_nodes')
		) {
			const maybeExpandNodesArray = findChildrenByType(srcNode, expandNodeType);
			const layoutColumnContainExpand = maybeExpandNodesArray.length > 0;
			const layoutColumnContainTable = findChildrenByType(srcNode, tableNodeType).length > 0;

			// when layout column content does not contain table, allow to drop into table cell
			if (!layoutColumnContainTable) {
				return true;
			}

			// when layout column content contains table, but does not contain expand, allow drop into table cell if nesting tables is supported, and the nesting depth does not exceed 1
			if (layoutColumnContainTable && !layoutColumnContainExpand) {
				const nestingDepth = getParentOfTypeCount(tableNodeType)($destNodePos);
				return isNestingTablesSupported && nestingDepth <= 1;
			}

			// when layout column content contains an expand, and there is a table inside the expand, should not allow to drop into table cell
			if (layoutColumnContainTable && layoutColumnContainExpand) {
				const isAnyTableNestedInExpand = maybeExpandNodesArray.some(
					(result) => findChildrenByType(result.node, tableNodeType).length > 0,
				);
				return !isAnyTableNestedInExpand;
			}
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

	// NOTE: this will block drop targets from showing for dragging a table into another table
	// unless nested tables are supported and the nesting depth does not exceed 1
	if (
		(parentNodeType === 'tableCell' || parentNodeType === 'tableHeader') &&
		activeNodeType === 'table'
	) {
		const nestingDepth = getParentOfTypeCount(tableNodeType)($destNodePos);
		if (!isNestingTablesSupported || (isNestingTablesSupported && nestingDepth > 1)) {
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

export function canMoveSliceToIndex(
	slice: Slice,
	sliceFromPos: number,
	sliceToPos: number,
	destParent: PMNode,
	indexIntoParent: number,
	$destNodePos: ResolvedPos,
	destNode?: PMNode,
) {
	let canMoveNodes = true;
	const doc = $destNodePos.doc;
	const nodesPos: number[] = [];

	// Drag multiple nodes to be inside themselves not allowed
	if ($destNodePos.pos < sliceToPos && $destNodePos.pos >= sliceFromPos) {
		return false;
	}

	// Multiple layout columns do not drop correctly.
	if (
		slice.content.firstChild?.type.name === 'layoutColumn' &&
		fg('platform_editor_elements_dnd_multi_select_patch_1')
	) {
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
