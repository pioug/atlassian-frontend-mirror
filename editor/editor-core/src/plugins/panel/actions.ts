import {
  removeParentNodeOfType,
  findSelectedNodeOfType,
  removeSelectedNode,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { PanelType } from '@atlaskit/adf-schema';
import { getPanelTypeBackground } from '@atlaskit/editor-common';
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
import { findPanel } from './utils';
import { PanelOptions } from './pm-plugins/main';

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

const getNewPanelData = (
  state: EditorState,
  newPanelType: PanelType,
  panelOptions: PanelOptions = {},
): { panelIcon: string; panelColor: string; panelType: PanelType } => {
  let {
    activePanelIcon: previousIcon,
    activePanelColor: previousColor,
    activePanelType: previousType,
  } = pluginKey.getState(state);
  const { emoji, color } = panelOptions;

  let panelIcon = previousIcon;
  let panelType = newPanelType;

  let panelColor = getPanelTypeBackground(
    (newPanelType !== PanelType.CUSTOM
      ? newPanelType
      : previousType) as Exclude<PanelType, PanelType.CUSTOM>,
  );

  if (color || previousColor) {
    panelType = PanelType.CUSTOM;
    panelColor = color || previousColor;
  }

  if (emoji) {
    panelType = PanelType.CUSTOM;
    panelIcon = emoji;
  }

  return {
    panelIcon,
    panelColor,
    panelType: panelType,
  };
};

export const changePanelType = (
  panelType: PanelType,
  panelOptions: PanelOptions = {},
  UNSAFE_allowCustomPanel: boolean = false,
): Command => (state, dispatch) => {
  const {
    schema: { nodes },
    tr,
  } = state;

  const panelNode = findPanel(state);
  if (panelNode === undefined) {
    return false;
  }

  let newType = panelType;
  let previousType = pluginKey.getState(state).activePanelType;

  if (UNSAFE_allowCustomPanel) {
    const { panelType: newPanelType } = getNewPanelData(
      state,
      panelType,
      panelOptions,
    );
    newType = newPanelType;
    previousType = panelType;
  }

  const payload: AnalyticsEventPayload = {
    action: ACTION.CHANGED_TYPE,
    actionSubject: ACTION_SUBJECT.PANEL,
    attributes: { newType, previousType },
    eventType: EVENT_TYPE.TRACK,
  };

  let newTr;
  if (UNSAFE_allowCustomPanel) {
    const { panelIcon, panelColor, panelType: newPanelType } = getNewPanelData(
      state,
      panelType,
      panelOptions,
    );

    newTr = tr
      .setNodeMarkup(panelNode.pos, nodes.panel, {
        panelType: newPanelType,
        panelIcon,
        panelColor,
      })
      .setMeta(pluginKey, {
        activePanelType: newPanelType,
        activePanelIcon: panelIcon,
        activePanelColor: panelColor,
      });
  } else {
    newTr = tr
      .setNodeMarkup(panelNode.pos, nodes.panel, { panelType })
      .setMeta(pluginKey, { activePanelType: panelType });
  }

  // Select the panel if it was previously selected
  const newTrWithSelection =
    state.selection instanceof NodeSelection &&
    state.selection.node.type.name === 'panel'
      ? newTr.setSelection(new NodeSelection(tr.doc.resolve(panelNode.pos)))
      : newTr;

  const changePanelTypeTr = addAnalytics(state, newTrWithSelection, payload);

  changePanelTypeTr.setMeta('scrollIntoView', false);

  if (dispatch) {
    dispatch(changePanelTypeTr);
  }
  return true;
};
