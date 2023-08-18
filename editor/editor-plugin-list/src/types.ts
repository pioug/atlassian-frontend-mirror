import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

export type ListPluginOptions = Pick<FeatureFlags, 'restartNumberedLists'>;

export type ListPlugin = NextEditorPlugin<
  'list',
  {
    pluginConfiguration: ListPluginOptions | undefined;
    dependencies: [
      typeof featureFlagsPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
    ];
  }
>;
