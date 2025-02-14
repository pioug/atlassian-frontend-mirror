import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalNoJiraInstancesState } from '../../examples/vr/jira-issues-config-modal-no-jira-instances-vr';

snapshot(JiraIssuesConfigModalNoJiraInstancesState, {
	description: 'Jira issues config modal no jira instances view',
	drawsOutsideBounds: true,
	featureFlags: {
		'bandicoots-compiled-migration-link-datasource': [true, false],
	},
});
