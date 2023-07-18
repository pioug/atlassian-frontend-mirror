import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Icon VRs', () => {
  it('SSR & Hydrated Icons are visually identical', async () => {
    const url = getExampleUrl(
      'design-system',
      'icon',
      'ssr-icons',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    const [$ssrElement, $hydratedElement] = await Promise.all([
      await page.waitForSelector('#ssr'),
      await page.waitForSelector('#hydrated'),
    ]);

    await expect($ssrElement).toMatchVisually($hydratedElement);
  });
});
