// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator, Page } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';

import JiraIssuesTable from '../../examples/jira-issues-table';
snapshotInformational(JiraIssuesTable, {
  prepare: async (page: Page, _component: Locator) => {
    await page
      .getByTestId('datasource-table-view--row-DONUT-11720')
      .getByTestId('datasource-table-view--cell-6')
      .first()
      .hover();
  },
  drawsOutsideBounds: true,
  description: 'Hovering over "label, another, third" Labels',
});
snapshotInformational(JiraIssuesTable, {
  prepare: async (page: Page, _component: Locator) => {
    await page
      .getByTestId('datasource-table-view--row-DONUT-11740')
      .getByTestId('datasource-table-view--cell-0')
      .getByRole('img')
      .hover();
  },
  drawsOutsideBounds: true,
  description: 'Hovering over "bug" Icon',
});
snapshotInformational(JiraIssuesTable, {
  prepare: async (page: Page, _component: Locator) => {
    await page
      .getByTestId('datasource-table-view--row-DONUT-11740')
      .getByTestId('datasource-table-view--cell-3')
      .hover();
  },
  drawsOutsideBounds: true,
  description: 'Hovering over "Unassigned" Assignee',
});
snapshotInformational(JiraIssuesTable, {
  prepare: async (page: Page, _component: Locator) => {
    await page
      .getByTestId('datasource-table-view--row-DONUT-11770')
      .getByTestId('datasource-table-view--cell-4')
      .hover();
  },
  drawsOutsideBounds: true,
  description: 'Hovering over People',
});
snapshotInformational(JiraIssuesTable, {
  prepare: async (page: Page, _component: Locator) => {
    await page
      .getByTestId('datasource-table-view--row-DONUT-11720')
      .getByTestId('datasource-table-view--cell-7')
      .getByTestId('link-datasource-render-type--status')
      .hover();
  },
  drawsOutsideBounds: true,
  description: 'Hovering over "TO DO" Status',
});
snapshotInformational(JiraIssuesTable, {
  prepare: async (page: Page, _component: Locator) => {
    await page
      .getByTestId('datasource-table-view--row-DONUT-11740')
      .getByTestId('datasource-table-view--cell-8')
      .hover();
  },
  drawsOutsideBounds: true,
  description: 'Hovering over Date',
});
snapshotInformational(JiraIssuesTable, {
  prepare: async (page: Page, _component: Locator) => {
    await page.evaluate(() => {
      window.scrollBy({
        top: 0,
        left: 500,
        behavior: 'smooth',
      });
    });
    await page
      .getByTestId('datasource-table-view--row-DONUT-11730')
      .getByTestId('datasource-table-view--cell-9')
      .hover();
  },
  drawsOutsideBounds: true,
  description: 'Hovering over Description',
});
