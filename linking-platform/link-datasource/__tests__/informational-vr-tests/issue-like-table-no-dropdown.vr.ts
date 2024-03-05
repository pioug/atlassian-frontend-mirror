// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import JiraIssuesTableNoWrapControl from '../../examples/vr/issue-like-table-no-wrap-control';
import JiraIssuesTableReadonly from '../../examples/vr/issue-like-table-readonly';

snapshotInformational(JiraIssuesTableReadonly, {
  prepare: async (page: Page, _component: Locator) => {
    // Changing size of the viewport to focus on what is interesting to us.
    page.setViewportSize({ height: 100, width: 300 });

    // Hack to make test actually fail when hover effect is not there.
    // We override default (pretty pale gray) hover color with red.
    await page.addStyleTag({
      content: `
        html {
          --ds-background-input-hovered: red !important;
        }
      `,
    });

    await page.getByTestId(`people-column-heading`).hover();
  },
  description: `Hovering over people header in readonly mode`,
});

snapshotInformational(JiraIssuesTableNoWrapControl, {
  prepare: async (page: Page, _component: Locator) => {
    // Changing size of the viewport to focus on what is interesting to us.
    page.setViewportSize({ height: 100, width: 300 });

    // Hack to make test actually fail when hover effect is not there.
    // We override default (pretty pale gray) hover color with red.
    await page.addStyleTag({
      content: `
        html {
          --ds-background-input-hovered: red !important;
        }
      `,
    });

    await page.getByTestId(`people-column-heading`).hover();
  },
  description: `Hovering over people header in no wrap controls mode`,
});
