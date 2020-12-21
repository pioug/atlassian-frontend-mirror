// import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('no-op', async () => {
    // const url = getExampleUrl(
    //   'confluence',
    //   'legacy-mobile-macros',
    //   'basic',
    //   global.__BASEURL__,
    // );
    // const { page } = global;
    // await loadPage(page, url);
    // await page.waitForSelector('[data-testid="legacy-mobile-macros"]');
    // const image = await page.screenshot();
    // expect(image).toMatchProdImageSnapshot();
    expect(true).toBe(true);
  });
});

export {}; // workaround for '--isolatedModules' flag issue. Will be removed later
