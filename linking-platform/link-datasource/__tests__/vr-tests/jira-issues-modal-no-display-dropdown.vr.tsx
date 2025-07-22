import { snapshot } from '@af/visual-regression';

import JiraIssuesConfigModalNoDisplayDropdown from '../../examples/vr/jira-issues-config-modal-no-display-dropdown-vr';

snapshot(JiraIssuesConfigModalNoDisplayDropdown, {
	description: 'Jira issues config modal without display dropdown',
	drawsOutsideBounds: true,
	featureFlags: {
		'replace-legacy-button-in-sllv': true,
	},
});
