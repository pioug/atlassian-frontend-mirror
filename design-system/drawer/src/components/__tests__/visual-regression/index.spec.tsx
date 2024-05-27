import {
  getExampleUrl,
  loadPage,
  type PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

import { widths } from '../../../constants';

async function waitForSidebar(page: PuppeteerPage, buttonSelector: string) {
  // Find and click the button to open the sidebar...
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);

  // Wait for the sidebar to be added to the DOM (via a portal)
  const closeButton = `button[data-testid="DrawerPrimitiveSidebarCloseButton"]`;
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

  it('should match menu usage screenshot', async () => {
    const url = getExampleUrl(
      'design-system',
      'drawer',
      'drawer-menu',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    // Wait for the sidebar to be added to the DOM (via a portal)
    const closeButton = `button[data-testid="DrawerPrimitiveSidebarCloseButton"]`;
    await page.waitForSelector(closeButton);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should prevent programmatic scroll when open', async () => {
    const url = getExampleUrl(
      'design-system',
      'drawer',
      'scroll',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    await page.setViewport({ width: 800, height: 600 });
    await page.evaluate(() => window.scrollBy(0, 50));

    await page.click('[data-testid="open-drawer"]');
    await page.waitForSelector('[data-testid="content-inner"]');

    // should not scroll the page further, but the drawer will scroll
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.evaluate(() =>
      document
        .querySelector('[data-testid="content-inner"]')
        ?.parentElement?.scrollBy(0, 700),
    );

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  it('should have the correct end state in cases where the page content zindex could conflict', async () => {
    const url = getExampleUrl(
      'design-system',
      'drawer',
      'drawer-stacking-contexts',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    const button = `#open-drawer`;
    await waitForSidebar(page, button);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
