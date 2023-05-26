import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  (['none', 'light', 'dark'] as const).forEach((theme) => {
    it(`Controlled expanded state example should match prod (${theme})`, async () => {
      const url = getExampleUrl(
        'design-system',
        'table-tree',
        'controlled-expanded-state',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;
      await loadPage(page, url);
      await page.waitForSelector('div[role="treegrid"]');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });

    // FIXME: This test was automatically skipped due to failure on 26/05/2023: https://product-fabric.atlassian.net/browse/DSP-10834
    it.skip(`Loading state example should match prod (${theme})`, async () => {
      const url = getExampleUrl(
        'design-system',
        'table-tree',
        'vr-loading',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;
      await loadPage(page, url, { allowedSideEffects: { animation: true } });
      await page.waitForSelector('div[role="treegrid"]');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });

    // FIXME: This test was automatically skipped due to failure on 26/05/2023: https://product-fabric.atlassian.net/browse/DSP-10835
    it.skip(`Nested loading state example should match prod (${theme})`, async () => {
      const url = getExampleUrl(
        'design-system',
        'table-tree',
        'vr-loading-nested',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;
      await loadPage(page, url, { allowedSideEffects: { animation: true } });
      await page.waitForSelector('div[role="treegrid"]');
      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    });
  });
});
