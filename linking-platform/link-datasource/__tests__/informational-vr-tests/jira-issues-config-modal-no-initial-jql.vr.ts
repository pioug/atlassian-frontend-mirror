// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import JiraIssuesConfigModalNoInitialJql from '../../examples/vr/jira-issues-config-modal-no-initial-jql-vr';

snapshotInformational(JiraIssuesConfigModalNoInitialJql, {
  prepare: async (page: Page, _component: Locator) => {
    await page.getByTestId('mode-toggle-basic').first().click();
  },
  drawsOutsideBounds: true,
  description: 'Jira Issues Config Modal No Initial Jql toggle to Basic mode',
});
