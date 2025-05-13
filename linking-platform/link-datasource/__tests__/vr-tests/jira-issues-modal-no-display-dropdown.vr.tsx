import { snapshot } from '@af/visual-regression';

import JiraIssuesConfigModalNoDisplayDropdown from '../../examples/vr/jira-issues-config-modal-no-display-dropdown-vr';

snapshot(JiraIssuesConfigModalNoDisplayDropdown, {
	description: 'Jira issues config modal without display dropdown',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
		'replace-legacy-button-in-sllv': [false, true],
	},
});
