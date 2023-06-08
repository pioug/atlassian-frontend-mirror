import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const screenWidths = [360, 480, 768, 1024, 1440, 1760, 2160];

describe('Snapshot Test', () => {
  it('Media queries should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'primitives',
      'xcss-media-queries',

      global.__BASEURL__,
    );

    const { page } = global;

    for await (const screenWidth of screenWidths) {
      page.setViewport({
        width: screenWidth,
        height: 400,
      });

      await loadPage(page, url);
      await page.waitForSelector('div[data-testid=media-query-example]');
      const image = await page.screenshot();

      expect(image).toMatchProdImageSnapshot();
    }
  });
});
