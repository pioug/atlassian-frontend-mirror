import {
  getExampleUrl,
  navigateToUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Add Telepointer', () => {
  it('Adds the telepointer in various sitations', async () => {
    const { page } = global as { page: PuppeteerPage };
    await navigateToUrl(
      page,
      getExampleUrl(
        'editor',
        'renderer',
        'add-telepointer',
        global.__BASEURL__,
      ),
    );

    // See the example in packages/editor/renderer/src/__tests__/visual-regression/add-telepointer/add-telepointer.ts
    // for details on the test steps.
    for (let step = 0; step <= 1; step++) {
      const image = await takeElementScreenShot(
        page,
        '[data-testid="example"]',
      );
      await page.click('[data-testid="add-telepointer"]');
      expect(image).toMatchProdImageSnapshot();
    }
  });
});
