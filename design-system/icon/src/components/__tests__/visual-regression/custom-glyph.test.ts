import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('icon custom glyph used incorrectly', () => {
  it('should produce the same icon size even when it is incorrect', async () => {
    const url = getExampleUrl(
      'design-system',
      'icon',
      'invalid-custom-glyphs',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    const [iconWithInvalidUsage, iconWithValidUsage] = await Promise.all([
      await page.waitForSelector('#one'),
      await page.waitForSelector('#two'),
    ]);

    await expect(iconWithInvalidUsage).toMatchVisually(iconWithValidUsage);
  });

  it('should match the custom glyph snapshots', async () => {
    const url = getExampleUrl(
      'design-system',
      'icon',
      'invalid-custom-glyphs',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);

    const element = await page.$('#custom');
    const image = await element?.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
