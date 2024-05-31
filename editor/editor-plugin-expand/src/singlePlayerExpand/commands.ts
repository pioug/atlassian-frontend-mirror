import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	MODE,
	PLATFORMS,
} from '@atlaskit/editor-common/analytics';
import { expandedState } from '@atlaskit/editor-common/expand';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import { findExpand } from '@atlaskit/editor-common/transforms';
import type { Command } from '@atlaskit/editor-common/types';
import { createWrapSelectionTransaction } from '@atlaskit/editor-common/utils';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import { findTable } from '@atlaskit/editor-tables/utils';

// Creates either an expand or a nestedExpand node based on the current selection
export const createExpandNode = (state: EditorState): PMNode | null => {
	const { expand, nestedExpand } = state.schema.nodes;
	const expandType = findTable(state.selection) ? nestedExpand : expand;
	const expandNode = expandType.createAndFill({});
	expandedState.set(expandNode!, true);
	return expandNode;
};

export const insertExpand =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const expandNode = createExpandNode(state);

		if (!expandNode) {
			return false;
		}
		const tr = state.selection.empty
			? safeInsert(expandNode)(state.tr).scrollIntoView()
			: createWrapSelectionTransaction({
					state,
					type: expandNode.type,
				});
		const payload: AnalyticsEventPayload = {
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId:
				expandNode?.type === state.schema.nodes.expand
					? ACTION_SUBJECT_ID.EXPAND
					: ACTION_SUBJECT_ID.NESTED_EXPAND,
			attributes: { inputMethod: INPUT_METHOD.INSERT_MENU },
			eventType: EVENT_TYPE.TRACK,
		};

		if (dispatch && expandNode) {
			editorAnalyticsAPI?.attachAnalyticsEvent(payload)(tr);
			dispatch(tr);
		}

		return true;
	};

export const deleteExpand =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const expandNode = findExpand(state);
		if (!expandNode) {
			return false;
		}

		return deleteExpandAtPos(editorAnalyticsAPI)(expandNode.pos, expandNode.node)(state, dispatch);
	};

export const deleteExpandAtPos =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(expandNodePos: number, expandNode: PMNode): Command =>
	(state, dispatch) => {
		if (!expandNode || isNaN(expandNodePos)) {
			return false;
		}

		const payload: AnalyticsEventPayload = {
			action: ACTION.DELETED,
			actionSubject:
				expandNode.type === state.schema.nodes.expand
					? ACTION_SUBJECT.EXPAND
					: ACTION_SUBJECT.NESTED_EXPAND,
			attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
			eventType: EVENT_TYPE.TRACK,
		};

		if (expandNode && dispatch) {
			const { tr } = state;
			tr.delete(expandNodePos, expandNodePos + expandNode.nodeSize);
			editorAnalyticsAPI?.attachAnalyticsEvent(payload)(tr);
			dispatch(tr);
		}

		return true;
	};

// Used to clear any node or cell selection when expand title is focused
export const setSelectionInsideExpand =
	(expandPos: number): Command =>
	(state, dispatch, editorView) => {
		if (editorView) {
			if (!editorView.hasFocus()) {
				editorView.focus();
			}

			const sel = Selection.findFrom(editorView.state.doc.resolve(expandPos), 1, true);
			if (sel && dispatch) {
				dispatch(editorView.state.tr.setSelection(sel));
			}
			return true;
		}
		return false;
	};

export const toggleExpandExpanded =
	({
		editorAnalyticsAPI,
		pos,
		node,
	}: {
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
		pos: number;
		node: PMNode;
	}): Command =>
	(state, dispatch) => {
		if (node && dispatch) {
			const { tr } = state;
			const expanded = expandedState.get(node) ?? false;

			const isExpandedNext = !expanded;
			expandedState.set(node, isExpandedNext);

			// If we're going to collapse the expand and our cursor is currently inside
			// Move to a right gap cursor, if the toolbar is interacted (or an API),
			// it will insert below rather than inside (which will be invisible).
			if (isExpandedNext === true) {
				tr.setSelection(new GapCursorSelection(tr.doc.resolve(pos + node.nodeSize), Side.RIGHT));
			}

			// log when people open/close expands
			// TODO: ED-8523 make platform/mode global attributes?
			const payload: AnalyticsEventPayload = {
				action: ACTION.TOGGLE_EXPAND,
				actionSubject:
					node.type === state.schema.nodes.expand
						? ACTION_SUBJECT.EXPAND
						: ACTION_SUBJECT.NESTED_EXPAND,
				attributes: {
					platform: PLATFORMS.WEB,
					mode: MODE.EDITOR,
					expanded: isExpandedNext,
				},
				eventType: EVENT_TYPE.TRACK,
			};

			editorAnalyticsAPI?.attachAnalyticsEvent(payload)(tr);
			dispatch(tr);
		}
		return true;
	};

export const updateExpandTitle =
	({ title, nodeType, pos }: { title: string; pos: number; nodeType: NodeType }): Command =>
	(state, dispatch) => {
		const node = state.doc.nodeAt(pos);
		if (node && node.type === nodeType && dispatch) {
			const { tr } = state;

			tr.step(
				new SetAttrsStep(pos, {
					...node.attrs,
					title,
				}),
			);

			dispatch(tr);
		}
		return true;
	};

export const focusTitle =
	(pos: number): Command =>
	(state, dispatch, editorView) => {
		if (editorView) {
			const dom = editorView.domAtPos(pos);
			const expandWrapper = dom.node.parentElement;
			if (expandWrapper) {
				setSelectionInsideExpand(pos)(state, dispatch, editorView);
				const input = expandWrapper.querySelector('input');
				if (input) {
					input.focus();
					return true;
				}
			}
		}
		return false;
	};
