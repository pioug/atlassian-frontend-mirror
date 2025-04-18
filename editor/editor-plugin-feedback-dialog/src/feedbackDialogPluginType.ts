import type { FeedbackInfo, NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { openFeedbackDialog } from './feedbackDialogPlugin';

export type FeedbackDialogPluginDependencies = [OptionalPlugin<AnalyticsPlugin>];

export type FeedbackDialogPlugin = NextEditorPlugin<
	'feedbackDialog',
	{
		pluginConfiguration: FeedbackInfo;
		dependencies: FeedbackDialogPluginDependencies;
		actions: {
			openFeedbackDialog: typeof openFeedbackDialog;
		};
	}
>;
