import type { PastePlugin } from './types';
import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-factory';

export const pastePlugin: PastePlugin = ({ config, api }) => {
  const { cardOptions, sanitizePrivateContent } = config ?? {};
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};
  return {
    name: 'paste',

    pmPlugins() {
      return [
        {
          name: 'paste',
          plugin: ({
            schema,
            providerFactory,
            dispatchAnalyticsEvent,
            dispatch,
          }) =>
            createPlugin(
              schema,
              dispatchAnalyticsEvent,
              dispatch,
              featureFlags,
              api,
              cardOptions,
              sanitizePrivateContent,
              providerFactory,
            ),
        },
      ];
    },

    getSharedState: (editorState) => {
      if (!editorState) {
        return {
          lastContentPasted: null,
        };
      }

      const pluginState = pluginKey.getState(editorState);

      return {
        lastContentPasted: pluginState.lastContentPasted,
      };
    },
  };
};
