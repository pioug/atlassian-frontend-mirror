import { expandToBlockRange } from '@atlaskit/editor-common/selection';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
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
	const nodesNeedToExpandRange = [nodes.listItem, nodes.taskItem];

	// when adding nodes.tableRow, tableHeader, tableCell in nodesNeedToExpandRang,
	// expandToBlockRange does not return expected table start position, sometimes even freeze editor
	// so handle table in the below logic
	if (isTableSelected(selection)) {
		const table = findTable(selection);
		if (table) {
			const $from = selection.$from.doc.resolve(table.pos);
			const $to = selection.$from.doc.resolve(table.pos + table.node.nodeSize - 1);
			return { $from, $to };
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
