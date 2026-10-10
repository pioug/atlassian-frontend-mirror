import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { PerformanceTracking } from '@atlaskit/editor-common/types/performance-tracking';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';

import type { CreateAttachPayloadIntoTransaction } from './pm-plugins/analytics-api/attach-payload-into-transaction';

export interface AnalyticsPluginOptions {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	performanceTracking?: PerformanceTracking;
}

export type AnalyticsPlugin = NextEditorPlugin<
	'analytics',
	{
		actions: EditorAnalyticsAPI;
		dependencies: [OptionalPlugin<FeatureFlagsPlugin>];
		pluginConfiguration: AnalyticsPluginOptions;
		sharedState: {
			/**
			 * **Warning:** Do not use this directly. Use the `analyticsPlugin.actions`
			 * instead, as it will properly queue all events.
			 */
			attachAnalyticsEvent: CreateAttachPayloadIntoTransaction | null;
			/**
			 * **Warning:** Do not use this directly. Use the `analyticsPlugin.actions`
			 * instead, as it will properly queue all events.
			 */
			createAnalyticsEvent: CreateUIAnalyticsEvent | null;
			performanceTracking: PerformanceTracking | undefined;
		};
	}
>;
