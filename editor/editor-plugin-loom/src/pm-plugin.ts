import type { SDKUnsupportedReasons } from '@loomhq/record-sdk';

import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { disableLoom, enableLoom, insertVideo } from './commands';
import type { LoomPlugin } from './plugin';
import type { LoomPluginOptions } from './types';

export interface LoomPluginState {
  isEnabled: boolean;
  loomButton: HTMLButtonElement | null;
  isRecordingVideo: boolean;
  error: SDKUnsupportedReasons | undefined;
}

export enum LoomPluginAction {
  ENABLE,
  DISABLE,
  RECORD_VIDEO,
  INSERT_VIDEO,
}

export const loomPluginKey = new PluginKey<LoomPluginState>('loom');

export const createPlugin = ({
  config,
  api,
}: {
  config: LoomPluginOptions;
  api: ExtractInjectionAPI<LoomPlugin> | undefined;
}) => {
  const editorAnalyticsAPI = api?.analytics?.actions;

  return new SafePlugin({
    key: loomPluginKey,
    state: {
      init: (): LoomPluginState => ({
        isEnabled: false,
        loomButton: null,
        isRecordingVideo: false,
        error: undefined,
      }),
      apply: (
        tr: ReadonlyTransaction,
        pluginState: LoomPluginState,
      ): LoomPluginState => {
        const action = tr.getMeta(loomPluginKey)?.type;
        switch (action) {
          case LoomPluginAction.ENABLE:
            const { loomButton } = tr.getMeta(loomPluginKey);
            return {
              ...pluginState,
              isEnabled: true,
              loomButton,
            };
          case LoomPluginAction.DISABLE:
            const { error } = tr.getMeta(loomPluginKey);
            return {
              ...pluginState,
              isEnabled: false,
              loomButton: null,
              error,
            };
          case LoomPluginAction.RECORD_VIDEO:
            // Click the unmounted button in state that has the Loom SDK attached
            pluginState?.loomButton?.click();

            return {
              ...pluginState,
              isRecordingVideo: true,
            };
          case LoomPluginAction.INSERT_VIDEO:
            return {
              ...pluginState,
              isRecordingVideo: false,
            };
          default:
            return pluginState;
        }
      },
    },
    view(editorView: EditorView) {
      const setupLoom = async () => {
        const clientResult = await config.loomProvider.getClient();

        if (clientResult.status === 'error') {
          api?.core?.actions.execute(
            disableLoom({ error: clientResult.message }),
          );
          logException(new Error(clientResult.message), {
            location: 'editor-plugin-loom/sdk-initialisation',
          });
          api?.analytics?.actions.fireAnalyticsEvent({
            action: ACTION.ERRORED,
            actionSubject: ACTION_SUBJECT.LOOM,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: { error: clientResult.message },
          });
          return;
        }

        const { attachToButton } = clientResult.client;

        // Hidden element to work around the SDK API
        const loomButton = document.createElement('button');
        attachToButton({
          button: loomButton,
          onInsert: video => {
            const { state, dispatch } = editorView;
            const pos = editorView.state.selection.from;
            api?.hyperlink?.actions.insertLink(
              INPUT_METHOD.TYPEAHEAD,
              pos, // from === to, don't replace text to avoid accidental content loss
              pos,
              video.sharedUrl,
              video.title,
              undefined,
              undefined,
              undefined,
              'embed', // Convert to embed card instead of inline
            )(state, dispatch);

            api?.core?.actions.execute(
              insertVideo({ editorAnalyticsAPI, video }),
            );
          },
        });

        api?.core?.actions.execute(enableLoom({ loomButton }));
        // We're not combining the analytics steps into the enable / disable commands because the collab-edit plugin
        // filters out any transactions with steps (even analytics) when it's initialising
        api?.analytics?.actions.fireAnalyticsEvent({
          action: ACTION.INITIALISED,
          actionSubject: ACTION_SUBJECT.LOOM,
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      };

      if (config) {
        setupLoom();
      }

      return {};
    },
  });
};
