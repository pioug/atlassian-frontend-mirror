import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalNoJiraInstancesState } from '../../examples/vr/jira-issues-config-modal-no-jira-instances-vr.vr.ap';

snapshot(JiraIssuesConfigModalNoJiraInstancesState, {
	description: 'Jira issues config modal no jira instances view',
	drawsOutsideBounds: true,
});
