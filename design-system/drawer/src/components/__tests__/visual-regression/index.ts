import {
  getExampleUrl,
  loadPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';

import { widths } from '../../../constants';

async function waitForSidebar(page: any, buttonSelector: string) {
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
      await loadPage(page, url, true);
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
    await loadPage(page, url, true);

    await waitForSidebar(page, button);

    const objectExamplesSelector = 'div[aria-label="Object examples"]';
    await page.waitForSelector(objectExamplesSelector);

    // Icons within sidebar have an initial loading state where an SVG is shown,
    // before loading an external background-image spritesheet. There are two icons.

    /*
    // Wait for SVG icons (loading state)
    // FIXME: Flaky results in CI. Possibly the loading state is skipped under some scenarios?
    const svgIconSelector = `${objectExamplesSelector} span[role="presentation"] > svg`;
    await page.waitFor(
      (selector: string) => {
        // There are two elements, but we can proceed to start listening for
        // the final state as soon as one is present.
        return document.querySelectorAll(selector).length > 0;
      },
      // requestAnimationFrame polling because these elements get replaced
      { timeout: 10000, polling: 'raf' },
      svgIconSelector,
    );
    */
    // Wait for BG images which replace SVG icons (final state)
    const bgImgSelector = 'span[role="img"]';
    const bgImgIconSelector = `${objectExamplesSelector} ${bgImgSelector}`;
    await page.waitFor(
      (selector: string) => {
        return document.querySelectorAll(selector).length === 2;
      },
      // Longer timeout to allow time to download over the internet
      { timeout: 30000, polling: 500 },
      bgImgIconSelector,
    );
    // Wait for BG image icons to be downloaded from an external URL
    await waitForLoadedBackgroundImages(page, bgImgSelector);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
