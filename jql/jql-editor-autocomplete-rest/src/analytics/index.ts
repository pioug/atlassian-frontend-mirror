import {
  ANALYTICS_CHANNEL,
  useJqlPackageAnalytics,
} from '@atlaskit/jql-editor-common';

import { type Action, type ActionSubject, type ActionSubjectId } from './types';

export const useJqlEditorAutocompleteAnalytics = (analyticsSource: string) => {
  return useJqlPackageAnalytics<Action, ActionSubject, ActionSubjectId>(
    analyticsSource,
    process.env._PACKAGE_NAME_,
    process.env._PACKAGE_VERSION_,
    ANALYTICS_CHANNEL,
  );
};

export { ActionSubjectId, ActionSubject, Action } from './types';
export type { JqlEditorAutocompleteAnalyticsEvent } from './types';
