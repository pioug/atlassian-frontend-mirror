import type { FeatureFlags, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type FeatureFlagsPluginOptions = FeatureFlags;

export type FeatureFlagsPlugin = NextEditorPlugin<
	'featureFlags',
	{
		pluginConfiguration: FeatureFlagsPluginOptions;
		sharedState: FeatureFlags;
	}
>;
