import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, animationFrame } from './_utils';
import { richMediaClassName } from '@atlaskit/editor-common/styles';
import mediaLink from './__fixtures__/media-link.adf.json';
import wrappedMediaLink from './__fixtures__/wrapped-media-link.adf.json';
import mediaLinkInsideExpand from './__fixtures__/media-link-inside-expand.adf.json';
import mediaLinkInsideNestedExpand from './__fixtures__/media-link-inside-nested-expand.adf.json';
import mediaLinkInsideTable from './__fixtures__/media-link-inside-table.adf.json';
import { waitForAllMedia } from '../__helpers/page-objects/_media';
import { Page } from 'puppeteer';
import leftWrappedMultipleMediaInsideTable from './__fixtures__/left-wrapped-multiple-media-link-in-table.adf.json';
import rightWrappedMultipleMediaInsideTable from './__fixtures__/right-wrapped-multiple-media-link-in-table.adf.json';
import leftRightWrappedMultipleMediaInsideTable from './__fixtures__/left-right-wrapped-multiple-media-link-in-table.adf.json';

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

  it(`should render a linked media image correctly`, async () => {
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

  it(`should render a linked media image below a wrapped image correctly`, async () => {
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

  it(`should render a linked media image inside an expand correctly`, async () => {
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

  it(`should render a linked media image inside a nested expand correctly`, async () => {
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

  // FIXME: This test was automatically skipped due to failure on 22/06/2023: https://product-fabric.atlassian.net/browse/ED-18912
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

  // FIXME: This test was automatically skipped due to failure on 26/05/2023: https://product-fabric.atlassian.net/browse/ED-18085
  it.skip(`should horizontally render multiple wrapped-left linked media images inside a table`, async () => {
    await loadAdf(page, leftWrappedMultipleMediaInsideTable);

    await waitForAllMedia(page, 2);

    await page.waitForSelector('a[href="https://www.atlassian.com/"]', {
      visible: true,
    });
    await page.focus('a[href="https://www.atlassian.com/"]');
    await page.hover('a[href="https://www.atlassian.com/"]');

    await animationFrame(page);
    await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.05 });
  });

  it(`should horizontally render multiple wrapped-right linked media images inside a table`, async () => {
    await loadAdf(page, rightWrappedMultipleMediaInsideTable);

    await waitForAllMedia(page, 2);

    await page.waitForSelector('a[href="https://www.atlassian.com/"]', {
      visible: true,
    });
    await page.focus('a[href="https://www.atlassian.com/"]');
    await page.hover('a[href="https://www.atlassian.com/"]');

    await animationFrame(page);
    await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.05 });
  });

  it(`should horizontally render multiple left & right wrapped linked media images inside a table`, async () => {
    await loadAdf(page, leftRightWrappedMultipleMediaInsideTable);

    await waitForAllMedia(page, 2);

    await page.waitForSelector('a[href="https://www.atlassian.com/"]', {
      visible: true,
    });
    await page.focus('a[href="https://www.atlassian.com/"]');
    await page.hover('a[href="https://www.atlassian.com/"]');

    await animationFrame(page);
    await snapshot(page, { useUnsafeThreshold: true, tolerance: 0.05 });
  });
});
