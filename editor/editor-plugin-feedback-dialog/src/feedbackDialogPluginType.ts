import type { FeedbackInfo, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { openFeedbackDialog } from './feedbackDialogPlugin';

export type FeedbackDialogPlugin = NextEditorPlugin<
	'feedbackDialog',
	{
		pluginConfiguration: FeedbackInfo;
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		actions: {
			openFeedbackDialog: typeof openFeedbackDialog;
		};
	}
>;
