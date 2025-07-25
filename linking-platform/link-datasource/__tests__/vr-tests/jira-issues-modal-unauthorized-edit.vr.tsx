import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalUnauthorizedEditState } from '../../examples/vr/jira-issues-config-modal-unauth-edit-vr';

snapshot(JiraIssuesConfigModalUnauthorizedEditState, {
	description: 'Jira issues config modal unauthorized edit view',
	drawsOutsideBounds: true,
	featureFlags: {
		'replace-legacy-button-in-sllv': true,
	},
});
