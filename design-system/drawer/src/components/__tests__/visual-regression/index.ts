import { getExampleUrl } from '@atlaskit/visual-regression/helper';
import { widths } from '../../../constants';

describe('Snapshot Test', () => {
  for (const width of widths) {
    it(`should match ${width} drawer screenshot`, async () => {
      const url = getExampleUrl(
        'core',
        'drawer',
        'drawer-widths',

        global.__BASEURL__,
      );

      const { page } = global;
      const button = `#open-${width}-drawer`;
      await page.goto(url);
      await page.waitForSelector(button);

      await page.click(button);
      await page.waitFor(300);

      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });
  }

  it('should match themed drawer screenshot', async () => {
    const url = getExampleUrl(
      'core',
      'drawer',
      'themed-drawer-with-search',
      global.__BASEURL__,
    );

    const { page } = global;
    const button = '#button';
    await page.goto(url);
    await page.waitForSelector(button);

    await page.click(button);
    await page.waitFor(300);

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
