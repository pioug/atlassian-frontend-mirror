import React from 'react';
import type { EditorView } from 'prosemirror-view';
import type { EditorPlugin } from '@atlaskit/editor-common/types';
import {
  CreateUIAnalyticsEvent,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { createEditorSelectionAPI } from '../../../selection-api/api';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';
import { createInsertNodeAPI } from '../../../insert-api/api';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { attachPayloadIntoTransaction } from '../../../analytics-api/attach-payload-into-transaction';
import { FabricChannel } from '@atlaskit/analytics-listeners';

/**
 * DO NOT USE THIS FUNCTION
 *
 * IT IS A TEMPORARY PLACEHOLDER UNTIL THOSE TICKETS XX-11111 XX-22222 are done
 **/
export const createStubInternalApis = () => {
  const editorViewRef: { current: EditorView | null } = { current: null };
  const createAnalyticsEventRef: { current: CreateUIAnalyticsEvent | null } = {
    current: null,
  };

  // @ts-ignore
  const createAnalyticsEvent: CreateUIAnalyticsEvent = (payload) => {
    // That means the AnalyticsNext context is being used
    if (createAnalyticsEventRef.current) {
      return createAnalyticsEventRef.current(payload);
    }

    // That means, there is no createAnalyticsEvent available at all.
    // This should not happen, but if it does, we will send a mock function to avoid
    // regression on SmartLinks (they are the only one using this function directly)
    // eslint-disable-next-line no-console
    console.error('This should never be called, if it does we have a problem');
    return { fire: () => {} };
  };

  const editorSelectionAPI: EditorSelectionAPI = createEditorSelectionAPI();
  const editorAnalyticsAPI: EditorAnalyticsAPI = {
    attachAnalyticsEvent: (payload) => (tr) => {
      const editorView = editorViewRef.current;

      if (!tr || !createAnalyticsEvent || !editorView) {
        return false;
      }
      attachPayloadIntoTransaction({
        tr,
        editorState: editorView.state,
        payload,
        channel: FabricChannel.editor,
      });

      return true;
    },
  };
  const insertNodeAPI = createInsertNodeAPI({
    getEditorView: () => {
      return editorViewRef.current;
    },

    getEditorPlugins: () => {
      const fakeTablePlugin = tablesPlugin();
      if (!fakeTablePlugin?.pluginsOptions) {
        return [];
      }
      return [fakeTablePlugin];
    },
  });
  const MountCreateAnalyticsEventRef = () => {
    const { createAnalyticsEvent } = useAnalyticsEvents();

    React.useLayoutEffect(() => {
      createAnalyticsEventRef.current = createAnalyticsEvent;
    }, [createAnalyticsEvent]);

    return null;
  };
  const stubInternalApisPlugin = (): EditorPlugin => ({
    name: 'stubInternalApisPlugin',
    pmPlugins() {
      return [
        {
          name: 'stubInternalApisPMPlugin',
          plugin: () =>
            new SafePlugin({
              view: (editorView) => {
                editorViewRef.current = editorView;
                return {
                  destroy() {
                    editorViewRef.current = null;
                    createAnalyticsEventRef.current = null;
                  },
                };
              },
            }),
        },
      ];
    },
    contentComponent: () => {
      return React.createElement(MountCreateAnalyticsEventRef);
    },
  });

  return {
    editorSelectionAPI,
    insertNodeAPI,
    editorAnalyticsAPI,
    createAnalyticsEvent,
    stubInternalApisPlugin,
  };
};
