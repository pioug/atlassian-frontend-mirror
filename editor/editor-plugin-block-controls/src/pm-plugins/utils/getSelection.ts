import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import { type ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import {
	type EditorState,
	NodeSelection,
	TextSelection,
	type Transaction,
	type Selection,
} from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { selectTableClosestToPos } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

export const getInlineNodePos = (
	tr: Transaction,
	start: number,
	nodeSize: number,
): { inlineNodeEndPos: number; inlineNodePos: number } => {
	const $startPos = tr.doc.resolve(start);
	// To trigger the annotation floating toolbar for non-selectable node, we need to select inline nodes
	// Find the first inline node in the node
	let inlineNodePos: number = start;
	let foundInlineNode = false;
	let inlineNodeEndPos = 0;

	tr.doc.nodesBetween($startPos.pos, $startPos.pos + nodeSize, (n, pos) => {
		if (n.isInline) {
			inlineNodeEndPos = pos + n.nodeSize;
		}

		if (n.isInline && !foundInlineNode) {
			inlineNodePos = pos;
			foundInlineNode = true;
		}

		return true;
	});
	return { inlineNodePos, inlineNodeEndPos };
};

const isNodeWithMediaOrExtension = (tr: Transaction, start: number, nodeSize: number) => {
	const $startPos = tr.doc.resolve(start);
	let hasMediaOrExtension = false;
	tr.doc.nodesBetween($startPos.pos, $startPos.pos + nodeSize, (n) => {
		if (['media', 'extension'].includes(n.type.name)) {
			hasMediaOrExtension = true;
		}
	});
	return hasMediaOrExtension;
};

const oldGetSelection = (tr: Transaction, start: number) => {
	const node = tr.doc.nodeAt(start);
	const isNodeSelection = node && NodeSelection.isSelectable(node);
	const nodeSize = node ? node.nodeSize : 1;
	const $startPos = tr.doc.resolve(start);
	const nodeName = node?.type.name;
	const isBlockQuoteWithMediaOrExtension =
		nodeName === 'blockquote' && isNodeWithMediaOrExtension(tr, start, nodeSize);
	const isListWithMediaOrExtension =
		(nodeName === 'bulletList' && isNodeWithMediaOrExtension(tr, start, nodeSize)) ||
		(nodeName === 'orderedList' && isNodeWithMediaOrExtension(tr, start, nodeSize));

	if (
		(isNodeSelection && nodeName !== 'blockquote') ||
		isListWithMediaOrExtension ||
		isBlockQuoteWithMediaOrExtension ||
		// decisionList/layoutColumn node is not selectable, but we want to select the whole node not just text
		['decisionList', 'layoutColumn'].includes(nodeName || '')
	) {
		return new NodeSelection($startPos);
	} else if (nodeName === 'mediaGroup' && node?.childCount === 1) {
		const $mediaStartPos = tr.doc.resolve(start + 1);
		return new NodeSelection($mediaStartPos);
	} else if (
		// Even though mediaGroup is not selectable,
		// we need a quick way to make all child media nodes appear as selected without the need for a custom selection
		nodeName === 'mediaGroup'
	) {
		return new NodeSelection($startPos);
	} else if (nodeName === 'taskList' && fg('platform_editor_elements_dnd_multi_select_patch_1')) {
		return TextSelection.create(tr.doc, start, start + nodeSize);
	} else {
		const { inlineNodePos, inlineNodeEndPos } = getInlineNodePos(tr, start, nodeSize);
		return new TextSelection(tr.doc.resolve(inlineNodePos), tr.doc.resolve(inlineNodeEndPos));
	}
};

const newGetSelection = (tr: Transaction, start: number) => {
	const node = tr.doc.nodeAt(start);
	const isNodeSelection = node && NodeSelection.isSelectable(node);
	const nodeSize = node ? node.nodeSize : 1;
	const nodeName = node?.type.name;

	// this is a fix for empty paragraph selection - put first to avoid any extra work
	if (
		nodeName === 'paragraph' &&
		tr.selection.empty &&
		node?.childCount === 0 &&
		!expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
	) {
		return false;
	}

	const isParagraphHeadingEmpty =
		['paragraph', 'heading'].includes(nodeName || '') &&
		tr.selection.empty &&
		node?.childCount === 0;
	const isBlockQuoteEmpty = nodeName === 'blockquote' && node?.textContent === '';
	const isListEmpty =
		['orderedList', 'bulletList', 'taskList'].includes(nodeName || '') &&
		tr.selection.empty &&
		node?.textContent === '';

	// if block menu and empty line format menu are enabled,
	// we want to set the selection to avoid the selection goes to the top of the document
	if (
		(isParagraphHeadingEmpty || isBlockQuoteEmpty || isListEmpty) &&
		expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true) &&
		expValEqualsNoExposure('platform_editor_block_menu_empty_line', 'isEnabled', true)
	) {
		return TextSelection.create(tr.doc, start + 1, start + 1);
	}

	const isBlockQuoteWithMediaOrExtension =
		nodeName === 'blockquote' && isNodeWithMediaOrExtension(tr, start, nodeSize);

	const isListWithMediaOrExtension =
		(nodeName === 'bulletList' && isNodeWithMediaOrExtension(tr, start, nodeSize)) ||
		(nodeName === 'orderedList' && isNodeWithMediaOrExtension(tr, start, nodeSize));

	if (
		(isNodeSelection && nodeName !== 'blockquote') ||
		isListWithMediaOrExtension ||
		isBlockQuoteWithMediaOrExtension ||
		// decisionList/layoutColumn node is not selectable, but we want to select the whole node not just text
		['decisionList', 'layoutColumn'].includes(nodeName || '') ||
		(nodeName === 'mediaGroup' && typeof node?.childCount === 'number' && node?.childCount > 1)
	) {
		return new NodeSelection(tr.doc.resolve(start));
	}

	// if mediaGroup only has a single child, we want to select the child
	if (nodeName === 'mediaGroup') {
		const $mediaStartPos = tr.doc.resolve(start + 1);
		return new NodeSelection($mediaStartPos);
	}

	if (
		nodeName === 'taskList' &&
		!expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true) &&
		fg('platform_editor_elements_dnd_multi_select_patch_1')
	) {
		return TextSelection.create(tr.doc, start, start + nodeSize);
	}

	const { inlineNodePos, inlineNodeEndPos } = getInlineNodePos(tr, start, nodeSize);
	return new TextSelection(tr.doc.resolve(inlineNodePos), tr.doc.resolve(inlineNodeEndPos));
};

