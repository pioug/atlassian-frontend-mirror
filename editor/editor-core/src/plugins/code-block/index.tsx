import React from 'react';
import { codeBlock } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';
import keymap from './pm-plugins/keymaps';
import ideUX from './pm-plugins/ide-ux';
import { codeBlockCopySelectionPlugin } from './pm-plugins/codeBlockCopySelectionPlugin';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { IconCode } from '@atlaskit/editor-common/quick-insert';
import type {
  PMPluginFactoryParams,
  NextEditorPlugin,
  OptionalPlugin,
  Command,
} from '@atlaskit/editor-common/types';
import { messages } from '@atlaskit/editor-plugin-block-type/messages';
import type { CodeBlockOptions } from './types';
import refreshBrowserSelectionOnChange from './refresh-browser-selection';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import {
  createInsertCodeBlockTransaction,
  insertCodeBlockWithAnalytics,
} from './actions';
import { createCodeBlockInputRule } from './pm-plugins/input-rule';

const codeBlockPlugin: NextEditorPlugin<
  'codeBlock',
  {
    pluginConfiguration: CodeBlockOptions;
    dependencies: [
      typeof decorationsPlugin,
      typeof compositionPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
    ];
    actions: {
      insertCodeBlock: (inputMethod: INPUT_METHOD) => Command;
    };
  }
> = ({ config: options, api }) => ({
  name: 'codeBlock',

  nodes() {
    return [{ name: 'codeBlock', node: codeBlock }];
  },

  pmPlugins() {
    return [
      {
        name: 'codeBlock',
        plugin: ({ getIntl }) =>
          createPlugin({
            ...options,
            getIntl,
            appearance: options?.appearance ?? 'comment',
          }),
      },
      {
        name: 'codeBlockInputRule',
        plugin: ({ schema }: PMPluginFactoryParams) => {
          return createCodeBlockInputRule(schema, api?.analytics?.actions);
        },
      },
      {
        name: 'codeBlockIDEKeyBindings',
        plugin: () => ideUX(api),
      },
      {
        name: 'codeBlockKeyMap',
        plugin: ({ schema }: PMPluginFactoryParams) => keymap(schema),
      },
      {
        name: 'codeBlockCopySelection',
        plugin: () => codeBlockCopySelectionPlugin(),
      },
    ];
  },

  // Workaround for a firefox issue where dom selection is off sync
  // https://product-fabric.atlassian.net/browse/ED-12442
  onEditorViewStateUpdated(props) {
    refreshBrowserSelectionOnChange(
      props.originalTransaction,
      props.newEditorState,
    );
  },

  actions: {
    /*
     * Function will insert code block at current selection if block is empty or below current selection and set focus on it.
     */
    insertCodeBlock: (inputMethod: INPUT_METHOD) =>
      insertCodeBlockWithAnalytics(inputMethod, api?.analytics?.actions),
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        id: 'codeblock',
        title: formatMessage(messages.codeblock),
        description: formatMessage(messages.codeblockDescription),
        keywords: ['code block'],
        priority: 700,
        keyshortcut: '```',
        icon: () => <IconCode />,
        action(_insert, state) {
          const tr = createInsertCodeBlockTransaction({ state });
          api?.analytics?.actions.attachAnalyticsEvent({
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
            attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
            eventType: EVENT_TYPE.TRACK,
          })(tr);
          return tr;
        },
      },
    ],
    floatingToolbar: getToolbarConfig(
      options?.allowCopyToClipboard,
      api?.decorations.actions.hoverDecoration,
    ),
  },
});

export default codeBlockPlugin;
export type CodeBlockPlugin = typeof codeBlockPlugin;
