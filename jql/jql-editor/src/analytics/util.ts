import {
  ANALYTICS_CHANNEL,
  useJqlPackageAnalytics,
} from '@atlaskit/jql-editor-common';

import { Action, ActionSubject, ActionSubjectId } from './constants';

export const useJqlEditorAnalytics = (analyticsSource: string) => {
  return useJqlPackageAnalytics<Action, ActionSubject, ActionSubjectId>(
    analyticsSource,
    process.env._PACKAGE_NAME_,
    process.env._PACKAGE_VERSION_,
    ANALYTICS_CHANNEL,
  );
};
