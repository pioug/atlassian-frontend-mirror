import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CollabEditPlugin } from '@atlaskit/editor-plugin-collab-edit';

export type NcsStepMetricsPlugin = NextEditorPlugin<
	'ncsStepMetrics',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<CollabEditPlugin>];
	}
>;
