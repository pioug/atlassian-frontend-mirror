import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalUnauthorizedEditState } from '../../examples/jira-issues-config-modal-unauth-edit-vr';

snapshot(JiraIssuesConfigModalUnauthorizedEditState, {
  description: 'Jira issues config modal unauthorized edit view',
  drawsOutsideBounds: true,
});
