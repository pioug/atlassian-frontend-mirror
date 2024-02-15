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

const LOOM_SDK_PUBLIC_APP_ID = 'e1cff63a-8ca2-4c2c-ad41-d61c54beb16a';

export const createPlugin = (
  api: ExtractInjectionAPI<LoomPlugin> | undefined,
) => {
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
        // Asynchronously check if the Loom SDK is supported
        // it hits a Loom API so could take a while
        const { isSupported, setup } = await import(
          /* webpackChunkName: "@atlaskit-internal_editor-loom-sdk" */ '@loomhq/record-sdk'
        );
        const { supported, error } = await isSupported();

        if (!supported) {
          // Keep plugin state update and analytics separate to avoid accidentally not updating
          // plugin state due to collab-edit filtering out transactions with steps
          api?.core?.actions.execute(disableLoom({ error }));
          logException(new Error(error), {
            location: 'editor-plugin-loom/sdk-initialisation',
          });
          // We're not combining the analytics steps into the enable / disable commands because the collab-edit plugin
          // filters out any transactions with steps (even analytics) when it's initialising
          api?.analytics?.actions.fireAnalyticsEvent({
            action: ACTION.ERRORED,
            actionSubject: ACTION_SUBJECT.LOOM,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: { error },
          });
          return;
        }

        const { configureButton } = await setup({
          publicAppId: LOOM_SDK_PUBLIC_APP_ID,
        });

        // Hidden element to work around the SDK API
        const loomButton = document.createElement('button');
        const sdkButton = configureButton({
          element: loomButton,
        });

        // Attach insertion logic to the event handlers on the SDK
        sdkButton.on('insert-click', async video => {
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

      setupLoom();

      return {};
    },
  });
};
