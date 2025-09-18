import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalUnauthorizedEditState } from '../../examples/vr/jira-issues-config-modal-unauth-edit-vr';

snapshot(JiraIssuesConfigModalUnauthorizedEditState, {
	description: 'Jira issues config modal unauthorized edit view',
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-1483-a11y-close-button-in-modal-updates': true,
		'navx-1819-link-create-confluence-site-migration': true,
	},
});
