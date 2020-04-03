import React from 'react';
import { panel, PanelType } from '@atlaskit/adf-schema';

import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';

import keymap from './pm-plugins/keymaps';
import { EditorState } from 'prosemirror-state';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  EVENT_TYPE,
  PANEL_TYPE,
} from '../analytics';
import {
  IconPanel,
  IconPanelNote,
  IconPanelSuccess,
  IconPanelWarning,
  IconPanelError,
} from '../quick-insert/assets';
import { QuickInsertActionInsert } from '@atlaskit/editor-common/provider-factory';
import { messages } from '../block-type/messages';

const insertPanelTypeWithAnalytics = (
  panelType: PANEL_TYPE,
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

const panelPlugin = (): EditorPlugin => ({
  name: 'panel',

  nodes() {
    return [{ name: 'panel', node: panel }];
  },

  pmPlugins() {
    return [
      { name: 'panel', plugin: createPlugin },
      {
        name: 'panelKeyMap',
        plugin: () => keymap(),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        title: formatMessage(messages.infoPanel),
        description: formatMessage(messages.infoPanelDescription),
        keywords: ['info', 'panel'],
        priority: 900,
        icon: () => <IconPanel label={formatMessage(messages.infoPanel)} />,
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PANEL_TYPE.INFO, state, insert);
        },
      },
      {
        title: formatMessage(messages.notePanel),
        description: formatMessage(messages.notePanelDescription),
        keywords: ['note'],
        priority: 1000,
        icon: () => <IconPanelNote label={formatMessage(messages.notePanel)} />,
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PANEL_TYPE.NOTE, state, insert);
        },
      },
      {
        title: formatMessage(messages.successPanel),
        description: formatMessage(messages.successPanelDescription),
        keywords: ['success', 'tip'],
        priority: 1000,
        icon: () => (
          <IconPanelSuccess label={formatMessage(messages.successPanel)} />
        ),
        action(insert, state) {
          return insertPanelTypeWithAnalytics(
            PANEL_TYPE.SUCCESS,
            state,
            insert,
          );
        },
      },
      {
        title: formatMessage(messages.warningPanel),
        description: formatMessage(messages.warningPanelDescription),
        keywords: ['warning'],
        priority: 1000,
        icon: () => (
          <IconPanelWarning label={formatMessage(messages.warningPanel)} />
        ),
        action(insert, state) {
          return insertPanelTypeWithAnalytics(
            PANEL_TYPE.WARNING,
            state,
            insert,
          );
        },
      },
      {
        title: formatMessage(messages.errorPanel),
        description: formatMessage(messages.errorPanelDescription),
        keywords: ['error'],
        priority: 1000,
        icon: () => (
          <IconPanelError label={formatMessage(messages.errorPanel)} />
        ),
        action(insert, state) {
          return insertPanelTypeWithAnalytics(PANEL_TYPE.ERROR, state, insert);
        },
      },
    ],
    floatingToolbar: getToolbarConfig,
  },
});

export default panelPlugin;
