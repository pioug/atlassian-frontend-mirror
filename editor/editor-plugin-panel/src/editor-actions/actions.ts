import { PanelType } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import { getPanelTypeBackgroundNoTokens } from '@atlaskit/editor-common/panel';
import type { Command } from '@atlaskit/editor-common/types';
import { wrapSelectionIn } from '@atlaskit/editor-common/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	findSelectedNodeOfType,
	removeParentNodeOfType,
	removeSelectedNode,
} from '@atlaskit/editor-prosemirror/utils';

import type { PanelOptions } from '../pm-plugins/main';
import { findPanel } from '../pm-plugins/utils/utils';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };

export const removePanel =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
	(state, dispatch) => {
		const {
			schema: { nodes },
			tr,
		} = state;
		const payload: AnalyticsEventPayload = {
			action: ACTION.DELETED,
			actionSubject: ACTION_SUBJECT.PANEL,
			attributes: {
				inputMethod: INPUT_METHOD.FLOATING_TB,
			},
			eventType: EVENT_TYPE.TRACK,
		};

		let deleteTr = tr;
		if (findSelectedNodeOfType(nodes.panel)(tr.selection)) {
			deleteTr = removeSelectedNode(tr);
		} else if (findParentNodeOfType(nodes.panel)(tr.selection)) {
			deleteTr = removeParentNodeOfType(nodes.panel)(tr);
		}

		if (!deleteTr) {
			return false;
		}

		if (dispatch) {
			editorAnalyticsAPI?.attachAnalyticsEvent(payload)(deleteTr);
			dispatch(deleteTr);
		}
		return true;
	};

export const changePanelType =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		panelType: PanelType,
		panelOptions: PanelOptions = {},
		allowCustomPanel: boolean = false,
	): Command =>
	(state, dispatch) => {
		const {
			schema: { nodes },
			tr,
		} = state;

		const panelNode = findPanel(state);
		if (panelNode === undefined) {
			return false;
		}

		const newType = panelType;
		const previousType = panelNode.node.attrs.panelType;
		let newTr;

		if (allowCustomPanel) {
			const previousColor =
				panelNode.node.attrs.panelType === 'custom'
					? panelNode.node.attrs.panelColor || 'none'
					: getPanelTypeBackgroundNoTokens(previousType);
			const previousIcon = panelNode.node.attrs.panelIcon;
			const previousIconId = panelNode.node.attrs.panelIconId;
			const previousIconText = panelNode.node.attrs.panelIconText;
			const newPanelOptions: PanelOptions = {
				color: previousColor,
				emoji: previousIcon,
				emojiId: previousIconId,
				emojiText: previousIconText,
				...panelOptions,
			};

			newTr = tr.setNodeMarkup(panelNode.pos, nodes.panel, {
				panelIcon: newPanelOptions.emoji,
				panelIconId: newPanelOptions.emojiId,
				panelIconText: newPanelOptions.emojiText,
				panelColor: newPanelOptions.color,
				panelType,
			});
		} else {
			newTr = tr.setNodeMarkup(panelNode.pos, nodes.panel, { panelType });
		}

		const payload: AnalyticsEventPayload = {
			action: ACTION.CHANGED_TYPE,
			actionSubject: ACTION_SUBJECT.PANEL,
			attributes: { newType, previousType },
			eventType: EVENT_TYPE.TRACK,
		};

		// Select the panel if it was previously selected
		const newTrWithSelection =
			state.selection instanceof NodeSelection && state.selection.node.type.name === 'panel'
				? newTr.setSelection(new NodeSelection(tr.doc.resolve(panelNode.pos)))
				: newTr;

		editorAnalyticsAPI?.attachAnalyticsEvent(payload)(newTrWithSelection);

		newTrWithSelection.setMeta('scrollIntoView', false);

		if (dispatch) {
			dispatch(newTrWithSelection);
		}
		return true;
	};

export function insertPanelWithAnalytics(
	inputMethod: INPUT_METHOD,
	analyticsAPI?: EditorAnalyticsAPI,
) {
	return withAnalytics(analyticsAPI, {
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.PANEL,
		attributes: {
			inputMethod: inputMethod as INPUT_METHOD.TOOLBAR,
			panelType: PanelType.INFO, // only info panels can be inserted via this action
		},
		eventType: EVENT_TYPE.TRACK,
	})(function (state: EditorState, dispatch) {
		const { nodes } = state.schema;
		if (nodes.panel && nodes.paragraph) {
			return wrapSelectionIn(nodes.panel)(state, dispatch);
		}
		return false;
	});
}
