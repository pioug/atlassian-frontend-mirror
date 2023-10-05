import React from 'react';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  bindKeymapWithCommand,
  openHelp,
  tooltip,
} from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type {
  EditorState,
  ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

import { openHelpCommand } from './commands';
import { pluginKey } from './plugin-key';
import type { HelpDialogPlugin } from './types';
import { HelpDialogLoader } from './ui/HelpDialogLoader';

export function createPlugin(dispatch: Function, imageEnabled: boolean) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init() {
        return { isVisible: false, imageEnabled };
      },
      apply(tr: ReadonlyTransaction, _value: unknown, state: EditorState) {
        const isVisible = tr.getMeta(pluginKey);
        const currentState = pluginKey.getState(state);
        if (isVisible !== undefined && isVisible !== currentState.isVisible) {
          const newState = { ...currentState, isVisible };
          dispatch(pluginKey, newState);
          return newState;
        }
        return currentState;
      },
    },
  });
}

export const helpDialogPlugin: HelpDialogPlugin = ({
  config: imageUploadProviderExists = false,
  api,
}) => ({
  name: 'helpDialog',

  pmPlugins() {
    return [
      {
        name: 'helpDialog',
        plugin: ({ dispatch }) =>
          createPlugin(dispatch, imageUploadProviderExists),
      },
      {
        name: 'helpDialogKeymap',
        plugin: () => keymapPlugin(api?.analytics?.actions),
      },
    ];
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        id: 'helpdialog',
        title: formatMessage(messages.help),
        description: formatMessage(messages.helpDescription),
        keywords: ['?'],
        priority: 4000,
        keyshortcut: tooltip(openHelp),
        icon: () => <QuestionCircleIcon label="" />,
        action(insert) {
          const tr = insert('');
          openHelpCommand(tr);
          api?.analytics?.actions.attachAnalyticsEvent({
            action: ACTION.HELP_OPENED,
            actionSubject: ACTION_SUBJECT.HELP,
            actionSubjectId: ACTION_SUBJECT_ID.HELP_QUICK_INSERT,
            attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
            eventType: EVENT_TYPE.UI,
          })(tr);
          return tr;
        },
      },
    ],
  },

  contentComponent({ editorView }) {
    return (
      <HelpDialogLoader
        pluginInjectionApi={api}
        editorView={editorView}
        quickInsertEnabled={!!api?.quickInsert}
      />
    );
  },

  getSharedState(editorState) {
    if (!editorState) {
      return null;
    }
    return pluginKey.getState(editorState) || null;
  },
});

const keymapPlugin = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin => {
  const list = {};
  bindKeymapWithCommand(
    openHelp.common!,
    (state, dispatch) => {
      let { tr } = state;
      const isVisible = tr.getMeta(pluginKey);
      if (!isVisible) {
        editorAnalyticsAPI?.attachAnalyticsEvent({
          action: ACTION.CLICKED,
          actionSubject: ACTION_SUBJECT.BUTTON,
          actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
          attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
          eventType: EVENT_TYPE.UI,
        })(tr);
        openHelpCommand(tr, dispatch);
      }
      return true;
    },
    list,
  );
  return keymap(list) as SafePlugin;
};
