import { snapshot } from '@af/visual-regression';

import JiraIssuesTable, {
	JiraIssuesTableDaterange,
} from '../../examples/vr/jira-issues-table-vr.vr.ap';

snapshot(JiraIssuesTable, {
	description: 'Jira Issues Table',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
	featureFlags: {
		electric_issue_like_table_xpc_url_wrapping: [true, false],
	},
});

snapshot(JiraIssuesTableDaterange, {
	description: 'Jira Issues Table Daterange',
	ignoredErrors: [
		{
			pattern: /(received unsupported error)|(The above error occurred in the)/,
			ignoredBecause: 'Intentionally triggering an error to capture error boundary fallback',
			jiraIssueId: 'NONE-123',
		},
	],
});
