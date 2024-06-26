import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';

const excludedNodes = [
	'caption',
	'layoutColumn',
	'listItem',
	'nestedExpand',
	'tableHeader',
	'tableCell',
	'tableRow',
	'text',
	'placeholder',
	'unsupportedBlock',
	'unsupportedInline',
	'hardBreak',
	'media',
	'confluenceUnsupportedBlock',
	'confluenceUnsupportedInline',
	'bulletList',
	'orderedList',
	'taskList',
	'taskItem',
	'decisionList',
	'decisionItem',
];
export const isExcludedNode = (nodeName: string) => excludedNodes.includes(nodeName);

export const isCursorSelectionAndInsideTopLevelNode = (selection: Selection) => {
	const { $from, from, to } = selection;
	if (from !== to || $from.depth > 1) {
		return false;
	}

	return true;
};

const inlineNodes = [
	'emoji',
	'date',
	'status',
	'mention',
	'mediaInline',
	'inlineCard',
	'inlineExtension',
];
export const isInlineNode = (nodeName: string) => {
	return inlineNodes.includes(nodeName);
};

export const isNestedInlineNode = (selection: Selection) => {
	if (selection.$from.depth !== 1) {
		return true;
	}

	// check if the node is a part of a larger paragraph or heading
	const parentSize = selection.$from.parent.content.size;
	const contentSize = selection.content().size;
	const parentChildCount = selection.$from.parent.childCount;
	// when the node was copied and pasted, it won't have extra space the parent has only one child
	if (parentChildCount === 1) {
		return false;
	}

	// some inline nodes (like date and emoji) when inserted have extra space that is stores as a child
	if (parentChildCount === 2 && parentSize - contentSize === 1) {
		return false;
	}

	return true;
};

const blockNodes = [
	'bodiedExtension',
	'blockCard',
	'codeBlock',
	'embedCard',
	'expand',
	'extension',
	'layoutSection',
	'mediaGroup',
	'mediaSingle',
	'panel',
	'rule',
];
export const isBlockNodeWithoutTable = (nodeName: string) => {
	return blockNodes.includes(nodeName);
};

const parentNodes = ['expand', 'extension', 'bodiedExtension', 'layoutSection'];
export const isNestedTable = (selection: Selection) => {
	const parentNode = selection.$anchor.node(1);
	return parentNode && parentNodes.includes(parentNode.type.name);
};

const getPastedNameOfInlineNode = (nodeName: string) => {
	if (inlineNodes.includes(nodeName)) {
		return 'paragraph';
	}

	return nodeName;
};

export const isValidNodeName = (copiedNodeName: string, pastedNodeName: string) => {
	if (copiedNodeName === pastedNodeName) {
		return true;
	}

	if (getPastedNameOfInlineNode(copiedNodeName) === pastedNodeName) {
		return true;
	}

	return false;
};

export const isTextSelection = (selection: Selection) => {
	return selection instanceof TextSelection && selection.from !== selection.to;
};

export const isNodeSelection = (selection: Selection) => {
	return selection instanceof NodeSelection;
};

const isEntireHeadingOrParagraphSelected = (
	selection: Selection,
	nodeName: 'paragraph' | 'heading',
) => {
	if (!isTextSelection(selection)) {
		return false;
	}

	const { $from, $to } = selection;
	if (!($from.parent.type.name === nodeName)) {
		return false;
	}

	if ($from.parent === $to.parent) {
		const node = $from.parent;
		return $from.parentOffset === 0 && $to.parentOffset === node.content.size;
	}
};

export const isEntireTopLevelHeadingOrParagraphSelected = (
	selection: Selection,
	nodeName: 'paragraph' | 'heading',
) => {
	if (selection.$from.depth !== 1) {
		return false;
	}

	return isEntireHeadingOrParagraphSelected(selection, nodeName);
};

export const isEntireTopLevelBlockquoteSelected = (state: EditorState) => {
	const { schema, selection } = state;
	const { blockquote } = schema.nodes;
	const blockquoteNode = findParentNodeOfTypeClosestToPos(selection.$from, blockquote);
	if (!blockquoteNode) {
		return false;
	}

	// checks if it is a top level blockquote
	const { depth } = blockquoteNode;
	if (depth !== 1) {
		return false;
	}

	const { from, to } = selection;
	let selectedNodesCount = 0;
	state.doc.nodesBetween(from, to, (node, pos) => {
		if (pos >= from && pos + node.nodeSize <= to) {
			selectedNodesCount++;
			return false;
		}
	});

	return selectedNodesCount === blockquoteNode.node.childCount;
};
