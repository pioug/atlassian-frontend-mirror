import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { createPlugin } from './pm-plugins/main';
import type { CardOptions } from '@atlaskit/editor-common/card';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { cardPlugin } from '@atlaskit/editor-plugin-card';
import type betterTypeHistoryPlugin from '../better-type-history';
import type { listPlugin } from '@atlaskit/editor-plugin-list';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { MediaNextEditorPluginType } from '../media/next-plugin-type';

export type PastePluginOptions = {
  cardOptions?: CardOptions;
  sanitizePrivateContent?: boolean;
};

export type PastePlugin = NextEditorPlugin<
  'paste',
  {
    pluginConfiguration: PastePluginOptions;
    dependencies: [
      FeatureFlagsPlugin,
      OptionalPlugin<typeof listPlugin>,
      typeof betterTypeHistoryPlugin,
      OptionalPlugin<typeof cardPlugin>,
      OptionalPlugin<typeof analyticsPlugin>,
      OptionalPlugin<MediaNextEditorPluginType>,
    ];
  }
>;

const pastePlugin: PastePlugin = ({ config, api }) => {
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

export default pastePlugin;
