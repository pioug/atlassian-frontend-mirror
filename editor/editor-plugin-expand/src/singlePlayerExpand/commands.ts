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
import { expandClassNames } from '@atlaskit/editor-common/styles';
import { findExpand } from '@atlaskit/editor-common/transforms';
import type { Command, EditorCommand } from '@atlaskit/editor-common/types';
import { createWrapSelectionTransaction } from '@atlaskit/editor-common/utils';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, safeInsert } from '@atlaskit/editor-prosemirror/utils';
import { findTable } from '@atlaskit/editor-tables/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { InsertMethod } from '../types';
import { isNestedInExpand } from '../utils';

// Creates either an expand or a nestedExpand node based on the current selection
export const createExpandNode = (
	state: EditorState,
	setExpandedState: boolean = true,
): PMNode | null => {
	const { expand, nestedExpand } = state.schema.nodes;

	const isSelectionInTable = !!findTable(state.selection);
	const isSelectionInExpand = isNestedInExpand(state);

	const expandType = isSelectionInTable || isSelectionInExpand ? nestedExpand : expand;

	const expandNode = expandType.createAndFill({});
	if (setExpandedState) {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expandedState.set(expandNode!, true);
	}
	return expandNode;
};

export const insertExpandWithInputMethod =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputMethod: InsertMethod): Command =>
	(state, dispatch) => {
		const expandNode = createExpandNode(state, false);

		if (!expandNode) {
			return false;
		}

		let tr;
		if (state.selection.empty) {
			tr = safeInsert(expandNode)(state.tr).scrollIntoView();
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expandedState.set(expandNode!, true);
		} else {
			tr = createWrapSelectionTransaction({
				state,
				type: expandNode.type,
			});
			const wrapperNode = findParentNodeOfType(expandNode.type)(tr.selection);
			if (wrapperNode) {
				expandedState.set(wrapperNode.node, true);
			}
		}

		const payload: AnalyticsEventPayload = {
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId:
				expandNode?.type === state.schema.nodes.expand
					? ACTION_SUBJECT_ID.EXPAND
					: ACTION_SUBJECT_ID.NESTED_EXPAND,
			attributes: { inputMethod },
			eventType: EVENT_TYPE.TRACK,
		};

		if (dispatch && expandNode) {
			editorAnalyticsAPI?.attachAnalyticsEvent(payload)(tr);
			dispatch(tr);
		}

		return true;
	};

export const insertExpand =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		return insertExpandWithInputMethod(editorAnalyticsAPI)(INPUT_METHOD.INSERT_MENU)(
			state,
			dispatch,
		);
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
			attributes: {
				inputMethod: INPUT_METHOD.FLOATING_TB,
			},
			eventType: EVENT_TYPE.TRACK,
		};

		if (expandNode && dispatch) {
			const { tr } = state;
			tr.delete(expandNodePos, expandNodePos + expandNode.nodeSize);
			editorAnalyticsAPI?.attachAnalyticsEvent(payload)(tr);

			if (expandNode.type === state.schema.nodes.nestedExpand) {
				const resolvedPos = tr.doc.resolve(expandNodePos + 1);

				if (resolvedPos) {
					tr.setSelection(Selection.near(resolvedPos, -1));
				}
			}

			dispatch(tr);
		}

		return true;
	};

// Used to clear any node or cell selection when expand title is focused
export const setSelectionInsideExpand =
	(expandPos: number): Command =>
	(_state, dispatch, editorView) => {
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
			// TODO: ED-8523 - make platform/mode global attributes?
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
			tr.setMeta('scrollIntoView', false);
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

export const focusIcon =
	(expand: Node): Command =>
	(state, dispatch, editorView) => {
		if (!(expand instanceof HTMLElement)) {
			return false;
		}

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		const iconContainer = expand.querySelector(`.${expandClassNames.iconContainer}`) as HTMLElement;
		if (iconContainer && iconContainer.focus) {
			const { tr } = state;
			const pos = state.selection.from;
			tr.setSelection(new TextSelection(tr.doc.resolve(pos)));
			if (dispatch) {
				dispatch(tr);
			}
			editorView?.dom.blur();
			iconContainer.focus();
			return true;
		}

		return false;
	};

export const toggleExpandWithMatch =
	(selection: Selection): EditorCommand =>
	({ tr }) => {
		const { expand, nestedExpand } = tr.doc.type.schema.nodes;
		// if match is inside a nested expand, open the nested expand
		const nestedExpandNode = findParentNodeOfType(nestedExpand)(selection);
		if (
			nestedExpandNode &&
			expValEquals('platform_editor_toggle_expand_on_match_found', 'isEnabled', true)
		) {
			const expanded = expandedState.get(nestedExpandNode.node) ?? false;
			if (!expanded) {
				expandedState.set(nestedExpandNode.node, true);
			}
		}
		// if match is (also) inside an expand, open the expand
		const expandNode = findParentNodeOfType(expand)(selection);
		if (
			expandNode &&
			expValEquals('platform_editor_toggle_expand_on_match_found', 'isEnabled', true)
		) {
			const expanded = expandedState.get(expandNode.node) ?? false;
			if (!expanded) {
				expandedState.set(expandNode.node, true);
			}
		}
		return tr;
	};
