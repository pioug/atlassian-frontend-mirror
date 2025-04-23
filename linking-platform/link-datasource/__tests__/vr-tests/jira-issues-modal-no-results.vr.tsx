import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalNoResultsState } from '../../examples/jira-issues-config-modal-no-results';

snapshot(JiraIssuesConfigModalNoResultsState, {
	description: 'Jira issues config modal no results view',
	drawsOutsideBounds: true,
	featureFlags: {
		'bandicoots-update-sllv-icons': [true, false],
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});
