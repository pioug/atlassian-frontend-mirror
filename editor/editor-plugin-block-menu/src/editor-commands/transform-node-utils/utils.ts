import type { NodeRange, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { type ContentNodeWithPos, findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables';

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
	parentNode?: PMNode,
): NodeTypeName | null => {
	if (
		parentNode &&
		isNested &&
		(parentNode.type.name === 'layoutColumn' || parentNode.type.name === 'bodiedSyncBlock')
	) {
		return nodeTypeName;
	}

	if (nodeTypeName === 'expand' && isNested) {
		return 'nestedExpand';
	}

	return nodeTypeName;
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

/**
 * Converts a text node (heading, paragraph) to a paragraph preserving its inline content.
 * This is used when a text node can't be wrapped directly in the target container
 * (e.g., heading can't go in blockquote, so it becomes a paragraph).
 */
export const convertTextNodeToParagraph = (node: PMNode, schema: Schema): PMNode | null => {
	// If it's already a paragraph, return as-is
	if (node.type.name === 'paragraph') {
		return node;
	}
	// Convert heading (or other text node) to paragraph with same inline content
	return schema.nodes.paragraph.createAndFill({}, node.content) ?? null;
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

/**
 * Iterates over a nodes children and extracting text content, removing all other inline content and converting
 * hardbreaks to newlines.
 *
 * @param node - The node to create text content from (should be paragraph)
 * @returns The text content string.
 */
export const createTextContent = (node: PMNode): string => {
	const textContent = node.children.map((child) => {
		if (child.isText) {
			return child.text;
		} else if (child.type.name === 'hardBreak') {
			return '\n';
		}
		return '';
	});
	return textContent.join('');
};
