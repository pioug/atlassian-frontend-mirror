import React from 'react';
import { keymap } from 'prosemirror-keymap';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import * as keymaps from '../../keymaps';
import { openHelp, tooltip } from '../../keymaps';
import WithPluginState from '../../ui/WithPluginState';
import { HelpDialogLoader } from './ui/HelpDialogLoader';
import { pluginKey as quickInsertPluginKey } from '../quick-insert';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../../plugins/analytics';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { Providers } from '@atlaskit/editor-common/provider-factory';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { openHelpCommand } from './commands';
import { pluginKey } from './plugin-key';

export function createPlugin(dispatch: Function, imageEnabled: boolean) {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return { isVisible: false, imageEnabled };
      },
      apply(tr: Transaction, _value: any, state: EditorState) {
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

const helpDialog = (
  legacyImageUploadProvider?: Providers['imageUploadProvider'],
): EditorPlugin => ({
  name: 'helpDialog',

  pmPlugins() {
    return [
      {
        name: 'helpDialog',
        plugin: ({ dispatch }) =>
          createPlugin(dispatch, !!legacyImageUploadProvider),
      },
      {
        name: 'helpDialogKeymap',
        plugin: () => keymapPlugin(),
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
        action(insert, state) {
          const tr = insert('');
          openHelpCommand(tr);
          return addAnalytics(state, tr, {
            action: ACTION.HELP_OPENED,
            actionSubject: ACTION_SUBJECT.HELP,
            actionSubjectId: ACTION_SUBJECT_ID.HELP_QUICK_INSERT,
            attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
            eventType: EVENT_TYPE.UI,
          });
        },
      },
    ],
  },

  contentComponent({ editorView }) {
    return (
      <WithPluginState
        plugins={{
          helpDialog: pluginKey,
          quickInsert: quickInsertPluginKey,
        }}
        render={({ helpDialog = {} as any, quickInsert }) => (
          <HelpDialogLoader
            editorView={editorView}
            isVisible={helpDialog.isVisible}
            quickInsertEnabled={!!quickInsert}
            imageEnabled={helpDialog.imageEnabled}
          />
        )}
      />
    );
  },
});

const keymapPlugin = (): Plugin => {
  const list = {};
  keymaps.bindKeymapWithCommand(
    keymaps.openHelp.common!,
    (state, dispatch) => {
      let { tr } = state;
      const isVisible = tr.getMeta(pluginKey);
      if (!isVisible) {
        tr = addAnalytics(state, tr, {
          action: ACTION.CLICKED,
          actionSubject: ACTION_SUBJECT.BUTTON,
          actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
          attributes: { inputMethod: INPUT_METHOD.SHORTCUT },
          eventType: EVENT_TYPE.UI,
        });
        openHelpCommand(tr, dispatch);
      }
      return true;
    },
    list,
  );
  return keymap(list);
};

export default helpDialog;
