import { wb, type WorkbenchExample } from '@atlassian/workbench';

import JiraIssuesConfigModalNoResultsExample from '../jira-issues-config-modal-no-results.vr.ap';

export const JiraIssuesConfigModalNoResults: WorkbenchExample<
	typeof JiraIssuesConfigModalNoResultsExample
> = wb(JiraIssuesConfigModalNoResultsExample);
