import { ANALYTICS_CHANNEL } from '@atlaskit/jql-editor-common/constants';
import { useJqlPackageAnalytics } from '@atlaskit/jql-editor-common/util';
import type { JqlAnalyticsEvent } from '@atlaskit/jql-editor-common/analytics/types';

import { type Action, type ActionSubject, type ActionSubjectId } from './types';

export const useJqlEditorAutocompleteAnalytics = (
	analyticsSource: string,
): {
	createAndFireAnalyticsEvent: (
		payload: JqlAnalyticsEvent<Action, ActionSubject, ActionSubjectId>,
	) => void;
} => {
	return useJqlPackageAnalytics<Action, ActionSubject, ActionSubjectId>(
		analyticsSource,
		process.env._PACKAGE_NAME_ as string,
		process.env._PACKAGE_VERSION_ as string,
		ANALYTICS_CHANNEL,
	);
};
