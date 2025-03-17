import { snapshot } from '@af/visual-regression';

import JiraIssuesTable from '../../examples/vr/jira-issues-table-vr';

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
		'platform-component-visual-refresh': [true, false],
	},
});
