import { snapshot } from '@af/visual-regression';

import { JiraIssuesTableNoResults } from '../../examples/vr/jira-issues-table-vr.vr.ap';

snapshot(JiraIssuesTableNoResults, {
	description: 'Jira Issues Table No Results',
	featureFlags: {
		platform_lp_sllv_ux_improvements: [true],
	},
});
