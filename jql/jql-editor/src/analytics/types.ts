import { JqlAnalyticsEvent } from '@atlaskit/jql-editor-common';

import { Action, ActionSubject, ActionSubjectId } from './constants';

export type JqlEditorAnalyticsEvent = JqlAnalyticsEvent<
  Action,
  ActionSubject,
  ActionSubjectId
>;
