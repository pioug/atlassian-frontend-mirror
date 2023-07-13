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
import {
  PMPluginFactoryParams,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { messages } from '../block-type/messages';
import { CodeBlockOptions } from './types';
import refreshBrowserSelectionOnChange from './refresh-browser-selection';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

// Theres an existing interelationship between these files, where the imported function is being called for code-block
// Insertions via the drop down menu
// tslint-ignore-next-line
import { createInsertCodeBlockTransaction } from '../block-type/commands/block-type';

const codeBlockPlugin: NextEditorPlugin<
  'codeBlock',
  {
    pluginConfiguration: CodeBlockOptions;
    dependencies: [
      typeof decorationsPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
    ];
  }
> = (options, api) => ({
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
            appearance: options.appearance,
          }),
      },
      {
        name: 'codeBlockIDEKeyBindings',
        plugin: () => ideUX,
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
        action(insert, state) {
          const tr = createInsertCodeBlockTransaction({ state });
          api?.dependencies.analytics?.actions.attachAnalyticsEvent({
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
      options.allowCopyToClipboard,
      api?.dependencies.decorations.actions.hoverDecoration,
    ),
  },
});

export default codeBlockPlugin;
