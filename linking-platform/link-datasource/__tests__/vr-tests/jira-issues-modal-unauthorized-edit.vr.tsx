import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalUnauthorizedEditState } from '../../examples/vr/jira-issues-config-modal-unauth-edit-vr.vr.ap';

snapshot(JiraIssuesConfigModalUnauthorizedEditState, {
	description: 'Jira issues config modal unauthorized edit view',
	drawsOutsideBounds: true,
});
