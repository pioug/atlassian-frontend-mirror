import React from 'react';
import { panel, customPanel, PanelType } from '@atlaskit/adf-schema';
import { QuickInsertActionInsert } from '@atlaskit/editor-common/provider-factory';
import { EditorState } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';
import keymap from './pm-plugins/keymaps';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  EVENT_TYPE,
} from '../analytics';
import {
  IconPanel,
  IconPanelNote,
  IconPanelSuccess,
  IconPanelWarning,
  IconPanelError,
} from '../quick-insert/assets';
import { messages } from '../block-type/messages';
import { PanelPluginOptions } from './types';

const insertPanelTypeWithAnalytics = (
  panelType: PanelType,
  state: EditorState,
  insert: QuickInsertActionInsert,
) => {
  const tr = insert(insertPanelType(panelType, state));
  if (tr) {
    addAnalytics(state, tr, {
      action: ACTION.INSERTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.PANEL,
      attributes: {
        inputMethod: INPUT_METHOD.QUICK_INSERT,
        panelType,
      },
      eventType: EVENT_TYPE.TRACK,
    });
  }
  return tr;
};

const insertPanelType = (panelType: PanelType, state: EditorState) =>
  state.schema.nodes.panel.createChecked(
    { panelType },
    state.schema.nodes.paragraph.createChecked(),
  );

const panelPlugin = (options: PanelPluginOptions = {}): EditorPlugin => ({
  name: 'panel',

  nodes() {
    //TODO: ED-10445 remove this check after emoji panels moved to full schema
    const panelNode = options.UNSAFE_allowCustomPanel ? customPanel : panel;
    return [{ name: 'panel', node: panelNode }];
  },

  pmPlugins() {
    return [
      {
        name: 'panel',
        plugin: ({ providerFactory, dispatch }) =>
          createPlugin(dispatch, providerFactory, options),
      },
      {
        name: 'panelKeyMap',
        plugin: () => keymap(),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        id: 'infopanel',
        title: formatMessage(messages.infoPanel),
        keywords: ['panel'],
        description: formatMessage(messages.infoPanelDescription),
        priority: 800,
        icon: () => <IconPanel label={formatMessage(messages.infoPanel)} />,
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PanelType.INFO, state, insert);
        },
      },
      {
        id: 'notepanel',
        title: formatMessage(messages.notePanel),
        description: formatMessage(messages.notePanelDescription),
        priority: 1000,
        icon: () => <IconPanelNote label={formatMessage(messages.notePanel)} />,
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PanelType.NOTE, state, insert);
        },
      },
      {
        id: 'successpanel',
        title: formatMessage(messages.successPanel),
        description: formatMessage(messages.successPanelDescription),
        keywords: ['tip'],
        priority: 1000,
        icon: () => (
          <IconPanelSuccess label={formatMessage(messages.successPanel)} />
        ),
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PanelType.SUCCESS, state, insert);
        },
      },
      {
        id: 'warningpanel',
        title: formatMessage(messages.warningPanel),
        description: formatMessage(messages.warningPanelDescription),
        priority: 1000,
        icon: () => (
          <IconPanelWarning label={formatMessage(messages.warningPanel)} />
        ),
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PanelType.WARNING, state, insert);
        },
      },
      {
        id: 'errorpanel',
        title: formatMessage(messages.errorPanel),
        description: formatMessage(messages.errorPanelDescription),
        priority: 1000,
        icon: () => (
          <IconPanelError label={formatMessage(messages.errorPanel)} />
        ),
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PanelType.ERROR, state, insert);
        },
      },
    ],
    floatingToolbar: (state, intl, providerFactory) =>
      getToolbarConfig(state, intl, options, providerFactory),
  },
});

export default panelPlugin;