export const getSelection = (tr: Transaction, start: number) => {
	if (editorExperiment('platform_editor_controls', 'variant1')) {
		return newGetSelection(tr, start);
	}

	return oldGetSelection(tr, start);
};

export const selectNode = (tr: Transaction, start: number, nodeType: string): Transaction => {
	// For table, we need to do cell selection instead of node selection
	if (nodeType === 'table') {
		tr = selectTableClosestToPos(tr, tr.doc.resolve(start + 1));
		return tr;
	}

	const selection = getSelection(tr, start);

	if (selection) {
		tr.setSelection(selection);
	}

	return tr;
};

export const setCursorPositionAtMovedNode = (tr: Transaction, start: number): Transaction => {
	const node = tr.doc.nodeAt(start);
	const isNodeSelection = node && NodeSelection.isSelectable(node);

	const nodeSize = node ? node.nodeSize : 1;
	let selection: GapCursorSelection | TextSelection;
	// decisionList node is not selectable, but we want to select the whole node not just text
	// blockQuote is selectable, but we want to set cursor at the inline end Pos instead of the gap cursor as this causes jittering post drop
	if ((isNodeSelection && node.type.name !== 'blockquote') || node?.type.name === 'decisionList') {
		selection = new GapCursorSelection(tr.doc.resolve(start + node.nodeSize), Side.RIGHT);
		tr.setSelection(selection);
		return tr;
	}

	// this is a fix for empty paragraph selection - can safely use start position as the paragraph is empty
	if (
		node?.type.name === 'paragraph' &&
		node?.childCount === 0 &&
		editorExperiment('platform_editor_controls', 'variant1')
	) {
		const selection = new TextSelection(tr.doc.resolve(start));
		tr.setSelection(selection);
		return tr;
	}

	const { inlineNodeEndPos } = getInlineNodePos(tr, start, nodeSize);
	selection = new TextSelection(tr.doc.resolve(inlineNodeEndPos));

	tr.setSelection(selection);
	return tr;
};

