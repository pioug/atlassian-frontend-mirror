import adf from './__fixtures__/default-table.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import tableMergedColumnsADF from './__fixtures__/table-with-first-column-merged.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  insertRow,
  insertColumn,
  tableSelectors,
  clickFirstCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { animationFrame } from '@atlaskit/editor-test-helpers/page-objects/editor';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

let page: PuppeteerPage;
const initEditor = async (adf: Object) => {
  await initEditorWithAdf(page, {
    appearance: Appearance.fullPage,
    adf,
    viewport: { width: 1040, height: 500 },
  });
  await clickFirstCell(page);
};

describe('Snapshot Test: table insert/delete with merged columns', () => {
  beforeAll(() => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor(tableMergedColumnsADF);
  });

  afterEach(async () => {
    await page.waitForSelector('[aria-label*="Table floating controls"]');
    await snapshot(page);
  });

  xtest('should be able to insert a column at the end of the table', async () => {
    await insertColumn(page, 0, 'right');
  });
});

describe('Snapshot Test: table insert/delete', () => {
  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor(adf);
  });

  afterEach(async () => {
    await page.waitForSelector('[aria-label*="Table floating controls"]');
    await snapshot(page);
  });

  it(`should be able insert after first row`, async () => {
    await page.waitForSelector(tableSelectors.firstRowControl);
    await page.hover(tableSelectors.firstRowControl);
    await page.waitForSelector(tableSelectors.hoveredCell);
  });

  it(`should be able insert after last row`, async () => {
    await page.waitForSelector(tableSelectors.firstRowControl);
    await page.hover(tableSelectors.lastRowControl);
    await page.waitForSelector(tableSelectors.hoveredCell);
  });

  // TODO: measure how flaky this is
  it(`should be able insert after first column`, async () => {
    await page.waitForSelector(tableSelectors.removeTable);
    await animationFrame(page);
    await page.waitForSelector(tableSelectors.firstColumnControl);
    await page.hover(tableSelectors.firstColumnControl);
    await page.waitForSelector(tableSelectors.hoveredCell);
  });

  // TODO: move this to integration tests in future
  it(`should be able to insert row`, async () => {
    await insertRow(page, 1);
  });

  it(`inserts multiple rows in succession`, async () => {
    await insertRow(page, 1);
    await insertRow(page, 1);
    await insertRow(page, 1);
  });

  // TODO: move this to integration tests in future
  it(`should be able to insert column`, async () => {
    await insertColumn(page, 1, 'left');
  });
});
