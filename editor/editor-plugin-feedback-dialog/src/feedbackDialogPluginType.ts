import type { FeedbackInfo } from '@atlaskit/editor-common/types/feedback-dialog';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';

import type { openFeedbackDialog } from './feedbackDialogPlugin';

export type FeedbackDialogPluginDependencies = [OptionalPlugin<AnalyticsPlugin>];

export type FeedbackDialogPlugin = NextEditorPlugin<
	'feedbackDialog',
	{
		actions: {
			openFeedbackDialog: typeof openFeedbackDialog;
		};
		dependencies: FeedbackDialogPluginDependencies;
		pluginConfiguration: FeedbackInfo;
	}
>;
