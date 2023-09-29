import { snapshot } from '@af/visual-regression';

import { JiraIssuesConfigModalNoResultsState } from '../../examples/jira-issues-config-modal-no-results-vr';

snapshot(JiraIssuesConfigModalNoResultsState, {
  description: 'Jira issues config modal no results view',
  drawsOutsideBounds: true,
});
