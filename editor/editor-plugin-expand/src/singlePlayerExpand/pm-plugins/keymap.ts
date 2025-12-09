import { getNextNodeExpandPos, isExpandCollapsed } from '@atlaskit/editor-common/expand';
import {
	backspace,
	bindKeymapWithCommand,
	moveDown,
	moveLeft,
	moveRight,
	moveUp,
	tab,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { SelectionSharedState } from '@atlaskit/editor-common/selection';
import { GapCursorSelection, RelativeSelectionPos, Side } from '@atlaskit/editor-common/selection';
import { findExpand } from '@atlaskit/editor-common/transforms';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyNode, isPositionNearTableRow } from '@atlaskit/editor-common/utils';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { isInTable } from '@atlaskit/editor-tables/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ExpandPlugin } from '../../types';
import { deleteExpand, focusIcon, focusTitle } from '../commands';

const isExpandNode = (node: PMNode) => {
	return node?.type.name === 'expand' || node?.type.name === 'nestedExpand';
};
const isExpandSelected = (selection: Selection) =>
	selection instanceof NodeSelection && isExpandNode(selection.node);

export function expandKeymap(api: ExtractInjectionAPI<ExpandPlugin> | undefined): SafePlugin {
	const list = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		moveRight.common!,
		(state, dispatch, editorView) => {
			if (!editorView) {
				return false;
			}
			const { selection } = state;
			const selectionSharedState: SelectionSharedState =
				api?.selection?.sharedState.currentState() || {};
			const { selectionRelativeToNode } = selectionSharedState;

			if (isExpandSelected(selection) && selectionRelativeToNode === RelativeSelectionPos.Start) {
				return focusTitle(selection.from + 1)(state, dispatch, editorView);
			}
			return false;
		},
		list,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		moveLeft.common!,
		(state, dispatch, editorView) => {
			if (!editorView) {
				return false;
			}
			const { selection } = state;
			const selectionSharedState: SelectionSharedState =
				api?.selection?.sharedState.currentState() || {};
			const { selectionRelativeToNode } = selectionSharedState;

			if (
				isExpandSelected(selection) &&
				(selectionRelativeToNode === undefined ||
					selectionRelativeToNode === RelativeSelectionPos.End)
			) {
				return focusTitle(selection.from + 1)(state, dispatch, editorView);
			}

			return false;
		},
		list,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tab.common!,
		(state, dispatch, editorView) => {
			if (editorView && editorView.dom instanceof HTMLElement) {
				const { from } = state.selection;

				// if the node selected is an expand
				if (isExpandSelected(state.selection)) {
					const expand = editorView.nodeDOM(from);
					if (!expand) {
						return false;
					}
					return focusIcon(expand)(state, dispatch, editorView);
				}

				// if the text selection is inside an expand
				else if (state.selection instanceof TextSelection && !isInTable(state)) {
					const expand = findExpand(state);
					if (expand) {
						const expandNode = editorView.nodeDOM(expand.pos);
						if (expandNode) {
							return focusIcon(expandNode)(state, dispatch, editorView);
						}
					}
				}
			}

			return false;
		},
		list,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		moveUp.common!,
		(state, dispatch, editorView) => {
			if (!editorView) {
				return false;
			}
			const { selection, schema } = state;
			const { nodeBefore } = selection.$from;
			if (
				selection instanceof GapCursorSelection &&
				selection.side === Side.RIGHT &&
				nodeBefore &&
				(nodeBefore.type === schema.nodes.expand ||
					nodeBefore.type === schema.nodes.nestedExpand) &&
				isExpandCollapsed(nodeBefore)
			) {
				const { $from } = selection;
				return focusTitle(Math.max($from.pos - 1, 0))(state, dispatch, editorView);
			}

			const { $from } = state.selection;

			if (editorView.endOfTextblock('up')) {
				const expand = findExpand(state);

				// Moving UP in a table should move the cursor to the row above
				// however when an expand is in a table cell to the left of the
				// current table cell, arrow UP moves the cursor to the left
				// see ED-15425
				if (isPositionNearTableRow($from, schema, 'before') && !expand) {
					return false;
				}

				const prevCursorPos = Math.max($from.pos - $from.parentOffset - 1, 0);
				// move cursor from expand's content to its title
				if (expand && expand.start === prevCursorPos) {
					return focusTitle(expand.start)(state, dispatch, editorView);
				}

				const sel = Selection.findFrom(state.doc.resolve(prevCursorPos), -1);
				const expandBefore = findExpand(state, sel);
				if (sel && expandBefore) {
					// moving cursor from outside of an expand to the title when it is collapsed
					if (isExpandCollapsed(expandBefore.node)) {
						return focusTitle(expandBefore.start)(state, dispatch, editorView);
					}
					// moving cursor from outside of an expand to the content when it is expanded
					else if (dispatch) {
						dispatch(state.tr.setSelection(sel));
					}
					return true;
				}
			}

			return false;
		},
		list,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		moveDown.common!,
		(state, dispatch, editorView) => {
			if (!editorView) {
				return false;
			}
			const { expand, nestedExpand } = state.schema.nodes;
			const { selection } = state;
			const { nodeAfter } = selection.$from;

			if (
				selection instanceof GapCursorSelection &&
				selection.side === Side.LEFT &&
				nodeAfter &&
				(nodeAfter.type === expand || nodeAfter.type === nestedExpand) &&
				isExpandCollapsed(nodeAfter)
			) {
				const { $from } = selection;
				return focusTitle($from.pos + 1)(state, dispatch, editorView);
			}

			if (expValEquals('platform_editor_lovability_navigation_fixes', 'isEnabled', true)) {
				const nextExpandPos = getNextNodeExpandPos(editorView, selection);
				if (nextExpandPos !== undefined) {
					return focusTitle(nextExpandPos)(state, dispatch, editorView);
				}
			}

			if (editorView.endOfTextblock('down')) {
				const { $from } = state.selection;

				if ($from.depth === 0) {
					return false;
				}
				const $after = state.doc.resolve($from.after());
				if (
					$after.nodeAfter &&
					($after.nodeAfter.type === expand || $after.nodeAfter.type === nestedExpand)
				) {
					return focusTitle($after.pos + 1)(state, dispatch, editorView);
				}
			}
			return false;
		},
		list,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		backspace.common!,
		(state, dispatch, editorView) => {
			const { selection } = state;
			const { $from } = selection;
			if (!editorView || !selection.empty) {
				return false;
			}
			const { expand, nestedExpand } = state.schema.nodes;
			const expandNode = findExpand(state);
			if (!expandNode) {
				// @see ED-7977
				const sel = Selection.findFrom(state.doc.resolve(Math.max(selection.$from.pos - 1, 0)), -1);
				const expandBefore = findExpand(state, sel);
				if (
					expandBefore &&
					(expandBefore.node.type === expand || expandBefore.node.type === nestedExpand) &&
					isExpandCollapsed(expandBefore.node)
				) {
					return focusTitle(expandBefore.start)(state, dispatch, editorView);
				}
				return false;
			}
			const parentNode = state.doc.nodeAt($from.before(Math.max($from.depth - 1, 1)));
			// ED-10012 catch cases where the expand has another node nested within it and
			// the backspace should be applied only to the inner node instead of the expand
			if (parentNode && !isExpandNode(parentNode)) {
				return false;
			}
			const textSel = Selection.findFrom(state.doc.resolve(expandNode.pos), 1, true);
			if (
				textSel &&
				selection.$from.pos === textSel.$from.pos &&
				isEmptyNode(state.schema)(expandNode.node) &&
				dispatch
			) {
				return deleteExpand(api?.analytics?.actions)(state, dispatch);
			}

			return false;
		},
		list,
	);
	return keymap(list) as SafePlugin;
}
