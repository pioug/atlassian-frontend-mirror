import { type JqlAnalyticsEvent } from '@atlaskit/jql-editor-common';

import { type Action, type ActionSubject, type ActionSubjectId } from './constants';

export type JqlEditorAnalyticsEvent = JqlAnalyticsEvent<
  Action,
  ActionSubject,
  ActionSubjectId
>;
