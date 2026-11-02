import type { Command } from '@atlaskit/editor-common/types/command';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';

import { getExpandTitleInput } from '../utils';

type EmptyLineAfterCollapsedExpand = {
	expandContentStart: number;
	lineEnd: number;
	lineStart: number;
};

/**
 * The empty paragraph holding the caret, when its previous sibling is a collapsed expand or nested
 * expand and it is not the last child of its container. The last child is kept so there is always a
 * line to type in after the expand.
 */
const getEmptyLineAfterCollapsedExpand = (
	state: EditorState,
	isCollapsed: (expandNode: PMNode) => boolean,
): EmptyLineAfterCollapsedExpand | undefined => {
	const { $from } = state.selection;
	const { paragraph, expand, nestedExpand } = state.schema.nodes;
	const textblock = $from.parent;
	if (textblock.type !== paragraph || textblock.content.size > 0) {
		return undefined;
	}

	const container = $from.node(-1);
	const index = $from.index(-1);
	const isLastChild = index === container.childCount - 1;
	if (index === 0 || isLastChild) {
		return undefined;
	}

	const previousSibling = container.child(index - 1);
	const isExpand = previousSibling.type === expand || previousSibling.type === nestedExpand;
	if (!isExpand || !isCollapsed(previousSibling)) {
		return undefined;
	}

	const lineStart = $from.before();
	return {
		expandContentStart: lineStart - previousSibling.nodeSize + 1,
		lineStart,
		lineEnd: $from.after(),
	};
};

type DeleteEmptyLineAfterCollapsedExpandOptions = {
	/** The plugin's own `focusTitle`, used when the title input is re-rendered by the delete. */
	focusTitle: (pos: number) => Command;
	isCollapsed: (expandNode: PMNode) => boolean;
};

/**
 * Backspace in an empty line directly after a collapsed expand: deletes the line and moves focus to
 * the end of the expand title, in one transaction. Returns false, without changing anything, when
 * the caret is anywhere else or the title input cannot be found, so other Backspace handling runs.
 */
export const deleteEmptyLineAfterCollapsedExpand =
	({ focusTitle, isCollapsed }: DeleteEmptyLineAfterCollapsedExpandOptions): Command =>
	(state, dispatch, editorView) => {
		if (!editorView || !state.selection.empty) {
			return false;
		}
		const emptyLine = getEmptyLineAfterCollapsedExpand(state, isCollapsed);
		if (!emptyLine) {
			return false;
		}
		const titleInput = getExpandTitleInput(editorView, emptyLine.expandContentStart);
		if (!titleInput) {
			return false;
		}
		if (!dispatch) {
			return true;
		}

		const tr = state.tr.delete(emptyLine.lineStart, emptyLine.lineEnd);
		const selectionInsideExpand = Selection.findFrom(
			tr.doc.resolve(emptyLine.expandContentStart),
			1,
			true,
		);
		if (selectionInsideExpand) {
			tr.setSelection(selectionInsideExpand);
		}
		dispatch(tr);

		const titleInputAfterDelete = getExpandTitleInput(editorView, emptyLine.expandContentStart);
		if (!titleInputAfterDelete?.isConnected) {
			focusTitle(emptyLine.expandContentStart)(editorView.state, dispatch, editorView);
			return true;
		}
		titleInputAfterDelete.focus();
		const titleEnd = titleInputAfterDelete.value.length;
		titleInputAfterDelete.setSelectionRange(titleEnd, titleEnd);
		return true;
	};
