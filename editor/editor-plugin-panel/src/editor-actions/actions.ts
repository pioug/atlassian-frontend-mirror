import type { PanelType } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { getPanelTypeBackgroundNoTokens } from '@atlaskit/editor-common/panel';
import type { Command } from '@atlaskit/editor-common/types';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	findSelectedNodeOfType,
	removeParentNodeOfType,
	removeSelectedNode,
} from '@atlaskit/editor-prosemirror/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PanelOptions } from '../pm-plugins/main';
import { findPanel, isPanel, panelTypes } from '../pm-plugins/utils/utils';

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

		const panelNodeTypes = panelTypes(nodes);

		let deleteTr = tr;
		if (findSelectedNodeOfType(panelNodeTypes)(tr.selection)) {
			deleteTr = removeSelectedNode(tr);
		} else if (findParentNodeOfType(panelNodeTypes)(tr.selection)) {
			deleteTr = removeParentNodeOfType(panelNodeTypes)(tr);
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

		const panelNodeType = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
			? panelNode.node.type
			: nodes.panel;

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

			newTr = tr.setNodeMarkup(panelNode.pos, panelNodeType, {
				panelIcon: newPanelOptions.emoji,
				panelIconId: newPanelOptions.emojiId,
				panelIconText: newPanelOptions.emojiText,
				panelColor: newPanelOptions.color,
				panelType,
			});
		} else {
			newTr = tr.setNodeMarkup(panelNode.pos, panelNodeType, { panelType });
		}

		const payload: AnalyticsEventPayload = {
			action: ACTION.CHANGED_TYPE,
			actionSubject: ACTION_SUBJECT.PANEL,
			attributes: { newType, previousType },
			eventType: EVENT_TYPE.TRACK,
		};

		// Select the panel if it was previously selected
		const newTrWithSelection =
			state.selection instanceof NodeSelection && isPanel(state.selection.node.type.name)
				? newTr.setSelection(new NodeSelection(tr.doc.resolve(panelNode.pos)))
				: newTr;

		editorAnalyticsAPI?.attachAnalyticsEvent(payload)(newTrWithSelection);

		newTrWithSelection.setMeta('scrollIntoView', false);

		if (dispatch) {
			dispatch(newTrWithSelection);
		}
		return true;
	};
