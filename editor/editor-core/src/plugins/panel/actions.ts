import { setParentNodeMarkup, removeParentNodeOfType } from 'prosemirror-utils';
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
import { pluginKey } from './pm-plugins/main';
import { PANEL_TYPE } from '../analytics/types/node-events';

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

  if (dispatch) {
    dispatch(
      addAnalytics(state, removeParentNodeOfType(nodes.panel)(tr), payload),
    );
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

  const changePanelTypeTr = addAnalytics(
    state,
    setParentNodeMarkup(nodes.panel, null, { panelType })(tr).setMeta(
      pluginKey,
      { activePanelType: panelType },
    ),
    payload,
  );
  changePanelTypeTr.setMeta('scrollIntoView', false);

  if (dispatch) {
    dispatch(changePanelTypeTr);
  }
  return true;
};
