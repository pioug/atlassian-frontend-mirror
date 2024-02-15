// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import WithModal from '../../examples/with-modal';

async function openDropDown(page: Page) {
  await page
    .getByTestId('jira-jql-datasource-modal--view-drop-down--trigger')
    .click();
}

snapshotInformational(WithModal, {
  description: 'modal with drop down closed',
  drawsOutsideBounds: true,
});
snapshotInformational(WithModal, {
  prepare: async (page: Page, _component: Locator) => {
    await openDropDown(page);
  },
  description: 'modal with an open drop down',
  drawsOutsideBounds: true,
});
snapshotInformational(WithModal, {
  prepare: async (page: Page, _component: Locator) => {
    await openDropDown(page);
    await page.getByTestId('dropdown-item-inline-link').click();
  },
  description: 'modal after selecting Inline link from the drop down',
  drawsOutsideBounds: true,
});
snapshotInformational(WithModal, {
  prepare: async (page: Page, _component: Locator) => {
    await openDropDown(page);
    await page.getByTestId('dropdown-item-inline-link').click();
    await openDropDown(page);
  },
  description: 'modal after selecting Inline link with open drop down',
  drawsOutsideBounds: true,
});
