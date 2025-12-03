import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type Node as PMNode, type ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import {
	type EditorState,
	NodeSelection,
	type Selection,
	TextSelection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { selectTableClosestToPos } from '@atlaskit/editor-tables/utils';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';

export const getInlineNodePos = (
	doc: PMNode,
	start: number,
	nodeSize: number,
): { inlineNodeEndPos: number; inlineNodePos: number } => {
	const $startPos = doc.resolve(start);
	// To trigger the annotation floating toolbar for non-selectable node, we need to select inline nodes
	// Find the first inline node in the node
	let inlineNodePos: number = start;
	let foundInlineNode = false;
	let inlineNodeEndPos = 0;

	doc.nodesBetween($startPos.pos, $startPos.pos + nodeSize, (n, pos) => {
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

export const isNodeWithCodeBlock = (tr: Transaction, start: number, nodeSize: number) => {
	const $startPos = tr.doc.resolve(start);
	let hasCodeBlock = false;
	tr.doc.nodesBetween($startPos.pos, $startPos.pos + nodeSize, (n) => {
		if (['codeBlock'].includes(n.type.name)) {
			hasCodeBlock = true;
		}
	});
	return hasCodeBlock;
};

const isNodeWithMediaOrExtension = (doc: PMNode, start: number, nodeSize: number) => {
	const $startPos = doc.resolve(start);
	let hasMediaOrExtension = false;
	doc.nodesBetween($startPos.pos, $startPos.pos + nodeSize, (n) => {
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
		nodeName === 'blockquote' && isNodeWithMediaOrExtension(tr.doc, start, nodeSize);
	const isListWithMediaOrExtension =
		(nodeName === 'bulletList' && isNodeWithMediaOrExtension(tr.doc, start, nodeSize)) ||
		(nodeName === 'orderedList' && isNodeWithMediaOrExtension(tr.doc, start, nodeSize));

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
	} else if (nodeName === 'taskList') {
		return TextSelection.create(tr.doc, start, start + nodeSize);
	} else {
		const { inlineNodePos, inlineNodeEndPos } = getInlineNodePos(tr.doc, start, nodeSize);
		return new TextSelection(tr.doc.resolve(inlineNodePos), tr.doc.resolve(inlineNodeEndPos));
	}
};

const newGetSelection = (doc: PMNode, selectionEmpty: boolean, start: number) => {
	const node = doc.nodeAt(start);
	const isNodeSelection = node && NodeSelection.isSelectable(node);
	const nodeSize = node ? node.nodeSize : 1;
	const nodeName = node?.type.name;

	// this is a fix for empty paragraph selection - put first to avoid any extra work
	if (
		nodeName === 'paragraph' &&
		selectionEmpty &&
		node?.childCount === 0 &&
		!expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
	) {
		return false;
	}

	const isParagraphHeadingEmpty =
		['paragraph', 'heading'].includes(nodeName || '') && selectionEmpty && node?.childCount === 0;
	const isBlockQuoteEmpty = nodeName === 'blockquote' && node?.textContent === '';
	const isListEmpty =
		['orderedList', 'bulletList', 'taskList'].includes(nodeName || '') &&
		selectionEmpty &&
		node?.textContent === '';

	// if block menu and empty line format menu are enabled,
	// we want to set the selection to avoid the selection goes to the top of the document
	if (
		(isParagraphHeadingEmpty || isBlockQuoteEmpty || isListEmpty) &&
		expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
	) {
		return TextSelection.create(doc, start + 1, start + 1);
	}

	const isBlockQuoteWithMediaOrExtension =
		nodeName === 'blockquote' && isNodeWithMediaOrExtension(doc, start, nodeSize);

	const isListWithMediaOrExtension =
		(nodeName === 'bulletList' && isNodeWithMediaOrExtension(doc, start, nodeSize)) ||
		(nodeName === 'orderedList' && isNodeWithMediaOrExtension(doc, start, nodeSize));

	if (
		(isNodeSelection && nodeName !== 'blockquote') ||
		isListWithMediaOrExtension ||
		isBlockQuoteWithMediaOrExtension ||
		// decisionList/layoutColumn node is not selectable, but we want to select the whole node not just text
		['decisionList', 'layoutColumn'].includes(nodeName || '') ||
		(nodeName === 'mediaGroup' && typeof node?.childCount === 'number' && node?.childCount > 1)
	) {
		return new NodeSelection(doc.resolve(start));
	}

	// if mediaGroup only has a single child, we want to select the child
	if (nodeName === 'mediaGroup') {
		const $mediaStartPos = doc.resolve(start + 1);
		return new NodeSelection($mediaStartPos);
	}

	if (
		nodeName === 'taskList' &&
		!expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
	) {
		return TextSelection.create(doc, start, start + nodeSize);
	}

	const { inlineNodePos, inlineNodeEndPos } = getInlineNodePos(doc, start, nodeSize);
	return new TextSelection(doc.resolve(inlineNodePos), doc.resolve(inlineNodeEndPos));
};

export const getSelection = (
	tr: Transaction,
	start: number,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
) => {
	if (areToolbarFlagsEnabled(Boolean(api?.toolbar))) {
		return newGetSelection(tr.doc, tr.selection.empty, start);
	}

	return oldGetSelection(tr, start);
};

export const selectNode = (
	tr: Transaction,
	start: number,
	nodeType: string,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
): Transaction => {
	// For table, we need to do cell selection instead of node selection
	if (nodeType === 'table') {
		tr = selectTableClosestToPos(tr, tr.doc.resolve(start + 1));
		return tr;
	}

	const selection = getSelection(tr, start, api);

	if (selection) {
		tr.setSelection(selection);
	}

	return tr;
};

export const setCursorPositionAtMovedNode = (
	tr: Transaction,
	start: number,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
): Transaction => {
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
		areToolbarFlagsEnabled(Boolean(api?.toolbar))
	) {
		const selection = new TextSelection(tr.doc.resolve(start));
		tr.setSelection(selection);
		return tr;
	}

	const { inlineNodeEndPos } = getInlineNodePos(tr.doc, start, nodeSize);
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

/**
 * Collapses the given $from and $to resolved positions to the nearest valid selection range.
 *
 * Will retract the from and to positions to nearest inline positions at node boundaries only if needed.
 *
 * @param $from the resolved start position
 * @param $to the resolved end position
 * @returns An object containing the collapsed $from and $to resolved positions
 */
export const collapseToSelectionRange = ($from: ResolvedPos, $to: ResolvedPos) => {
	// Get the selections that would be made for the first and last node in the range
	// We re-use the getSelection logic as it already handles various node types and edge cases
	// always pass true for selectionEmpty to emulate a cursor selection within the node
	const firstNodeSelection = newGetSelection($from.doc, true, $from.pos);

	const lastNodeSize = $to.nodeBefore?.nodeSize ?? 0;
	const lastNodeStartPos = $to.pos - lastNodeSize;
	const lastNodeSelection = newGetSelection($from.doc, true, lastNodeStartPos);

	// Return a selection spanning from the start of the first node selection to the end of the last node selection
	return {
		$from: $from.doc.resolve(firstNodeSelection ? firstNodeSelection.from : $from.pos),
		$to: $to.doc.resolve(lastNodeSelection ? lastNodeSelection.to : $to.pos),
	};
};
