import { getNodeSelectionForPos, selectNodeAtPos } from '@atlaskit/editor-common/node-selection';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import { areToolbarFlagsEnabled } from '@atlaskit/editor-common/toolbar-flag-check';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { selectTableClosestToPos } from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags/fg';

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

export const isNodeWithCodeBlock = (tr: Transaction, start: number, nodeSize: number): boolean => {
	const $startPos = tr.doc.resolve(start);
	let hasCodeBlock = false;
	tr.doc.nodesBetween($startPos.pos, $startPos.pos + nodeSize, (n) => {
		if (['codeBlock'].includes(n.type.name)) {
			hasCodeBlock = true;
		}
	});
	return hasCodeBlock;
};

/**
 * Gets the appropriate selection for the node at the given start position.
 *
 * @param doc The ProseMirror document.
 * @param selectionEmpty Indicates if the current selection is empty.
 * @param start The start position of the node.
 * @returns The appropriate selection for the node.
 */
export const newGetSelection = (
	doc: PMNode,
	selectionEmpty: boolean,
	start: number,
): false | TextSelection | NodeSelection => {
	if (fg('platform_editor_maui_jira_updates')) {
		return getNodeSelectionForPos(doc, start) || false;
	}

	const node = doc.nodeAt(start);
	const nodeName = node?.type.name;

	// if mediaGroup only has a single child, we want to select the child
	if (nodeName === 'mediaGroup' && node?.childCount === 1) {
		const $mediaStartPos = doc.resolve(start + 1);
		return new NodeSelection($mediaStartPos);
	}
	return new NodeSelection(doc.resolve(start));
};

export const getSelection = (
	tr: Transaction,
	start: number,
): false | TextSelection | NodeSelection => {
	return newGetSelection(tr.doc, tr.selection.empty, start);
};

export const selectNode = (
	tr: Transaction,
	start: number,
	nodeType: string,
	api?: ExtractInjectionAPI<BlockControlsPlugin>,
): Transaction => {
	if (fg('platform_editor_maui_jira_updates')) {
		return selectNodeAtPos(tr, start, nodeType);
	}

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

export const rootListDepth = (itemPos: ResolvedPos): number | undefined => {
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

export const rootTaskListDepth = (taskListPos: ResolvedPos): number | undefined => {
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
