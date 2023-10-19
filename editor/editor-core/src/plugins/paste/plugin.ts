import type { PastePlugin } from './types';
import { createPlugin } from './pm-plugins/main';

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
  };
};
