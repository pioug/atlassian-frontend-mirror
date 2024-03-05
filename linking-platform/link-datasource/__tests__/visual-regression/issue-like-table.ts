import invariant from 'tiny-invariant';

import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

const spinner = '[data-testid="link-datasource--spinner-backdrop"]';
const firstCell = '[data-testid="link-datasource--cell-0"]';

describe('Editable Issue Like Table', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    const url = getExampleUrl(
      'linking-platform',
      'link-datasource',
      'issue-like-table',
      __BASEURL__,
    );

    await page.setViewport({
      width: 1000,
      height: 700,
    });

    await loadPage(page, url);
    await page.waitForSelector(spinner, { hidden: true });
    await page.waitForSelector(firstCell);
  });

  // Moved to vr-tests
  it.skip('should match snapshot', async () => {
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  // Moved to informational-vr-tests
  it.skip('should have columns present in picker', async () => {
    const pickerOpenButton = await page.$(
      '[data-testid="column-picker-trigger-button"]',
    );

    invariant(pickerOpenButton, 'column picker trigger button not found');

    await pickerOpenButton.click();

    await page.waitForSelector('.column-picker-popup__menu-list', {
      visible: true,
    });

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  // Moved to informational-vr-tests
  // FIXME: This test was skipped manually my @sasha because it is failing in CI, and only in CI
  // https://product-fabric.atlassian.net/browse/EDM-7035
  it.skip('should able to drag column', async () => {
    // Allowing capturing of drag events
    // https://pub.dev/documentation/puppeteer/latest/puppeteer/Page/setDragInterception.html
    await page.setViewport({
      width: 1300,
      height: 800,
    });
    await page.setDragInterception(true);

    await page.waitForSelector('[data-testid="type-column-heading"]', {
      visible: true,
    });
    const dragHandle = await page.$('[data-testid="type-column-heading"]');
    invariant(dragHandle, 'drag handle not found');

    await page.waitForSelector(
      '[data-testid="priority-column-heading"] [data-testid="column-drop-target"]',
      {
        visible: true,
      },
    );
    const dropTarget = await page.$(
      '[data-testid="priority-column-heading"] [data-testid="column-drop-target"]',
    );
    invariant(dropTarget, `drop target not found`);

    await page.waitForTimeout(2000);

    await dragHandle.dragAndDrop(dropTarget);
    await page.waitForTimeout(2000);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});

// Moved to vr-tests
describe.skip('Readonly Issue Like Table', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    const url = getExampleUrl(
      'linking-platform',
      'link-datasource',
      'issue-like-table-readonly',
      __BASEURL__,
    );

    await page.setViewport({
      width: 1000,
      height: 700,
    });

    await loadPage(page, url);
    await page.waitForSelector(spinner, { hidden: true });
  });

  it('should match snapshot', async () => {
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
