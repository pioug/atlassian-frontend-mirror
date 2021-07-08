import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Icon VRs', () => {
  it('Icon size example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'icon',
      'size-example',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const element = await page.$('#size-example');
    const largeButton = await page.$('[data-testid="large"]');
    const mediumImage = await element?.screenshot();
    expect(mediumImage).toMatchProdImageSnapshot();

    await largeButton?.click();
    const largeImage = await element?.screenshot();
    expect(largeImage).toMatchProdImageSnapshot();
  });

  it('Icon theme example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'icon',
      'theme-icons',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const element = await page.$('#theme-example');
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

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

  it('Custom glyph should render correctly', async () => {
    const url = getExampleUrl(
      'design-system',
      'icon',
      'using-custom-glyph',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    const element = await page.$('#custom');
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
