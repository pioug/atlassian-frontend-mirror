import React from 'react';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import type {
  EditorCommand,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import { LoomIcon } from '@atlaskit/logo';

import { recordVideo, recordVideoFailed } from './commands';
import type { LoomPluginState } from './pm-plugin';
import { createPlugin, loomPluginKey } from './pm-plugin';
import type { LoomPluginOptions } from './types';
import LoomToolbarButton from './ui/ToolbarButton';

export type LoomPlugin = NextEditorPlugin<
  'loom',
  {
    pluginConfiguration: LoomPluginOptions;
    dependencies: [
      // Optional, because works fine without analytics
      OptionalPlugin<AnalyticsPlugin>,
      HyperlinkPlugin,
    ];
    sharedState: LoomPluginState | undefined;
    actions: {
      recordVideo: ({
        inputMethod,
        editorAnalyticsAPI,
      }: {
        inputMethod: INPUT_METHOD;
        editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
      }) => EditorCommand;
    };
  }
>;

export const loomPlugin: LoomPlugin = ({ config, api }) => {
  const editorAnalyticsAPI = api?.analytics?.actions;

  return {
    name: 'loom',

    actions: {
      recordVideo,
    },

    pmPlugins: () => [
      {
        name: 'loom',
        plugin: () => createPlugin({ config, api }),
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
          icon: () => <LoomIcon appearance="brand" />,
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
    primaryToolbarComponent({ disabled, appearance }) {
      if (!config.shouldShowToolbarButton) {
        return null;
      }
      return <LoomToolbarButton disabled={disabled} api={api} appearance={appearance} />;
    },
  };
};
