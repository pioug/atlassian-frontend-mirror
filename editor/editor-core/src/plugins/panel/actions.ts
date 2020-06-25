import {
  removeParentNodeOfType,
  findSelectedNodeOfType,
  removeSelectedNode,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { PanelType } from '@atlaskit/adf-schema';
import { analyticsService } from '../../analytics';
import { Command } from '../../types';
import {
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
  INPUT_METHOD,
  EVENT_TYPE,
  addAnalytics,
} from '../analytics';
import { pluginKey } from './types';
import { PANEL_TYPE } from '../analytics/types/node-events';
import { findPanel } from './utils';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };

export const removePanel = (): Command => (state, dispatch) => {
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
  analyticsService.trackEvent(`atlassian.editor.format.panel.delete.button`);

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
    dispatch(addAnalytics(state, deleteTr, payload));
  }
  return true;
};

export const changePanelType = (panelType: PanelType): Command => (
  state,
  dispatch,
) => {
  const {
    schema: { nodes },
    tr,
  } = state;

  let previousType: PANEL_TYPE = pluginKey.getState(state).activePanelType;
  const payload: AnalyticsEventPayload = {
    action: ACTION.CHANGED_TYPE,
    actionSubject: ACTION_SUBJECT.PANEL,
    attributes: {
      newType: panelType as PANEL_TYPE,
      previousType: previousType,
    },
    eventType: EVENT_TYPE.TRACK,
  };

  analyticsService.trackEvent(
    `atlassian.editor.format.panel.${panelType}.button`,
  );

  const panelNode = findPanel(state);
  if (panelNode === undefined) {
    return false;
  }

  const newTr = tr
    .setNodeMarkup(panelNode.pos, nodes.panel, { panelType })
    .setMeta(pluginKey, { activePanelType: panelType });

  // Make the panel node selected when changing the type of a panel (if the panel was selected)
  const newTrWithSelection =
    state.selection instanceof NodeSelection
      ? newTr.setSelection(new NodeSelection(state.doc.resolve(panelNode.pos)))
      : newTr;

  const changePanelTypeTr = addAnalytics(state, newTrWithSelection, payload);

  changePanelTypeTr.setMeta('scrollIntoView', false);

  if (dispatch) {
    dispatch(changePanelTypeTr);
  }
  return true;
};
