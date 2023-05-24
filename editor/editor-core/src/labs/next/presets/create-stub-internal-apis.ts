import React from 'react';
import type { EditorPlugin } from '@atlaskit/editor-common/types';
import {
  CreateUIAnalyticsEvent,
  useAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { createEditorSelectionAPI } from '../../../selection-api/api';
import type { EditorSelectionAPI } from '@atlaskit/editor-common/selection';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

/**
 * DO NOT USE THIS FUNCTION
 *
 * IT IS A TEMPORARY PLACEHOLDER UNTIL THOSE TICKETS XX-11111 XX-22222 are done
 **/
export const createStubInternalApis = () => {
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
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        'This should never be called, if it does we have a problem',
      );
    }
    return { fire: () => {} };
  };

  const editorSelectionAPI: EditorSelectionAPI = createEditorSelectionAPI();

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
              view: () => {
                return {
                  destroy() {
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
    createAnalyticsEvent,
    stubInternalApisPlugin,
  };
};