/**
 * Checks if handle position is with the selection or corresponds to a (partially) selected node
 * @param state
 * @param selection
 * @param handlePos
 * @returns
 */
export const isHandleCorrelatedToSelection = (
	state: EditorState,
	selection: Selection,
	handlePos: number,
): boolean => {
	if (selection.empty) {
		return false;
	}
	let nodeStart: number;
	const $selectionFrom = selection.$from;
	if (fg('platform_editor_elements_dnd_multi_select_patch_1')) {
		nodeStart = $selectionFrom.before($selectionFrom.sharedDepth(selection.to) + 1);

		if (nodeStart === $selectionFrom.pos) {
			nodeStart = $selectionFrom.depth ? $selectionFrom.before() : $selectionFrom.pos;
		}

		const $resolvedNodePos = state.doc.resolve(nodeStart);

		if (['tableRow', 'tableCell', 'tableHeader'].includes($resolvedNodePos.node().type.name)) {
			const parentNodeFindRes = findParentNodeOfType(state.schema.nodes['table'])(selection);
			const tablePos = parentNodeFindRes?.pos;
			nodeStart = typeof tablePos === 'undefined' ? nodeStart : tablePos;
		} else if (['listItem'].includes($resolvedNodePos.node().type.name)) {
			nodeStart = $resolvedNodePos.before(rootListDepth($resolvedNodePos));
		} else if (['taskList'].includes($resolvedNodePos.node().type.name)) {
			const listdepth = rootTaskListDepth($resolvedNodePos);
			nodeStart = $resolvedNodePos.before(listdepth);
		} else if (['blockquote'].includes($resolvedNodePos.node().type.name)) {
			nodeStart = $resolvedNodePos.before();
		}
	} else {
		const selectionFrom = $selectionFrom.pos;
		nodeStart = $selectionFrom.depth ? $selectionFrom.before() : selectionFrom;
		const $resolvedNodePos = state.doc.resolve(nodeStart);

		if (['tableRow', 'tableCell', 'tableHeader'].includes($resolvedNodePos.node().type.name)) {
			const parentNodeFindRes = findParentNodeOfType(state.schema.nodes['table'])(selection);
			const tablePos = parentNodeFindRes?.pos;
			nodeStart = typeof tablePos === 'undefined' ? nodeStart : tablePos;
		} else if (['listItem'].includes($resolvedNodePos.node().type.name)) {
			nodeStart = $resolvedNodePos.before(rootListDepth($resolvedNodePos));
		} else if (['taskList'].includes($resolvedNodePos.node().type.name)) {
			const listdepth = rootTaskListDepth($resolvedNodePos);
			nodeStart = $resolvedNodePos.before(listdepth);
		} else if (['blockquote'].includes($resolvedNodePos.node().type.name)) {
			nodeStart = $resolvedNodePos.before();
		}
	}

	return Boolean(handlePos < selection.$to.pos && handlePos >= nodeStart);
};

export const rootListDepth = (itemPos: ResolvedPos) => {
	let depth;
	for (let i = itemPos.depth; i > 1; i -= 2) {
		const node = itemPos.node(i);
		if (node.type.name === 'listItem') {
			depth = i - 1;
		} else {
			break;
		}
	}
	return depth;
};

export const rootTaskListDepth = (taskListPos: ResolvedPos) => {
	let depth;
	for (let i = taskListPos.depth; i > 0; i--) {
		const node = taskListPos.node(i);
		if (node.type.name === 'taskList' || node.type.name === 'taskItem') {
			depth = i;
		} else {
			break;
		}
	}
	return depth;
};
