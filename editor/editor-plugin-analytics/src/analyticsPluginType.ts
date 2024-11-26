import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
	NextEditorPlugin,
	OptionalPlugin,
	PerformanceTracking,
} from '@atlaskit/editor-common/types';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

import type { CreateAttachPayloadIntoTransaction } from './pm-plugins/analytics-api/attach-payload-into-transaction';

export interface AnalyticsPluginOptions {
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	performanceTracking?: PerformanceTracking;
}

export type AnalyticsPlugin = NextEditorPlugin<
	'analytics',
	{
		pluginConfiguration: AnalyticsPluginOptions;
		sharedState: {
			/**
			 * **Warning:** Do not use this directly. Use the `analyticsPlugin.actions`
			 * instead, as it will properly queue all events.
			 */
			createAnalyticsEvent: CreateUIAnalyticsEvent | null;
			/**
			 * **Warning:** Do not use this directly. Use the `analyticsPlugin.actions`
			 * instead, as it will properly queue all events.
			 */
			attachAnalyticsEvent: CreateAttachPayloadIntoTransaction | null;
			performanceTracking: PerformanceTracking | undefined;
		};
		dependencies: [OptionalPlugin<FeatureFlagsPlugin>];
		actions: EditorAnalyticsAPI;
	}
>;
