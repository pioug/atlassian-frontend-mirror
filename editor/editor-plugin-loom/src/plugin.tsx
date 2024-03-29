import React from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import { IconLoom } from '@atlaskit/editor-common/quick-insert';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

import { recordVideo, recordVideoFailed } from './commands';
import type { LoomPluginState } from './pm-plugin';
import { createPlugin, loomPluginKey } from './pm-plugin';
import LoomToolbarButton from './ui/ToolbarButton';

export type LoomPlugin = NextEditorPlugin<
  'loom',
  {
    dependencies: [
      // Optional, because works fine without analytics
      OptionalPlugin<AnalyticsPlugin>,
      HyperlinkPlugin,
    ];
    sharedState: LoomPluginState | undefined;
  }
>;

export const loomPlugin: LoomPlugin = ({ api }) => {
  const editorAnalyticsAPI = api?.analytics?.actions;

  return {
    name: 'loom',

    pmPlugins: () => [
      {
        name: 'loom',
        plugin: () => createPlugin(api),
      },
    ],

    getSharedState(editorState) {
      if (!editorState) {
        return;
      }
      return loomPluginKey.getState(editorState);
    },

    pluginsOptions: {
      // Enable inserting Loom recordings through the slash command
      quickInsert: ({ formatMessage }) => [
        {
          id: 'loom',
          title: formatMessage(toolbarInsertBlockMessages.recordVideo),
          description: formatMessage(
            toolbarInsertBlockMessages.recordVideoDescription,
          ),
          keywords: ['loom', 'record', 'video'],
          priority: 800,
          icon: () => <IconLoom />,
          action(insert, editorState) {
            const tr = insert(undefined);

            const loomState = loomPluginKey.getState(editorState);
            if (!loomState?.isEnabled) {
              const errorMessage = loomState?.error;
              logException(new Error(errorMessage), {
                location: 'editor-plugin-loom/quick-insert-record-video',
              });
              return (
                recordVideoFailed({
                  inputMethod: INPUT_METHOD.QUICK_INSERT,
                  error: errorMessage,
                  editorAnalyticsAPI,
                })({
                  tr,
                }) ?? false
              );
            }

            return (
              recordVideo({
                inputMethod: INPUT_METHOD.QUICK_INSERT,
                editorAnalyticsAPI,
              })({
                tr,
              }) ?? false
            );
          },
        },
      ],
    },

    // Enable inserting Loom recordings through main toolbar
    primaryToolbarComponent({ disabled }) {
      return <LoomToolbarButton disabled={disabled} api={api} />;
    },
  };
};
