import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import { findSelectedNodeOfType, removeSelectedNode } from '@atlaskit/editor-prosemirror/utils';

import {
	DEFAULT_DIVIDER_STYLE,
	DEFAULT_DIVIDER_WEIGHT,
	type DividerStyle,
	type DividerWeight,
} from '../ui/constants';
import { createHorizontalRule } from './input-rule';

export const insertHorizontalRule =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		inputMethod:
			| INPUT_METHOD.ELEMENT_BROWSER
			| INPUT_METHOD.QUICK_INSERT
			| INPUT_METHOD.TOOLBAR
			| INPUT_METHOD.INSERT_MENU
			| INPUT_METHOD.FORMATTING
			| INPUT_METHOD.SHORTCUT,
	): Command =>
	(state, dispatch) => {
		const tr = createHorizontalRule(
			state,
			state.selection.from,
			state.selection.to,
			inputMethod,
			editorAnalyticsAPI,
		);
		if (tr) {
			if (dispatch) {
				dispatch(tr);
			}
			return true;
		}

		return false;
	};

export const removeHorizontalRule =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const { rule } = state.schema.nodes;

		if (!findSelectedNodeOfType(rule)(state.selection)) {
			return false;
		}

		if (dispatch) {
			const deleteTr = removeSelectedNode(state.tr);
			const payload: AnalyticsEventPayload = {
				action: ACTION.DELETED,
				actionSubject: ACTION_SUBJECT.DIVIDER,
				attributes: {
					inputMethod: INPUT_METHOD.FLOATING_TB,
				},
				eventType: EVENT_TYPE.TRACK,
			};

			editorAnalyticsAPI?.attachAnalyticsEvent(payload)(deleteTr);
			dispatch(deleteTr);
		}

		return true;
	};

export const updateHorizontalRuleWeight =
	(weight: DividerWeight, editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const { rule } = state.schema.nodes;
		const selectedRule = findSelectedNodeOfType(rule)(state.selection);

		if (!selectedRule) {
			return false;
		}

		const previousWeight = selectedRule.node.attrs.weight ?? DEFAULT_DIVIDER_WEIGHT;
		if (previousWeight === weight) {
			return true;
		}

		if (dispatch) {
			const updateTr = state.tr.setNodeMarkup(selectedRule.pos, undefined, {
				...selectedRule.node.attrs,
				weight,
			});

			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: ACTION.UPDATED,
				actionSubject: ACTION_SUBJECT.DIVIDER,
				attributes: {
					inputMethod: INPUT_METHOD.FLOATING_TB,
					previousWeight,
					weight,
				},
				eventType: EVENT_TYPE.TRACK,
			})(updateTr);
			dispatch(updateTr);
		}

		return true;
	};

export const updateHorizontalRuleStyle =
	(style: DividerStyle, editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const { rule } = state.schema.nodes;
		const selectedRule = findSelectedNodeOfType(rule)(state.selection);

		if (!selectedRule) {
			return false;
		}

		const previousStyle = selectedRule.node.attrs.style ?? DEFAULT_DIVIDER_STYLE;
		if (previousStyle === style) {
			return true;
		}

		if (dispatch) {
			const updateTr = state.tr.setNodeMarkup(selectedRule.pos, undefined, {
				...selectedRule.node.attrs,
				style,
			});

			editorAnalyticsAPI?.attachAnalyticsEvent({
				action: ACTION.UPDATED,
				actionSubject: ACTION_SUBJECT.DIVIDER,
				attributes: {
					inputMethod: INPUT_METHOD.FLOATING_TB,
					previousStyle,
					style,
				},
				eventType: EVENT_TYPE.TRACK,
			})(updateTr);
			dispatch(updateTr);
		}

		return true;
	};
