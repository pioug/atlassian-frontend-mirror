import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, animationFrame } from './_utils';
import { richMediaClassName } from '@atlaskit/editor-common';
import mediaLink from './__fixtures__/media-link.adf.json';
import wrappedMediaLink from './__fixtures__/wrapped-media-link.adf.json';
import mediaLinkInsideExpand from './__fixtures__/media-link-inside-expand.adf.json';
import mediaLinkInsideNestedExpand from './__fixtures__/media-link-inside-nested-expand.adf.json';
import mediaLinkInsideTable from './__fixtures__/media-link-inside-table.adf.json';
import { waitForAllMedia } from '../__helpers/page-objects/_media';
import { Page } from 'puppeteer';

const mediaSingleSelector = `.${richMediaClassName}`;

const loadAdf = async (page: Page, adf: any) => {
  await initRendererWithADF(page, {
    adf: adf,
    appearance: 'full-page',
    rendererProps: {
      media: {
        allowLinking: true,
      },
      allowColumnSorting: true,
    },
  });
};

describe('media link:', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip(`should render a linked media image correctly`, async () => {
    await loadAdf(page, mediaLink);
    await waitForAllMedia(page, 1);

    await animationFrame(page);
    await snapshot(page);
  });

  it(`should render a linked media image correctly when focused`, async () => {
    await loadAdf(page, mediaLink);
    await waitForAllMedia(page, 1);

    await page.waitForSelector('a[href="https://www.atlassian.com/"]', {
      visible: true,
    });
    await page.focus('a[href="https://www.atlassian.com/"]');
    await page.hover(mediaSingleSelector);

    await animationFrame(page);
    await snapshot(page);
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip(`should render a linked media image below a wrapped image correctly`, async () => {
    await loadAdf(page, wrappedMediaLink);
    await waitForAllMedia(page, 2);

    await page.waitForSelector('a[href="https://www.atlassian.com/"]', {
      visible: true,
    });

    await animationFrame(page);
    await snapshot(page);
  });

  it(`should render a linked media image below a wrapped image correctly when focused`, async () => {
    await loadAdf(page, wrappedMediaLink);
    await waitForAllMedia(page, 2);

    await page.waitForSelector('a[href="https://www.atlassian.com/"]', {
      visible: true,
    });
    await page.focus('a[href="https://www.atlassian.com/"]');
    await page.hover('a[href="https://www.atlassian.com/"]');

    await animationFrame(page);
    await snapshot(page);
  });

  // TODO: https://product-fabric.atlassian.net/browse/ED-13527
  it.skip(`should render a linked media image inside an expand correctly`, async () => {
    await loadAdf(page, mediaLinkInsideExpand);

    await waitForAllMedia(page, 1);

    await page.click('button[aria-labelledby^="expand-title"]');

    await page.waitForSelector('a[href="https://www.atlassian.com/"]', {
      visible: true,
    });
    await page.focus('a[href="https://www.atlassian.com/"]');
    await page.hover(mediaSingleSelector);

    await animationFrame(page);
    await snapshot(page);
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip(`should render a linked media image inside a nested expand correctly`, async () => {
    await loadAdf(page, mediaLinkInsideNestedExpand);

    await waitForAllMedia(page, 1);

    await page.click('button[aria-labelledby^="expand-title"]');

    await page.waitForSelector('a[href="https://www.atlassian.com/"]', {
      visible: true,
    });
    await page.focus('a[href="https://www.atlassian.com/"]');
    await page.hover(mediaSingleSelector);

    await animationFrame(page);
    await snapshot(page);
  });

  // FIXME: This test was automatically skipped due to failure on 9/7/2021: https://product-fabric.atlassian.net/browse/ED-13719
  it.skip(`should render a linked media image inside a table correctly`, async () => {
    await loadAdf(page, mediaLinkInsideTable);

    await waitForAllMedia(page, 2);

    await page.waitForSelector('a[href="https://www.atlassian.com/"]', {
      visible: true,
    });
    await page.focus('a[href="https://www.atlassian.com/"]');
    await page.hover('a[href="https://www.atlassian.com/"]');

    await animationFrame(page);
    await snapshot(page);
  });
});
