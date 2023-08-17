import React from 'react';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  EditorState,
  ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import {
  bindKeymapWithCommand,
  openHelp,
  tooltip,
} from '@atlaskit/editor-common/keymaps';

import WithPluginState from '../../ui/WithPluginState';
import { HelpDialogLoader } from './ui/HelpDialogLoader';
import { pluginKey as quickInsertPluginKey } from '../quick-insert';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';

import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { openHelpCommand } from './commands';
import { pluginKey } from './plugin-key';

export function createPlugin(dispatch: Function, imageEnabled: boolean) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init() {
        return { isVisible: false, imageEnabled };
      },
      apply(tr: ReadonlyTransaction, _value: any, state: EditorState) {
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

const helpDialog: NextEditorPlugin<
  'helpDialog',
  {
    dependencies: [OptionalPlugin<typeof analyticsPlugin>];
    pluginConfiguration: boolean;
  }
> = (imageUploadProviderExists = false, api) => ({
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
        plugin: () => keymapPlugin(api?.dependencies.analytics?.actions),
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
          api?.dependencies.analytics?.actions.attachAnalyticsEvent({
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

export default helpDialog;
