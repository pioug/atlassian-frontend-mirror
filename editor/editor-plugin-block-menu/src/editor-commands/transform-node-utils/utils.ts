import { expandToBlockRange } from '@atlaskit/editor-common/selection';
import type { Schema, Node as PMNode, NodeRange } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type ContentNodeWithPos, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables';
import { findTable, isTableSelected } from '@atlaskit/editor-tables/utils';

import type { NodeTypeName } from './types';

export const getSelectedNode = (selection: Selection): ContentNodeWithPos | undefined => {
	if (selection instanceof NodeSelection) {
		return {
			node: selection.node,
			pos: selection.$from.pos,
			start: 0, // ?
			depth: selection.$from.depth,
		};
	}

	if (selection instanceof CellSelection) {
		const tableSelected = findParentNodeOfType(selection.$from.doc.type.schema.nodes.table)(
			selection,
		);
		return tableSelected;
	}

	if (selection instanceof TextSelection) {
		const { blockquote, bulletList, orderedList, taskList, codeBlock, paragraph, heading } =
			selection.$from.doc.type.schema.nodes;

		const quoteSelected = findParentNodeOfType([blockquote])(selection);
		if (quoteSelected) {
			return quoteSelected;
		}
		const codeBlockSelected = findParentNodeOfType([codeBlock])(selection);
		if (codeBlockSelected) {
			return codeBlockSelected;
		}
		const listSelected = findParentNodeOfType([bulletList, taskList, orderedList])(selection);
		if (listSelected) {
			return listSelected;
		}
		const paragraphOrHeading = findParentNodeOfType([paragraph, heading])(selection);
		if (paragraphOrHeading) {
			return paragraphOrHeading;
		}
	}

	return undefined;
};

export const getTargetNodeTypeNameInContext = (
	nodeTypeName: NodeTypeName | null,
	isNested?: boolean,
): NodeTypeName | null => {
	if (nodeTypeName === 'expand' && isNested) {
		return 'nestedExpand';
	}

	return nodeTypeName;
};

/**
 * Use common expandToBlockRange function to get the correct range for the selection
 * For example, if selection starts in a listItem, go find the bullet list or ordered list, their $from
 * @param selection
 * @param schema
 * @returns
 */
export const expandSelectionToBlockRange = (selection: Selection, schema: Schema) => {
	const { nodes } = schema;
	const nodesNeedToExpandRange = [nodes.bulletList, nodes.orderedList, nodes.taskList, nodes.listItem, nodes.taskItem];

	// when adding nodes.tableRow, tableHeader, tableCell in nodesNeedToExpandRang,
	// expandToBlockRange does not return expected table start position, sometimes even freeze editor
	// so handle table in the below logic
	if (isTableSelected(selection)) {
		const table = findTable(selection);
		if (table) {
			const $from = selection.$from.doc.resolve(table.pos);
			const $to = selection.$from.doc.resolve(table.pos + table.node.nodeSize - 1);
			return { $from, $to, range: $from.blockRange($to) };
		}
	}

	// when selecting a file, selection is on media
	// need to find media group and return its pos
	if (selection instanceof NodeSelection) {
		if (selection.node.type === nodes.media) {
			const mediaGroup = findParentNodeOfType(nodes.mediaGroup)(selection);
			if (mediaGroup) {
				const $from = selection.$from.doc.resolve(mediaGroup.pos);
				const $to = selection.$from.doc.resolve(mediaGroup.pos + mediaGroup.node.nodeSize);
				return { $from, $to };
			}
		}
	}

	return expandToBlockRange(selection.$from, selection.$to, (node) => {
		if (nodesNeedToExpandRange.includes(node.type)) {
			return false;
		}
		return true;
	});
};

export const isListType = (node: PMNode, schema: Schema): boolean => {
	const lists = [schema.nodes.taskList, schema.nodes.bulletList, schema.nodes.orderedList];
	return lists.some((list) => list === node.type);
};

/**
 * Converts a nestedExpand to a regular expand node.
 * NestedExpands can only exist inside expands, so when breaking out or placing
 * in containers that don't support nesting, they must be converted.
 */
export const convertNestedExpandToExpand = (node: PMNode, schema: Schema): PMNode | null => {
	const expandType = schema.nodes.expand;
	if (!expandType) {
		return null;
	}

	return expandType.createAndFill({ title: node.attrs?.title || '' }, node.content);
};

/**
 * Converts an expand to a nestedExpand node.
 * When placing an expand inside another expand, it must become a nestedExpand
 * since expand cannot be a direct child of expand.
 */
export const convertExpandToNestedExpand = (node: PMNode, schema: Schema): PMNode | null => {
	const nestedExpandType = schema.nodes.nestedExpand;
	if (!nestedExpandType) {
		return null;
	}

	return nestedExpandType.createAndFill({ title: node.attrs?.title || '' }, node.content);
};

export const getBlockNodesInRange = (range: NodeRange): PMNode[] => {
	if (range.startIndex === range.endIndex) {
		return [];
	}

	if (range.endIndex - range.startIndex <= 1) {
		return [range.parent.child(range.startIndex)];
	}
	const blockNodes: PMNode[] = [];
	for (let i = range.startIndex; i < range.endIndex; i++) {
		if (range.parent.child(i).isBlock) {
			blockNodes.push(range.parent.child(i));
		}
	}

	return blockNodes;
};
