import { createPlugin, pluginKey } from './pm-plugins/main';
import type { ContextIdentifierPlugin } from './types';

export const contextIdentifierPlugin: ContextIdentifierPlugin = ({
  config,
  api,
}) => {
  return {
    name: 'contextIdentifier',
    commands: {
      setProvider:
        config =>
        ({ tr }) => {
          // If no change, don't dispatch
          if (
            config?.contextIdentifierProvider ===
            api?.contextIdentifier?.sharedState.currentState()
              ?.contextIdentifierProvider
          ) {
            return null;
          }
          return tr.setMeta(pluginKey, {
            contextIdentifierProvider: config?.contextIdentifierProvider,
          });
        },
    },
    getSharedState(state) {
      if (!state) {
        return undefined;
      }
      return {
        contextIdentifierProvider:
          pluginKey.getState(state)?.contextIdentifierProvider,
      };
    },

    pmPlugins: () => {
      return [
        {
          name: 'contextIdentifier',
          plugin: createPlugin(config, api),
        },
      ];
    },
  };
};
