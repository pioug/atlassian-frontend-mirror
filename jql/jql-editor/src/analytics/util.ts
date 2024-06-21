import { ANALYTICS_CHANNEL, useJqlPackageAnalytics } from '@atlaskit/jql-editor-common';

import { type Action, type ActionSubject, type ActionSubjectId } from './constants';

export const useJqlEditorAnalytics = (analyticsSource: string) => {
	return useJqlPackageAnalytics<Action, ActionSubject, ActionSubjectId>(
		analyticsSource,
		process.env._PACKAGE_NAME_ as string,
		process.env._PACKAGE_VERSION_ as string,
		ANALYTICS_CHANNEL,
	);
};
