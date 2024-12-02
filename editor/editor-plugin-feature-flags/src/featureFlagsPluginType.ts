import type { FeatureFlags, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type FeatureFlagsPlugin = NextEditorPlugin<
	'featureFlags',
	{
		pluginConfiguration: FeatureFlags;
		sharedState: FeatureFlags;
	}
>;
