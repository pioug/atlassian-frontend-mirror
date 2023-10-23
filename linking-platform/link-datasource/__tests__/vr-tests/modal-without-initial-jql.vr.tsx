import { snapshot } from '@af/visual-regression';

import JiraIssuesConfigModalNoInitialJQL from '../../examples/jira-issues-config-modal-no-initial-jql-vr';

// Skipped because this test makes a failing network request and was previously
// Flakey. This test should be re-enabled once the network request has been mocked out properly
snapshot.skip(JiraIssuesConfigModalNoInitialJQL, {
  description: 'Jira issues config modal without initial JQL',
  drawsOutsideBounds: true,
});
