import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { MetricsState } from './pm-plugins/main';

export type MetricsPlugin = NextEditorPlugin<
	'metrics',
	{
		dependencies: [AnalyticsPlugin];
		sharedState: MetricsState;
		commands: {
			stopActiveSession: () => EditorCommand;
		};
	}
>;
