import {
  getExampleUrl,
  loadPage,
  PuppeteerPage,
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
});
