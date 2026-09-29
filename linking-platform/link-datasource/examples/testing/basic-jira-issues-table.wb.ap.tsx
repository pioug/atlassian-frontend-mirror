import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicJiraIssuesTableExample from '../basic-jira-issues-table';

export const BasicJiraIssuesTable: WorkbenchExample<typeof BasicJiraIssuesTableExample> = wb(
	BasicJiraIssuesTableExample,
);
