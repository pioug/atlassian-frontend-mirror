import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalNoInitialJQL } from '../../examples/vr/jira-issues-config-modal-no-initial-jql-vr';

snapshot(JiraIssuesConfigModalNoInitialJQL, {
  description: 'Jira issues config modal without initial JQL',
  drawsOutsideBounds: true,
});
