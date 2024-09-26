import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeClosestToPos,
	findParentNodeOfTypeClosestToPos,
} from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

const excludedNodes = [
	'caption',
	'layoutColumn',
	'listItem',
	'tableHeader',
	'tableCell',
	'tableRow',
	'text',
	'placeholder',
	'unsupportedBlock',
	'unsupportedInline',
	'hardBreak',
	'confluenceUnsupportedBlock',
	'confluenceUnsupportedInline',
	'taskItem',
	'decisionItem',
	...(editorExperiment('nested-dnd', false)
		? ['bulletList', 'orderedList', 'taskList', 'decisionList', 'nestedExpand', 'media']
		: []),
];
export const isExcludedNode = (nodeName: string) => excludedNodes.includes(nodeName);

export const isCursorSelectionAtTopLevel = (selection: Selection) => {
	const { from, to, $from } = selection;

	if (from !== to) {
		return false;
	}

	return $from.parentOffset === 0;
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

export const isNestedInTable = (state: EditorState) => {
	const { schema, selection } = state;
	if (selection instanceof CellSelection) {
		return false;
	}
	const { table } = schema.nodes;

	const tableNode = findParentNodeOfTypeClosestToPos(selection.$from, table);
	if (!tableNode) {
		return false;
	}
	return true;
};

export const getParentNodeDepth = (selection: Selection) => {
	const parentNode = findParentNodeClosestToPos(selection.$from, () => true);
	if (!parentNode) {
		return 0;
	}

	return parentNode.node.type.name === 'heading' || parentNode.node.type.name === 'paragraph'
		? parentNode.depth - 1
		: parentNode.depth;
};

export const isEntireNestedParagraphOrHeadingSelected = (selection: Selection) => {
	const { $from, $to } = selection;

	return $from.textOffset === 0 && $to.textOffset === 0;
};
