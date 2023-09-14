import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  initFullPageEditorWithAdf,
  emulateSelectAll,
  pmSelector,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  tableSelectors,
  clickFirstCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import tableWithMergeRowAdf from './__fixtures__/table-with-merged-rows.adf.json';
import tableWithTrelloCardNarrowColumnsAdf from './__fixtures__/table-with-trello-card-narrow-columns.adf.json';

describe('Table cells borders:fullpage', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it('display cell borders', async () => {
    await initFullPageEditorWithAdf(page, tableWithMergeRowAdf);
    await snapshot(page);
  });
});

describe('Table cells are above content', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it('should display cell borders', async () => {
    await initEditorWithAdf(page, {
      adf: tableWithTrelloCardNarrowColumnsAdf,
      appearance: Appearance.fullPage,
    });

    await snapshot(page);
  });

  it('should display cell borders when selected', async () => {
    await initEditorWithAdf(page, {
      adf: tableWithTrelloCardNarrowColumnsAdf,
      appearance: Appearance.fullPage,
    });

    await page.focus(pmSelector);
    await emulateSelectAll(page);

    await snapshot(page);
  });

  it(`should display danger when hovers on remove for column`, async () => {
    await initEditorWithAdf(page, {
      adf: tableWithTrelloCardNarrowColumnsAdf,
      appearance: Appearance.fullPage,
    });

    await clickFirstCell(page, false);

    await page.waitForSelector(tableSelectors.firstColumnControl);
    await page.click(tableSelectors.firstColumnControl);
    await page.waitForSelector(tableSelectors.removeColumnButton);
    await page.hover(tableSelectors.removeColumnButton);
    await page.waitForSelector(tableSelectors.removeDanger);

    await snapshot(page);
  });
});
