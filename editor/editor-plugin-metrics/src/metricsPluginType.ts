import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';
// import type { AnalyticsPlugin } from '@atlaskit/editor-plugins/analytics';

import type { MetricsState } from './pm-plugins/main';

export type MetricsPlugin = NextEditorPlugin<
	'metrics',
	{
		// TODO: Add analytics plugin when analytics are fired
		// dependencies: [AnalyticsPlugin];
		sharedState: MetricsState;
		commands: {
			stopActiveSession: () => EditorCommand;
			fireSessionAnalytics: () => EditorCommand;
		};
	}
>;
