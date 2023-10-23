import {
  removeParentNodeOfType,
  findSelectedNodeOfType,
  removeSelectedNode,
  findParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { PanelType } from '@atlaskit/adf-schema';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Command } from '../../types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type {
  EditorAnalyticsAPI,
  AnalyticsEventPayload,
} from '@atlaskit/editor-common/analytics';
import { findPanel } from './utils';
import type { PanelOptions } from './pm-plugins/main';
import { getPanelTypeBackgroundNoTokens } from '@atlaskit/editor-common/panel';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import { wrapSelectionIn } from '@atlaskit/editor-common/utils';

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
      attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
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

    let newType = panelType;
    let previousType = panelNode.node.attrs.panelType;
    let newTr;

    if (allowCustomPanel) {
      let previousColor =
        panelNode.node.attrs.panelType === 'custom'
          ? panelNode.node.attrs.panelColor || 'none'
          : getPanelTypeBackgroundNoTokens(previousType);
      let previousIcon = panelNode.node.attrs.panelIcon;
      let previousIconId = panelNode.node.attrs.panelIconId;
      let previousIconText = panelNode.node.attrs.panelIconText;
      let newPanelOptions: PanelOptions = {
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
      state.selection instanceof NodeSelection &&
      state.selection.node.type.name === 'panel'
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
