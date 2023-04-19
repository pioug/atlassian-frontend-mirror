import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { createPlugin } from './pm-plugins/main';
import { CardOptions } from '@atlaskit/editor-common/card';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

export type PastePluginOptions = {
  cardOptions?: CardOptions;
  sanitizePrivateContent?: boolean;
};

const pastePlugin: NextEditorPlugin<
  'paste',
  {
    pluginConfiguration: PastePluginOptions;
    dependencies: [typeof featureFlagsPlugin];
  }
> = ({ cardOptions, sanitizePrivateContent }, api) => {
  const featureFlags =
    api?.dependencies?.featureFlags?.sharedState.currentState() || {};
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
              cardOptions,
              sanitizePrivateContent,
              providerFactory,
            ),
        },
      ];
    },
  };
};

export default pastePlugin;
