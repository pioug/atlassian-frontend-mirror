/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

/**
 * @deprecated Use `import { ActionSubject, ActionSubjectId, Action } from '@atlaskit/jql-editor/analytics'` instead.
 */

export { ActionSubject, ActionSubjectId, Action } from './constants';
/**
 * @deprecated Use `import { JQLEditorAnalyticsListener } from '@atlaskit/jql-editor/jql-editor-analytics-listener'` instead.
 */
export { JQLEditorAnalyticsListener } from './listener/jql-editor-analytics-listener';
export type { ListenerProps } from './listener/jql-editor-analytics-listener';
export type { JqlEditorAnalyticsEvent } from './types';
/**
 * @deprecated Use `import { useJqlEditorAnalytics } from '@atlaskit/jql-editor/analytics/util'` instead.
 */
export { useJqlEditorAnalytics } from './util';
