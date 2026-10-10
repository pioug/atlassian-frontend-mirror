import type { FeatureFlags } from '@atlaskit/editor-common/types/feature-flags';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

export type FeatureFlagsPluginOptions = FeatureFlags;

export type FeatureFlagsPlugin = NextEditorPlugin<
	'featureFlags',
	{
		pluginConfiguration: FeatureFlagsPluginOptions;
		sharedState: FeatureFlags;
	}
>;
