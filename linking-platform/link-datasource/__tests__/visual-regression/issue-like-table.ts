import invariant from 'tiny-invariant';

import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const selector = '[data-testid="link-datasource"]';
const spinner = '[data-testid="link-datasource--spinner-backdrop"]';

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
      height: 800,
    });

    await loadPage(page, url);
    await page.waitForSelector(spinner, { hidden: true });
  });

  it('should match snapshot', async () => {
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });

  it('should have columns present in picker', async () => {
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

  it('should able to drag column', async () => {
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
    );
    const dropTarget = await page.$(
      '[data-testid="priority-column-heading"] [data-testid="column-drop-target"]',
    );
    invariant(dropTarget, `drop target not found`);

    await dragHandle.dragAndDrop(dropTarget);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});

describe('Readonly Issue Like Table', () => {
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
      height: 800,
    });

    await loadPage(page, url);
    await page.waitForSelector(spinner, { hidden: true });
  });

  it('should match snapshot', async () => {
    const image = await takeElementScreenShot(page, selector);

    expect(image).toMatchProdImageSnapshot();
  });
});
