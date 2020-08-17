import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
  waitForElementCount,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';

import { widths } from '../../../constants';

async function waitForSidebar(page: PuppeteerPage, buttonSelector: string) {
  // Find and click the button to open the sidebar...
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);

  // Wait for the sidebar to be added to the DOM (via a portal)
  const closeButton = `button[data-test-selector="DrawerPrimitiveSidebarCloseButton"]`;
  await page.waitForSelector(closeButton);
}

describe('Snapshot Test', () => {
  for (const width of widths) {
    it(`should match ${width} drawer screenshot`, async () => {
      const url = getExampleUrl(
        'design-system',
        'drawer',
        'drawer-widths',

        global.__BASEURL__,
      );

      const { page } = global;
      await loadPage(page, url);
      const button = `#open-${width}-drawer`;
      await waitForSidebar(page, button);

      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });
  }
  it('should match themed drawer screenshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'drawer',
      'themed-drawer-with-search',
      global.__BASEURL__,
    );

    const { page } = global;
    const button = '#button';
    await loadPage(page, url);

    await waitForSidebar(page, button);

    const objectExamplesSelector = 'div[aria-label="Object examples"]';
    await page.waitForSelector(objectExamplesSelector);

    // Wait for BG images which replace SVG icons (final state)
    const bgImgSelector = 'span[role="img"]';
    const bgImgIconSelector = `${objectExamplesSelector} ${bgImgSelector}`;
    await waitForElementCount(page, bgImgIconSelector, 2, {
      timeout: 30000, // Longer timeout to allow time to download over the internet
      polling: 500,
    });
    // Wait for BG image icons to be downloaded from an external URL
    await waitForLoadedBackgroundImages(page, bgImgSelector);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
