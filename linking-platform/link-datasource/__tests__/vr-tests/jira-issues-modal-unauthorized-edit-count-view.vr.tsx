import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalUnauthorizedEditCountViewState } from '../../examples/vr/jira-issues-config-modal-unauth-edit-count-view-vr';

snapshot(JiraIssuesConfigModalUnauthorizedEditCountViewState, {
	description: 'Jira issues config modal unauthorized edit count view',
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-1819-link-create-confluence-site-migration': true,
	},
});
